import { NextFunction, Request, Response } from "express";
import prisma from "../db";
import { NotFoundError } from "../utils/errors";
import sendResponse from "../utils/sendResponse";
import { users } from "@prisma/client";
import paginate from "../utils/paginate";

export async function editUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    let { email, username } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    const user = await prisma.users.update({
      where: { id: existingUser.id },
      data: { email: String(email).toLowerCase(), username },
    });

    return sendResponse(res, {
      status: 200,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const existingUser = await prisma.users.findUnique({
      where: { id: Number(id) },
    });

    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    const user = await prisma.users.delete({
      where: { id: existingUser.id },
    });

    return sendResponse(res, {
      status: 200,
      message: "User updated successfully",
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;

    const user = await prisma.$queryRaw<users[]>`
                            SELECT id, username, email, user_role, created_at, updated_at FROM users
                            WHERE id = ${Number(id)}`;

    return sendResponse(res, {
      status: 200,
      message: "User fetched successfully",
      data: user[0],
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { page, limit } = req.query;

    const { skip, take } = paginate(Number(page), Number(limit) || 10);

    const totalItems = await prisma.users.count({
      where: { user_role: "user" },
    });

    const users = await prisma.$queryRaw<users[]>`
                            SELECT id, username, email, user_role, created_at, updated_at FROM users
                            WHERE user_role = 'user'
                            LIMIT ${take} OFFSET ${skip}`;

    const totalPages = Math.ceil(totalItems / Number(limit));

    return sendResponse(res, {
      status: 200,
      message: "User fetched successfully",
      data: { users, totalPages },
    });
  } catch (error) {
    next(error);
  }
}
