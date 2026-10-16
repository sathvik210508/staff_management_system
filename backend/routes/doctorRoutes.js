import express from "express";
import { getDoctors, getDoctorSlots } from "../controllers/doctorController.js";
import { protectStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

// Publicly accessible for Gateway and Patient portal, while enriching status
router.get("/", getDoctors);
router.get("/:doctorId/slots", getDoctorSlots);

export default router;
