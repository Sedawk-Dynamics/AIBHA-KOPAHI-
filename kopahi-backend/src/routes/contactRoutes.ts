import { Router } from "express";
import rateLimit from "express-rate-limit";
import { sendLead } from "../controllers/contactController";

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many submissions. Try again later." },
});

router.post("/", contactLimiter, sendLead);

export default router;
