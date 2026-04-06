import { errorResponse, successResponse } from "../utils/apiResponse.js";
import UserServices from "../services/userService.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";
import { statusSchema } from "../validators/authSchema.js";

export const getCurrentUser = async (req, res) => {
  if (!req.user) {
    return errorResponse(res, 200, "User not found");
  }
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserServices.GetAllUsersService();
    successResponse(res, 200, "Users fetched successfully", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserServices.GetUserByIdService(req.params.userId);
    successResponse(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req, res, next) => {
  const { userId } = req.params;
  const currentUser = req.user;

  const sanitizedData = sanitizeInput(req.body.role);

  const { success, data } = roleSchema.safeParse(sanitizedData);

  if (!success) {
    return errorResponse(res, 400, "Invalid role value");
  }

  try {
    await UserServices.ChangeUserRoleService(userId, data, currentUser);
    successResponse(res, 200, "User role updated successfully");
  } catch (error) {
    next(error);
  }
};

export const changeUserStatus = async (req, res, next) => {
  const { userId } = req.params;
  const sanitizedStatus = sanitizeInput(req.body.status);
  const { success, data } = statusSchema.safeParse(sanitizedStatus);

  if (!success) {
    return errorResponse(res, 400, "Invalid status value");
  }

  try {
    await UserServices.ChangeUserStatusService(userId, data);
    successResponse(res, 200, "User status updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await UserServices.DeleteUserService(req.params.userId);
    successResponse(res, 200, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
