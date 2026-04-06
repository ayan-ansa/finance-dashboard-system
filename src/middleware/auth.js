import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/apiResponse.js";

export const checkAuth = async (req, res, next) => {
  
  const { token } = req.cookies;

  if (!token) {
    return errorResponse(
      res,
      401,
      "Your session has expired. Please log in again.",
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id).lean();

    if (!user)
      return errorResponse(res, 401, "Your account has been deactivated");

    req.user = user; 
    next();
  } catch (err) {
    return errorResponse(res, 401, "Not authorized, invalid token");
  }
};
