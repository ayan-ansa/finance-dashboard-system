import express from "express";
import {
  getSummary,
  getCategorySummary,
  getRecentActivity,
  getMonthlyTrends,
  getWeeklyTrends,
} from "../controllers/dashboardController.js";
import { checkAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/roleGuard.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(checkAuth);

// All roles can access summary and recent activity
router.get("/summary", getSummary);
router.get("/recent", getRecentActivity);

// Analyst and Admin only
router.get(
  "/category-summary",
  authorize("analyst", "admin"),
  getCategorySummary,
);
router.get("/trends/monthly", authorize("analyst", "admin"), getMonthlyTrends);
router.get("/trends/weekly", authorize("analyst", "admin"), getWeeklyTrends);

export default router;
