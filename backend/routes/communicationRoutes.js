import express from "express";
import {
  getCallList,
  logCall,
  getCallHistory,
  sendReminder
} from "../controllers/communicationController.js";
import { protectStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectStaff);

router.get("/list", getCallList);
router.post("/log", logCall);
router.get("/history", getCallHistory);
router.post("/send-reminder", sendReminder);

export default router;
