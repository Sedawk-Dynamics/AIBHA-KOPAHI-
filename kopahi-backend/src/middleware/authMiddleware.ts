import jwt, { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import db from "../db";
import asyncHandler from "./asyncHandler";

type DecodedToken = JwtPayload & { id: string; role: string };

const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;
  const auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer ")) {
    token = auth.split(" ")[1];
  } else if ((req as Request & { cookies?: Record<string, string> }).cookies?.token) {
    token = (req as Request & { cookies?: Record<string, string> }).cookies?.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized — token missing",
    });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as DecodedToken;
    const user = await db.users.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }
    (req as Request & { user?: unknown }).user = user;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
});

export default protect;
