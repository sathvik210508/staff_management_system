import express from "express";
import {
  getPatients,
  getPatientById,
  checkDuplicates,
  registerPatient,
  updateDemographics
} from "../controllers/patientController.js";
import { protectStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectStaff);

router.get("/", getPatients);
router.get("/check-duplicates", checkDuplicates);
router.get("/:id", getPatientById);
router.post("/register", registerPatient);
router.put("/:id/demographics", updateDemographics);

export default router;
