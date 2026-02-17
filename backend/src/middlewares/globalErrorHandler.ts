import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Prisma errors
  if (err.code === "P2002") {
    statusCode = 400;
    message = "Duplicate entry. This record already exists.";
  }

  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found.";
  }

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation error";
    return res.status(statusCode).json({
      success: false,
      message,
      errors: err.errors,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
