const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateTokens } = require("../config/jwt");
// const { generateTokens, verifyRefresh } = require("../config/jwt");


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({ name, email, password: hashed });

    // generate access + refresh tokens
    const { accessToken, refreshToken } = generateTokens({ userId: user._id });

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
      refreshToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// const { generateTokens } = require("../config/jwt");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ NEW: generate both tokens
    const { accessToken, refreshToken } = generateTokens({ userId: user._id });

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

