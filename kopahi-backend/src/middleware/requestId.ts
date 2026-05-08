import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const incoming = req.headers["x-request-id"];
  const id =
    typeof incoming === "string" && incoming ? incoming : crypto.randomUUID();
  (req as Request & { id?: string }).id = id;
  res.setHeader("X-Request-Id", id);
  next();
};

export default requestId;
