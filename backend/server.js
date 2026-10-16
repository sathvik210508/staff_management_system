import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initDB } from "./config/db.js";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import queueRoutes from "./routes/queueRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import communicationRoutes from "./routes/communicationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import internalRoutes from "./routes/internalRoutes.js";

dotenv.config();

// Initialize Staff Portal database
initDB();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-internal-secret"]
  })
);
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.json({
    message: "LIORA HOSPITALS — Dedicated Staff & Reception Portal API",
    status: "Operational",
    version: "1.0.0",
    port: PORT,
    portal: "Staff Portal (Reception, Coordination & Triage)"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hospital: "LIORA HOSPITALS",
    portal: "Staff Portal",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/communication", communicationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/internal", internalRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[Staff Portal Server Error]:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏥 LIORA HOSPITALS — STAFF PORTAL BACKEND ACTIVE`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🔐 Authentication: Staff ID + Password`);
  console.log(`📋 Reception, Waiting Queue & Appointment Coordination`);
  console.log(`=======================================================`);
});

export default app;
