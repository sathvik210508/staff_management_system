import express from "express";
import {
  updateAppointmentStatusFromExternal,
  receiveAppointmentFromExternal
} from "../controllers/internalSyncController.js";
import { protectInternal } from "../middleware/internalAuthMiddleware.js";

const router = express.Router();

// Protect all cross-portal routes with x-internal-secret
router.use(protectInternal);

router.patch("/appointments/:id/status", updateAppointmentStatusFromExternal);
router.post("/appointments", receiveAppointmentFromExternal);

export default router;
