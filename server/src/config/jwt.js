const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "super-secret-key";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "another-secret-key";
const ACCESS_EXPIRY = "1h";
const REFRESH_EXPIRY = "7d";

// generate access + refresh tokens
function generateTokens(payload) {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRY });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
  return { accessToken, refreshToken };
}

// verify access token
function verifyAccess(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

// verify refresh token
function verifyRefresh(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = { generateTokens, verifyAccess, verifyRefresh };
