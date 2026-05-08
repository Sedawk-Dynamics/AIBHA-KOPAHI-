import type { Request, Response, NextFunction } from "express";

type AuthedUser = { id: string; role: "user" | "vendor" | "admin" };

export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user as AuthedUser | undefined;
  if (user && user.role === "admin") {
    next();
    return;
  }
  res.status(403).json({ success: false, message: "Admin access only" });
};

export const vendorOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user as AuthedUser | undefined;
  if (user && (user.role === "vendor" || user.role === "admin")) {
    next();
    return;
  }
  res.status(403).json({ success: false, message: "Vendor or admin access only" });
};

export default adminOnly;
