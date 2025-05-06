import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  user_role: z.enum(["user", "admin"]),
  username: z.string().min(4),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const updateUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4),
});
