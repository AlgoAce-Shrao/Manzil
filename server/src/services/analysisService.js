const openaiService = require('./openaiService');

/**
 * Safe JSON extraction: finds first "{" and last "}" and tries to parse.
 * This is not bulletproof but works for many cases where model outputs extra text.
 */
function extractJson(text) {
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1) throw new Error('No JSON found');
  const sub = text.substring(first, last + 1);
  return JSON.parse(sub);
}

async function analyzeQuiz({ answers, percentage12, streamPreference, userId }) {
  // build a short summary of answers for prompt (you can expand it)
  const answersSummary = answers.map(a => `${a.qId || 'q'}:${a.choice}`).join('; ');

  const userSummary = {
    percentage12,
    streamPreference,
    answersSummary
  };

  const systemPrompt = `You are an expert career advisor. Given a compact user profile and answers, return a strict JSON only (no explanation) that includes:
{
  "aiRecommendations": [{"stream":"Engineering","score":0.9,"why":"..."}],
  "careerTreeJson": {"nodes":[{"id":"n1","label":"B.Tech CS","type":"degree"}],"edges":[{"from":"n1","to":"n2"}]},
  "recommendedColleges": [{"name":"National Institute X","score":0.83}]
}
Make sure to return valid JSON ONLY.`;

  const userPrompt = `Profile: ${JSON.stringify(userSummary)}.
Return JSON as specified.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  // call OpenAI
  const raw = await openaiService.sendChat(messages, process.env.OPENAI_MODEL || 'gpt-3.5-turbo', 900, 0.7);
  const content = raw.choices && raw.choices[0] && raw.choices[0].message && raw.choices[0].message.content;
  if (!content) throw new Error('No content from OpenAI');

  // parse JSON from response
  const parsed = extractJson(content);
  // Normalize fields if needed
  return {
    aiRecommendations: parsed.aiRecommendations || [],
    careerTreeJson: parsed.careerTreeJson || parsed.careerTree || {},
    recommendedColleges: parsed.recommendedColleges || []
  };
}

// Fallback deterministic analysis (if no OpenAI key or failure)
async function analyzeQuizFallback({ answers, percentage12, streamPreference }) {
  // Very simple heuristic fallback:
  const guessStream = streamPreference || 'General Science';

  const aiRecommendations = [{ stream: guessStream, score: 0.8, why: 'Fallback heuristic based on given streamPreference/answers' }];

  const careerTreeJson = {
    nodes: [
      { id: 'n1', label: `12th - ${guessStream}`, type: 'pre-degree' },
      { id: 'n2', label: guessStream === 'Engineering' ? 'B.Tech (Example Branch)' : 'Bachelor Degree', type: 'degree' },
      { id: 'n3', label: 'Entry-level Job / Internship', type: 'job' }
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' }
    ]
  };

  const recommendedColleges = [
    { name: 'Local Institute A (seed)', score: 0.75 },
    { name: 'Local Institute B (seed)', score: 0.65 }
  ];

  return { aiRecommendations, careerTreeJson, recommendedColleges };
}

module.exports = { analyzeQuiz, analyzeQuizFallback };
