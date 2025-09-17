module.exports = {
  analyzeQuizPrompt: (answers, marks) => `
You are a career counselor AI.
Student scored: ${marks}% in 12th standard.
Quiz answers: ${JSON.stringify(answers)}.

1. Suggest 3 best career paths with reasoning.
2. Recommend suitable academic streams.
3. Suggest types of colleges to target.
Return JSON strictly in this format:
{
  "careerPaths": [ "Career 1", "Career 2" ],
  "streams": [ "Stream 1", "Stream 2" ],
  "recommendationSummary": "short summary"
}
`
};
