const TimelineEvent = require('../models/TimelineEvent');

/**
 * POST /api/timeline
 * body: { collegeId, title, date, note, type }
 * protected
 */
exports.createEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { collegeId, title, date, note, type } = req.body;
    if (!collegeId || !title || !date) return res.status(400).json({ message: 'collegeId, title, date required' });

    const ev = await TimelineEvent.create({ userId, collegeId, title, date, note, type });
    res.json(ev);
  } catch (err) {
    console.error('createEvent', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEventsForCollege = async (req, res) => {
  try {
    const { collegeId } = req.query;
    const userId = req.user._id; // protected
    if (!collegeId) return res.status(400).json({ message: 'collegeId required' });

    const events = await TimelineEvent.find({ collegeId, userId }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('getEventsForCollege', err);
    res.status(500).json({ message: 'Server error' });
  }
};
