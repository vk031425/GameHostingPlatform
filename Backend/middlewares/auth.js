const jwt = require("jsonwebtoken");

const verifyuser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  if (token === "") {
    return res.status(401).json({ error: "Unauthorized - Empty token" });
  } else {
    let data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  }
};

module.exports = verifyuser;
