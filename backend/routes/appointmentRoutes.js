import express from "express";
import {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
  updateAdminNotes
} from "../controllers/appointmentController.js";
import { protectStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectStaff);

router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.post("/", createAppointment);
router.patch("/:id/status", updateAppointmentStatus);
router.post("/:id/reschedule", rescheduleAppointment);
router.post("/:id/cancel", cancelAppointment);
router.patch("/:id/notes", updateAdminNotes);

export default router;
