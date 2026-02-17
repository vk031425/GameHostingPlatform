const verifyuser = async (req, res, next) => {
  // const idToken = req.headers.authorization?.split("Bearer ")[1];

  // if (!idToken) {
  //   return res.status(401).json({ error: "Unauthorized - No token provided" });
  // }

  // try {
  //   const decodedToken = await admin.auth().verifyIdToken(idToken);
  //   req.user = decodedToken;
  //   next(); // proceed to the route
  // } catch (err) {
  //   console.error("Invalid Firebase ID token:", err);
  //   return res.status(403).json({ error: "Forbidden - Invalid token" });
  // }
};

module.exports = verifyuser;
