import { Router } from "express";
import rateLimit from "express-rate-limit";
import { buildLimiterStore } from "../utils/rateLimitStore";
import protect from "../middleware/authMiddleware";
import {
  registerUser,
  registerVendor,
  loginUser,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  resendVerification,
} from "../controllers/authController";

const router = Router();

// Auth abuse limiters — 5 attempts per 15 min per IP for the credential paths.
// When REDIS_URL is set, the bucket is shared across replicas via
// rate-limit-redis; otherwise express-rate-limit's default MemoryStore is
// used (fine for single-replica deploys).
const credentialLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: buildLimiterStore("credential"),
  message: {
    success: false,
    message: "Too many attempts. Please try again in a few minutes.",
  },
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  store: buildLimiterStore("password-reset"),
  message: { success: false, message: "Too many reset attempts. Try again later." },
});

router.post("/register", credentialLimiter, registerUser);
router.post("/register-vendor", credentialLimiter, registerVendor);
router.post("/login", credentialLimiter, loginUser);
router.post("/logout", protect, logout);

router.get("/me", protect, getProfile);
// PATCH is the canonical verb for partial updates; PUT is kept as an alias
// for any older callers.
router.patch("/me", protect, updateProfile);
router.put("/me", protect, updateProfile);
router.patch("/me/password", protect, changePassword);
router.put("/me/password", protect, changePassword);

router.post("/forgot-password", passwordResetLimiter, requestPasswordReset);
router.post("/reset-password", passwordResetLimiter, resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", protect, resendVerification);

export default router;
