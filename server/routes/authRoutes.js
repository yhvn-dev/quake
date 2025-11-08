import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyToken,
  verifyEmail,
  resendVerification,
  updateProfile,
  getLocations,
} from "../controller/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/verify", verifyToken);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

router.put("/profile", updateProfile);
router.get("/locations", getLocations);

export default router;
