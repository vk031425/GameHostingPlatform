const jwt = require("jsonwebtoken");

const verifyuser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token || token === "") {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyuser;