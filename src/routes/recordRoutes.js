import express from "express";
import { authorize } from "../middleware/roleGuard.js";
import { checkAuth } from "../middleware/auth.js";
import { createRecord, deleteRecord, getAllRecords, getRecordById, updateRecord } from "../controllers/recordController.js";
const router = express.Router();

router.use(checkAuth); // All routes require authentication
router.get("/", getAllRecords);
router.get("/:id", getRecordById);

// Write routes — Admin only
router.post("/", authorize("admin"), createRecord);
router.put("/:id", authorize("admin"), updateRecord);
router.delete("/:id", authorize("admin"), deleteRecord);

export default router;
