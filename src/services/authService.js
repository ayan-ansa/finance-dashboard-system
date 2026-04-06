import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const registerUserService = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await User.exists({ email });
  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 400;
    throw error;
  }

  await User.create({ name, email, password });
};

const loginUserService = async ({ email, password }) => {
  // Get user with password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);
  return { token, expiresIn: parseInt(process.env.JWT_MAX_AGE) };
};

const logoutUserService = async (res) => {
  res.clearCookie("token");
};

export default {
  RegisterUserService: registerUserService,
  LoginUserService: loginUserService,
  LogoutUserService: logoutUserService,
};
