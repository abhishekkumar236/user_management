import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodType } from "zod";
import { ValidationError } from "../utils/errors";

const validate =
  (schema: AnyZodObject | ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.safeParse(req.body);
      if (data.success) {
        next();
      } else {
        // @ts-ignore
        throw new ValidationError(data.error);
      }
    } catch (error) {
      next(error);
    }
  };

export default validate;
