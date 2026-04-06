export const checkPermission = (currentUser, targetUser) => {
  const rolesHierarchy = {
    admin: 3,
    analyst: 2,
    viewer: 1,
  };

  //prevent self-role-change and prevent changing role to same or higher role

  if (currentUser._id.equals(targetUser._id)) {
    return false;
  } else if (
    rolesHierarchy[currentUser.role] === rolesHierarchy[targetUser.role]
  ) {
    return false;
  }
  return true;
};

export default checkPermission;
