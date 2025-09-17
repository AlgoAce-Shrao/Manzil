const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

router.post('/submit',
  [
    body('userId').notEmpty().withMessage('userId required'),
    body('answers').isArray({ min: 1 }).withMessage('answers must be a non-empty array'),
    body('percentage12').optional().isFloat({ min: 0, max: 100 }).withMessage('percentage12 must be between 0 and 100')
  ],
  validate,
  quizController.submitQuiz
);

module.exports = router;
