const { chat } = require("../openaiService");
const { analyzeQuizPrompt } = require("../prompts/careerAnalysisPrompts");

async function analyzeQuiz(answers, marks) {
  const prompt = analyzeQuizPrompt(answers, marks);
  const res = await chat([{ role: "user", content: prompt }]);

  try {
    return JSON.parse(res); // Parse AI JSON
  } catch (err) {
    return { error: "Invalid AI response", raw: res };
  }
}

module.exports = { analyzeQuiz };
