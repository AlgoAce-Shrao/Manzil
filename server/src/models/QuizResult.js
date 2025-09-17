const mongoose = require("mongoose");

const QuizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: { type: Array, required: true },
  marks: { type: Number },
  analysis: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("QuizResult", QuizResultSchema);
