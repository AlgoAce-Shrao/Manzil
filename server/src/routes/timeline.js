const express = require('express');
const router = express.Router();
const timelineController = require('../controllers/timelineController');
const auth = require('../middleware/auth');
const { body, query } = require('express-validator');
const validate = require('../middleware/validate');

router.post('/',
  auth,
  [
    body('collegeId').notEmpty().withMessage('collegeId required'),
    body('title').notEmpty().withMessage('title required'),
    body('date').isISO8601().withMessage('date must be a valid ISO8601 date')
  ],
  validate,
  timelineController.createEvent
);

router.get('/',
  auth,
  [
    query('collegeId').notEmpty().withMessage('collegeId required')
  ],
  validate,
  timelineController.getEventsForCollege
);

module.exports = router;
