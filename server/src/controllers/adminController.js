const College = require('../models/College');
const csv = require('csvtojson');

/**
 * Create one college
 * POST /api/admin/colleges
 * body: { name, state, city, lng, lat, courses (array), admissionDates (array), contact, facilities (array) }
 */
exports.createCollege = async (req, res) => {
  try {
    const { name, state, city, lng, lat, courses = [], admissionDates = [], contact = {}, facilities = [] } = req.body;
    if (!name || typeof lng === 'undefined' || typeof lat === 'undefined') {
      return res.status(400).json({ message: 'name, lng, lat are required' });
    }

    const college = await College.create({
      name,
      state,
      city,
      location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      courses,
      admissionDates,
      contact,
      facilities
    });

    res.json(college);
  } catch (err) {
    console.error('createCollege error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Import CSV
 * POST /api/admin/colleges/import-csv
 * accepts multipart/form-data; file field name: file
 * CSV expected columns:
 * name,state,city,lng,lat,courses,admissionDates,contactPhone,contactEmail,facilities
 *
 * courses -> pipe separated, e.g. "B.Tech CS|B.Tech EE"
 * admissionDates -> semicolon separated entries of Title:YYYY-MM-DD:YYYY-MM-DD
 * facilities -> pipe separated
 */
exports.importCsv = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'CSV file required (field name "file")' });

    const csvString = req.file.buffer.toString('utf8');
    const jsonArr = await csv().fromString(csvString);

    const toInsert = jsonArr.map(row => {
      const courses = (row.courses || '').split('|').filter(Boolean).map(c => ({ name: c.trim(), eligibility: '' }));
      const facilities = (row.facilities || '').split('|').filter(Boolean).map(f => f.trim());
      const admissionDates = (row.admissionDates || '').split(';').filter(Boolean).map(item => {
        // item -> Title:YYYY-MM-DD:YYYY-MM-DD
        const parts = item.split(':').map(p => p.trim());
        return { title: parts[0] || 'Admission', start: parts[1] ? new Date(parts[1]) : null, end: parts[2] ? new Date(parts[2]) : null };
      });

      const lng = parseFloat(row.lng || row.longitude || row.long || 0);
      const lat = parseFloat(row.lat || row.latitude || 0);

      return {
        name: row.name,
        state: row.state || '',
        city: row.city || '',
        location: { type: 'Point', coordinates: [lng, lat] },
        courses,
        admissionDates,
        contact: { phone: row.contactPhone || '', email: row.contactEmail || '' },
        facilities
      };
    });

    const inserted = await College.insertMany(toInsert);
    res.json({ inserted: inserted.length, sample: inserted.slice(0, 5) });
  } catch (err) {
    console.error('importCsv error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
