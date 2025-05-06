import { Response } from "express";
import { type response } from "../types";

function sendResponse(
  res: Response,
  { status, message = "Success", success = true, data }: response
) {
  res.status(status).json({
    message,
    data,
    success,
  });
  return;
}

export default sendResponse;
