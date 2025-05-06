import { NextFunction, Request, Response } from "express";
import sendResponse from "../utils/sendResponse";

function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);
  return sendResponse(res, {
    status: error.status || 500,
    success: false,
    message: error.message || "Internal Server Error",
  });
}

export default errorHandler;
