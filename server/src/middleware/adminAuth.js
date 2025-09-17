// Simple admin middleware: check header x-admin-secret
module.exports = function (req, res, next) {
  const headerSecret = req.headers['x-admin-secret'];
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return res.status(500).json({ message: 'Admin secret not configured on server' });
  }
  if (!headerSecret || headerSecret !== adminSecret) {
    return res.status(403).json({ message: 'Forbidden: invalid admin secret' });
  }
  // allowed
  next();
};
