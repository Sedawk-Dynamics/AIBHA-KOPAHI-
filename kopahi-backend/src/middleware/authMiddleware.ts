import jwt, { JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import db from "../db";
import asyncHandler from "./asyncHandler";

type DecodedToken = JwtPayload & { id?: string; sub?: string; role?: string };

// v9-REST tokens (signed by kopahi-frontend/app/lib/auth/jwt.ts) carry the
// user id in `sub` and ship with these issuer/audience claims. Legacy Express
// tokens (issued by kopahi-backend's old /api/auth/login) carry the id in
// `id` and have no issuer/audience. We accept both so the dashboard works
// during and after the auth transition.
const JWT_ISSUER = "kopahi.com";
const JWT_AUDIENCE = "kopahi-web";

function verifyToken(token: string): DecodedToken | null {
  const accessSecret = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
  if (accessSecret) {
    try {
      return jwt.verify(token, accessSecret, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      }) as DecodedToken;
    } catch {
      // not a v9 token (or wrong secret) — fall through to legacy path
    }
  }

  const legacySecret = process.env.JWT_SECRET;
  if (legacySecret) {
    try {
      return jwt.verify(token, legacySecret) as DecodedToken;
    } catch {
      // both paths failed
    }
  }

  return null;
}

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

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  const userId = decoded.sub || decoded.id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid token payload",
    });
  }

  const user = await db.users.findById(userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User no longer exists",
    });
  }
  (req as Request & { user?: unknown }).user = user;
  next();
});

export default protect;
