const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnAuthenticatedError } = require("../errors");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// REGISTER METHOD
// const register = async (req, res) => {
//   const { name, email, password } = req.body;
// if(!name || !email || !password ){
//   throw new BadRequestError("Please fill in all fields")
// }
//   const salt = await bcrypt.genSalt(10)
//   const hashedPassword = await bcrypt.hash(password, salt)
//   const tempUser = {name, email, password: hashedPassword}
//   const user = await User.create({ ...tempUser });
//   res.status(StatusCodes.CREATED).json({ user });
// };

// REGISTER LATER METHOD
// const register = async (req, res) => {
//   const user = await User.create({ ...req.body });
//   const token = jwt.sign({ userId: user._id, name: user.name }, "jwtsecret", {
//     expiresIn: "30d",
//   });
//   res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
// };

// REGISTER LATEST METHOD WITH getName from MODEL
// const register = async (req, res) => {
//   const user = await User.create({ ...req.body });
//   const token = jwt.sign({ userId: user._id, name: user.name }, "jwtsecret", {
//     expiresIn: "30d",
//   });
//   res.status(StatusCodes.CREATED).json({ user: { name: user.getName() }, token });
// };

// REGISTER MOST RECENT LATEST METHOD
const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

// LOGIN WITHOUT MONGO MIDDLEWARE
// const login = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     throw new BadRequestError("Please provide email and password");
//   }
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new UnAuthenticatedError("Invalid Credentials");
//   }

//   const isMatch = await bcrypt.compare(password, user.password)
//  if (!isMatch) {
//    throw new UnAuthenticatedError("Invalid Credentials");
//  }
//   const token = user.createJWT();
//   res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
// };

// LOGIN WITH MONGO MIDDLEWARE
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials- email incorrect");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials- check password");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
