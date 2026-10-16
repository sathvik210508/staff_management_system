import express from "express";
import {
  loginStaff,
  getMe,
  updateProfile,
  changePassword,
  getStaffDirectory
} from "../controllers/authController.js";
import { protectStaff } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginStaff);
router.get("/me", protectStaff, getMe);
router.put("/profile", protectStaff, updateProfile);
router.put("/change-password", protectStaff, changePassword);
router.get("/directory", protectStaff, getStaffDirectory);

export default router;
