import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import prisma from './db';

@Injectable()
export class UserService {
  async create(body: Partial<users>) {
    const { username, email, password, user_role } = body;

    if (!username || !email || !password || !user_role) {
      throw new BadRequestException('Please fill in all fields');
    }

    const normalizedEmail = String(email).toLowerCase();

    const existingUser = await prisma.users.findFirst({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        username,
        email: normalizedEmail,
        password: hashedPassword,
        user_role,
      },
    });

    const { password: userPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(body: Partial<users>) {
    let { email, password } = body;

    if (!email || !password) {
      throw new BadRequestException('Please fill all details');
    }

    email = String(email).toLowerCase();

    const user = await prisma.users.findFirst({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Incorrect credentials');
    }

    const token = jwt.sign(
      { id: user.id, user_role: user.user_role },
      process.env.SECRET!,
    );
    const { password: userPassword, ...userWithoutPassword } = user;

    return { token, userWithoutPassword };
  }

  async profile(id: number) {
    const user = await prisma.users.findFirst({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: userPassword, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async updateProfile(id: number, body: Partial<users>) {
    let { username, email } = body;
    if (!username || !email) {
      throw new BadRequestException('Please fill all details');
    }
    email = String(email).toLowerCase();
    const existingUser = await prisma.users.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const user = await prisma.users.update({
      where: { id },
      data: { username, email },
    });
    const { password: userPassword, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async getAllUsers() {
    const users = await prisma.users.findMany({ where: { user_role: 'user' } });
    return users;
  }

  async deleteUser(id: number) {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await prisma.users.delete({ where: { id } });
  }

  async getUserById(id: number) {
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: userPassword, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
