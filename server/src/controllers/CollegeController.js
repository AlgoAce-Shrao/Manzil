const College = require('../models/College');
const QuizResult = require('../models/QuizResult');

/**
 * GET /api/colleges
 * Optional query: q (search), state, city
 */
exports.getAll = async (req, res) => {
  try {
    const { q, state, city, limit = 50 } = req.query;
    const filter = {};
    if (q) filter.name = { $regex: q, $options: 'i' };
    if (state) filter.state = state;
    if (city) filter.city = city;

    const colleges = await College.find(filter).limit(parseInt(limit, 10));
    res.json(colleges);
  } catch (err) {
    console.error('getAll colleges', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * GET /api/colleges/nearby?lat=..&lng=..&radius=meters&stream=...&userId=...&onlyGovt=true
 * Returns colleges with distance (meters). If userId provided, compute simple match score using last quiz result.
 */
exports.getNearby = async (req, res) => {
  try {
    const { lat, lng, radius = 50000, stream, userId, onlyGovt } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'lat & lng required' });

    const maxDistance = parseInt(radius, 10);
    const near = {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)]
    };

    // Build query for geoNear (filter on courses if stream provided)
    const geoQuery = {};
    if (stream) geoQuery['courses.name'] = { $regex: stream, $options: 'i' };
    if (onlyGovt === 'true') geoQuery.type = 'Government';

    const pipeline = [
      {
        $geoNear: {
          near,
          distanceField: 'distance',
          spherical: true,
          maxDistance,
          query: geoQuery
        }
      },
      {
        $project: {
          name: 1,
          state: 1,
          city: 1,
          courses: 1,
          admissionDates: 1,
          contact: 1,
          facilities: 1,
          location: 1,
          distance: 1,
          type: 1,
          reviews: 1
        }
      }
    ];

    let results = await College.aggregate(pipeline);

    // Add average rating (computed from reviews array)
    results = results.map(r => {
      const ratings = (r.reviews || []).map(rv => rv.rating || 0);
      const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;
      return { ...r, avgRating };
    });

    // If userId is provided, compute a simple match score using last quiz's aiRecommendations
    if (userId) {
      const lastQuiz = await QuizResult.findOne({ userId }).sort({ createdAt: -1 }).lean();
      const topStreams = (lastQuiz?.aiRecommendations || []).slice(0, 3).map(s => (s.stream || '').toLowerCase());
      results = results.map(r => {
        // interest match count
        let interestMatch = 0;
        (r.courses || []).forEach(c => {
          const cname = (c.name || '').toLowerCase();
          topStreams.forEach(ts => { if (ts && cname.includes(ts)) interestMatch += 1; });
        });
        // proximity score normalised 0..1 (maxDistance considered)
        const proximityScore = Math.max(0, (maxDistance - r.distance) / maxDistance);
        // interest multiplier 0..1
        const interestScore = topStreams.length ? Math.min(1, interestMatch / topStreams.length) : 0;
        const finalScore = +(proximityScore * 0.6 + interestScore * 0.4).toFixed(3);
        return { ...r, matchScore: finalScore };
      });
      // sort descending by matchScore
      results.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    }

    res.json(results);
  } catch (err) {
    console.error('getNearby error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// exports.getById = async (req, res) => {
//   try {
//     const college = await College.findById(req.params.id);
//     if (!college) return res.status(404).json({ message: 'College not found' });
//     res.json(college);
//   } catch (err) {
//     console.error('getById', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


exports.getById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id).lean();
    if (!college) return res.status(404).json({ message: 'College not found' });

    // Compute average rating
    const ratings = (college.reviews || []).map(r => r.rating || 0);
    const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null;

    res.json({
      ...college,
      avgRating
    });
  } catch (err) {
    console.error('getById', err);
    res.status(500).json({ message: 'Server error' });
  }
};
