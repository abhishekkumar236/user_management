import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import bcrypt from "bcrypt";
import {
  InternalServerError,
  NotFoundError,
  PermissionDeniedError,
  ValidationError,
} from "../utils/errors";
import sendResponse from "../utils/sendResponse";
import genToken from "../utils/genToken";
import { users } from "@prisma/client";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    let { username, email, user_password, user_role } = req.body;
    email = String(email).toLowerCase();

    const existingUser = await prisma.users.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new ValidationError("User already exist");
    }

    let hashedPassword = await bcrypt.hash(user_password, 10);

    let newUser = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        username,
        user_role,
      },
    });

    if (!newUser) {
      throw new InternalServerError();
    }

    const { password, ...result } = newUser;

    return sendResponse(res, {
      status: 201,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    let { email, user_password } = req.body;

    const existingUser = await prisma.users.findFirst({
      where: { email: String(email).toLowerCase() },
    });

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    const isValidPassword = await bcrypt.compare(
      user_password,
      existingUser.password
    );

    if (!isValidPassword) {
      throw new ValidationError("Incorrect credentials");
    }

    const token = await genToken({
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.user_role,
    });

    const { password, ...user } = existingUser;
    return sendResponse(res, {
      status: 200,
      message: "User logged in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function udpateProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    let { email, username } = req.body;
    const existingUser = await prisma.users.findUnique({
      where: { id: req.user?.id },
    });

    if (!existingUser) {
      throw new PermissionDeniedError("Permission denied");
    }

    const user = await prisma.users.update({
      where: { id: existingUser.id },
      data: { email: String(email).toLowerCase(), username },
    });

    return sendResponse(res, {
      status: 200,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await prisma.$queryRaw<users[]>`
                          SELECT username, email, create_at, updated_at FROM users
                          WHER id = ${req.user?.id}`;

    return sendResponse(res, {
      status: 200,
      data: user[0],
      message: "Profile fetched successfully",
    });
  } catch (error) {
    next(error);
  }
}
