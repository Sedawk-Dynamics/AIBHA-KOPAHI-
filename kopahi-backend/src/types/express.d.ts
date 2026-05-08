/*
 * Augment Express's Request type with the fields we attach in middleware:
 *   - req.id     (set by middleware/requestId)
 *   - req.user   (set by middleware/authMiddleware)
 */

import "express";

declare global {
  namespace Express {
    interface Request {
      id?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user?: any;
    }
  }
}

export {};
