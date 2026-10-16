import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const protectStaff = (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Authentication token required."
      });
    }

    const secret = process.env.JWT_SECRET || "liora_hospitals_staff_portal_jwt_secret_secure_key_2026";
    const decoded = jwt.verify(token, secret);

    const staff = db.findOne("staff", (s) => s.staffId === decoded.staffId || s.id === decoded.id);

    if (!staff || !staff.isActive) {
      return res.status(401).json({
        success: false,
        message: "Staff session invalid or account inactive."
      });
    }

    req.staff = {
      id: staff.id,
      staffId: staff.staffId,
      name: staff.name,
      role: staff.role,
      department: staff.department,
      desk: staff.desk,
      permissions: staff.permissions || []
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token."
    });
  }
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.staff) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }
    const perms = req.staff.permissions || [];
    if (perms.includes("all") || perms.includes(permission)) {
      return next();
    }
    return res.status(403).json({
      success: false,
      message: `Permission denied. Required privilege: ${permission}`
    });
  };
};

export default protectStaff;
