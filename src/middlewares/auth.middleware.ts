import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, PermissionDeniedError } from "../utils/errors";
import { jwtPayload } from "../types";

function authorize(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError("No token provided"));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET as string
    ) as jwtPayload;

    req.user = decoded;

    next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError("Invalid token"));
    } else if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError("Token expired"));
    } else {
      return next(error);
    }
  }
}

const allowedRoles = ["user", "admin"];

export function isAllowed(allowedRoles: ("user" | "admin")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const isAllowed =
      (allowedRoles.includes("user") && req.user?.role === "user") ||
      (allowedRoles.includes("admin") && req.user?.role === "admin");

    if (!isAllowed) {
      return next(
        new PermissionDeniedError(
          "You don't have permission to access this resource"
        )
      );
    }

    next();
  };
}

export default authorize;
