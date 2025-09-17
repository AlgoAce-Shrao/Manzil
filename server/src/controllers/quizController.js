const QuizResult = require("../models/QuizResult");
const { analyzeQuiz } = require("../services/analysis/careerAnalysisService");

exports.submitQuiz = async (req, res) => {
  try {
    const { answers, marks } = req.body;
    const analysis = await analyzeQuiz(answers, marks);

    const result = new QuizResult({
      user: req.userId,
      answers,
      marks,
      analysis
    });
    await result.save();

    res.json({ ok: true, analysis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
