const jwt = require("jsonwebtoken");
const user = require("../models/user");

module.exports = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from the token
      req.admin = await user.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Not authorized" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};