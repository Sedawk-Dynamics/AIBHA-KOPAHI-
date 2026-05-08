import multer, { StorageEngine } from "multer";
import path from "path";
import type { Request } from "express";

const haveCloudinary = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

let storage: StorageEngine;

if (haveCloudinary) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { CloudinaryStorage } = require("multer-storage-cloudinary");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const cloudinary = require("../config/cloudinary").default;

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "kopahi-products",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
  });
} else {
  // eslint-disable-next-line no-console
  console.warn("[upload] Cloudinary env not set — falling back to local disk uploads");
  storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads/products/"),
    filename: (_req, file, cb) =>
      cb(
        null,
        `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
      ),
  });
}

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, accept?: boolean) => void
): void => {
  const allowed = /jpg|jpeg|png|webp/i;
  const extOk = allowed.test(path.extname(file.originalname));
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
    return;
  }
  cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

(upload as typeof upload & { usingCloudinary: boolean }).usingCloudinary = haveCloudinary;

export default upload as typeof upload & { usingCloudinary: boolean };
