const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token || token === "") {
    return next();
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
  } catch (err) {
    // Invalid token — ignore silently
  }
  next();
};

module.exports = optionalAuth;
