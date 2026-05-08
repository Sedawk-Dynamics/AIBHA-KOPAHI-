import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const fields = {
      requestId: (req as Request & { id?: string }).id,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
      ip: req.ip,
      userId: (req.user as { id?: string } | undefined)?.id,
    };
    if (res.statusCode >= 500) logger.error("http", fields);
    else if (res.statusCode >= 400) logger.warn("http", fields);
    else logger.info("http", fields);
  });

  next();
};

export default httpLogger;
