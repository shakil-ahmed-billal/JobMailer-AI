import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { auth } from "../lib/auth";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      throw new AppError(401, "Unauthorized. Please login to continue.");
    }

    // Attach user to request
    (req as any).user = session.user;
    (req as any).session = session.session;

    next();
  } catch (error) {
    next(error);
  }
};
