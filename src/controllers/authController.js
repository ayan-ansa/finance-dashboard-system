import AuthServices from "../services/authService.js";
import { successResponse } from "../utils/apiResponse.js";
import { sanitizeObject } from "../utils/sanitizeInput.js";
import { validateInputs } from "../utils/validateInputs.js";
import { loginValidator, registerValidator } from "../validators/authSchema.js";

export const registerUser = async (req, res, next) => {
  try {
    const sanitizedData = sanitizeObject(req.body);
    const parsedData = validateInputs(registerValidator, sanitizedData);
    await AuthServices.RegisterUserService(parsedData);
    successResponse(res, 201, "User registered successfully!");
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const sanitizedData = sanitizeObject(req.body);
    const parsedData = validateInputs(loginValidator, sanitizedData);
    const { token, expiresIn } =
      await AuthServices.LoginUserService(parsedData);
      
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: expiresIn,
    });

    successResponse(res, 200, "Login successful!");
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    await AuthServices.LogoutUserService(res);
    successResponse(res, 200, "Logout successful!");
  } catch (error) {
    next(error);
  }
};
