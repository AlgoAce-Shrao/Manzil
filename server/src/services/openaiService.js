const OpenAI = require("openai");
const { openai } = require("../config/ai");

const client = new OpenAI({ apiKey: openai.apiKey });

async function chat(messages) {
  const res = await client.chat.completions.create({
    model: openai.model,
    messages,
    temperature: 0.7,
    max_tokens: 800
  });
  return res.choices[0].message.content;
}

module.exports = { chat };
