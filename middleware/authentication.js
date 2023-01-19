const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnAuthenticatedError } = require("../errors");

const authMiddleware = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes

    // ALTERNATE code
    // const user = User.findById(payload.id).select("-password")
    // req.user = user

    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};

module.exports = authMiddleware;
