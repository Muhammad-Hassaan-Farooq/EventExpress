const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const user = jwt.verify(token.split(" ")[1], "MY_SECRET");
    req.user = user;
    next();
  } catch (e) {
    return res.json({ success: false, message: "Invalid token" });
  }
};

module.exports = { verifyToken };
