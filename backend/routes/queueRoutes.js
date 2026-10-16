import express from "express";
import {
  getLiveQueue,
  checkInPatient,
  updateQueueStatus,
  notifyDoctor
} from "../controllers/queueController.js";
import { protectStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectStaff);

router.get("/", getLiveQueue);
router.post("/check-in", checkInPatient);
router.patch("/:id/status", updateQueueStatus);
router.post("/:id/notify-doctor", notifyDoctor);

export default router;
