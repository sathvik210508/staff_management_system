import express from "express";
import { getReportMetrics, exportReportsCSV } from "../controllers/reportController.js";
import { protectStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protectStaff);

router.get("/metrics", getReportMetrics);
router.get("/export/csv", exportReportsCSV);

export default router;
