import express from "express";
import {
  getStaffNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from "../controllers/notificationController.js";
import { protectStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectStaff);

router.get("/", getStaffNotifications);
router.patch("/:id/read", markNotificationRead);
router.patch("/read-all", markAllNotificationsRead);

export default router;
