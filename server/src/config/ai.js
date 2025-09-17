require("dotenv").config();
module.exports = {
  provider: process.env.AI_PROVIDER || "openai",
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo"
  }
};
