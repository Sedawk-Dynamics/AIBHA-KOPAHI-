import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();

import checkEnv from "./utils/envCheck";
import logger from "./utils/logger";
import requestId from "./middleware/requestId";
import httpLogger from "./middleware/httpLogger";
import { connectDB } from "./config/db";
import { notFound, errorHandler } from "./middleware/errorMiddleware";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import contactRoutes from "./routes/contactRoutes";
import adminRoutes from "./routes/adminRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import cartRoutes from "./routes/cartRoutes";
import blogRoutes from "./routes/blogRoutes";
import couponRoutes from "./routes/couponRoutes";
import vendorRoutes from "./routes/vendorRoutes";

checkEnv();

const app = express();

app.set("trust proxy", 1);

app.use(requestId);

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Allow both the customer site and the admin app, plus any extra origins
// configured via FRONTEND_URL / ADMIN_URL.
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  process.env.ADMIN_URL || "http://localhost:3001",
];

app.use(
  cors({
    origin: (origin, cb) => {
      // Same-origin / curl / no-origin requests pass through
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(httpLogger);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API documentation (OpenAPI)
try {
  const openapi = YAML.load(path.join(process.cwd(), "openapi.yaml"));
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(openapi, { customSiteTitle: "Kopahi API Docs" })
  );
  app.get("/api/openapi.json", (_req, res) => {
    res.json(openapi);
  });
} catch (err) {
  logger.warn("openapi_load_failed", { err: (err as Error).message });
}

app.get("/", (_req, res) => {
  res.json({
    success: true,
    name: "Kopahi API",
    version: "1.0.0",
    docs: "/api/docs",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    uptime: process.uptime(),
    env: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/vendor", vendorRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      logger.info("server_started", { port: PORT, env: process.env.NODE_ENV || "development" })
    );
  })
  .catch((err: Error) => {
    logger.error("startup_failed", { err: err.message });
    process.exit(1);
  });
