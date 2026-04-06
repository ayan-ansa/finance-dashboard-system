import { errorResponse } from "./apiResponse.js";

const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    return errorResponse(res, 400, "Validation Error");
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, 400, `${field} already exists`);
  }

  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, 401, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "Token expired");
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  errorResponse(res, statusCode, message);
};

export default errorHandler;
