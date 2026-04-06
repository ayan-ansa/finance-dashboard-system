import express from "express";
import {
  changeUserRole,
  changeUserStatus,
  deleteUser,
  getAllUsers,
  getCurrentUser,
  getUserById,
} from "../controllers/userController.js";
import { checkAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/roleGuard.js";
const router = express.Router();

router.use(checkAuth);

router.get("/me", getCurrentUser);

router.get("/", authorize("admin"), getAllUsers);
router.get("/:userId", authorize("admin"), getUserById);
router.patch("/:userId/role", checkAuth, authorize("admin"), changeUserRole);
router.patch("/:userId/status", checkAuth, authorize("admin"), changeUserStatus);
router.delete("/:userId", authorize("admin"), deleteUser);

export default router;
