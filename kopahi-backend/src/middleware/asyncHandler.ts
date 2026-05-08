import type { Request, Response, NextFunction, RequestHandler } from "express";

/*
 * Express 5 catches async errors natively, but keeping this wrapper minimizes
 * churn for routes that are still being migrated. It's a no-op for sync
 * handlers and forwards rejections to next() for async ones.
 */
type AsyncFn = (req: Request, res: Response, next: NextFunction) => unknown | Promise<unknown>;

const asyncHandler = (fn: AsyncFn): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
