const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token =
    req.cookies?.token || req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized request" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Return 401 if the token is expired or invalid
      return res
        .status(401)
        .json({ success: false, message: "Token expired or invalid" });
    }
    req.id = user.id;
    req.role = user.role;
    next();
  });
};

module.exports = verifyToken;
