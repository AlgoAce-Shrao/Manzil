const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/CollegeController');
const { query } = require('express-validator');
const validate = require('../middleware/validate');

router.get('/',
  // getAll
  collegeController.getAll
);

router.get('/nearby',
  [
    query('lat').notEmpty().withMessage('lat required').isFloat().withMessage('lat must be numeric'),
    query('lng').notEmpty().withMessage('lng required').isFloat().withMessage('lng must be numeric'),
    // query('radius').optional().isInt({ min: 1000 }).withMessage('radius must be integer (meters)')
    query('radius').optional().isInt().toInt().withMessage('radius must be integer (meters)')

  ],
  validate,
  collegeController.getNearby
);

router.get('/:id', collegeController.getById);

module.exports = router;
