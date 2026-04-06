import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import { checkAuth } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",checkAuth, logoutUser);

export default router