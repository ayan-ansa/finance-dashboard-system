import User from "../models/User.js";
import checkPermission from "../utils/checkPermission.js";

const getAllUsersService = async () => {
  return await User.find().lean();
};

const getUserByIdService = async (id) => {
  return await User.findById(id).lean();
};

const changeUserRoleService = async (userId, newRole, currentUser) => {
  const targetUser = await User.findById(userId);

  if (!targetUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // prevent self-role-change
  if (!checkPermission(currentUser, targetUser)) {
    const error = new Error(
      "You don't have permission to change this user's role",
    );
    error.statusCode = 403;
    throw error;
  }

  targetUser.role = newRole;
  await targetUser.save();

};

const changeUserStatusService = async (userId, newStatus) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  user.status = newStatus;
  await user.save();
};

const deleteUserService = async (id) => {
  const deletedUser = await User.findById(id);
  if (!deletedUser) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  await deletedUser.deleteOne();
};

export default {
  GetAllUsersService: getAllUsersService,
  GetUserByIdService: getUserByIdService,
  ChangeUserRoleService: changeUserRoleService,
  ChangeUserStatusService: changeUserStatusService,
  DeleteUserService: deleteUserService,
};
