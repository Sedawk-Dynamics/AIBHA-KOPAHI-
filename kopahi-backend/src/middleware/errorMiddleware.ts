import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = "Server error";

  if (err instanceof HttpError) {
    statusCode = err.status;
    message = err.message;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      // Unique constraint violation
      const fields = (err.meta?.target as string[] | undefined) ?? [];
      const field = fields[0] ?? "field";
      statusCode = 409;
      message = `Duplicate ${field}: a record with this ${field} already exists`;
    } else if (err.code === "P2025") {
      // Record not found
      statusCode = 404;
      message = "Resource not found";
    } else if (err.code === "P2003") {
      // Foreign-key constraint
      statusCode = 400;
      message = "Invalid reference";
    } else {
      statusCode = 400;
      message = err.message;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data shape";
  } else if (err instanceof Error) {
    // CORS rejects throw `new Error("CORS: origin ... not allowed")` from
    // server.ts. Map to 403 (forbidden) instead of the default 500.
    if (err.message.startsWith("CORS:")) {
      statusCode = 403;
    }
    message = err.message || message;
  }

  // eslint-disable-next-line no-console
  console.error(`[error] ${req.method} ${req.originalUrl} → ${statusCode}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : (err as Error)?.stack,
  });
};

export default { notFound, errorHandler, HttpError };
