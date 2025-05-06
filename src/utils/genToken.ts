import jwt from "jsonwebtoken";
import { jwtPayload } from "../types";

function genToken(payload: jwtPayload) {
  try {
    return jwt.sign(payload, process.env.SECRET as string, {
      expiresIn: "1d",
    });
  } catch (error) {
    throw error;
  }
}

export default genToken;
