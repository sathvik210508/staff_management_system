import dotenv from "dotenv";
dotenv.config();

const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET || "liora_cross_portal_internal_secure_api_secret_2026_x89f";

export const protectInternal = (req, res, next) => {
  const secretHeader = req.headers["x-internal-secret"];
  if (!secretHeader || secretHeader !== INTERNAL_API_SECRET) {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Invalid cross-portal internal API secret."
    });
  }
  next();
};

export default protectInternal;
