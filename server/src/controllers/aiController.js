const { chat } = require("../services/openaiService");

exports.careerChat = async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await chat([
      { role: "system", content: "You are a helpful career counselor." },
      { role: "user", content: message }
    ]);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
