import express from "express";
import { getAuditLogs } from "../controllers/auditController.js";
import { protectStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectStaff);

router.get("/", getAuditLogs);

export default router;
