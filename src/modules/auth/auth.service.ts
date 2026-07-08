import bcrypt from "bcrypt";
import { UserRole, UserStatus, type User } from "@prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import { generateToken } from "../../utils/jwt";
import type { LoginInput, RegisterInput } from "./auth.validation";

type SafeUser = Omit<User, "password"> & {
  technicianProfile?: unknown;
};

const passwordRounds = 12;

const buildSafeUser = <T extends Record<string, unknown>>(
  user: T,
): Omit<T, "password"> => {
  const { password: _password, ...safeUser } = user as T & {
    password?: string;
  };
  return safeUser;
};

const getUserWithProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatarUrl: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      technicianProfile: {
        select: {
          id: true,
          bio: true,
          experienceYears: true,
          location: true,
          latitude: true,
          longitude: true,
          hourlyRate: true,
          serviceRadius: true,
          portfolioUrl: true,
          skills: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
};

export const authService = {
  async register(payload: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existingUser) {
      throw new AppError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(payload.password, passwordRounds);

    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        phone: payload.phone,
        avatarUrl: payload.avatarUrl,
        role: payload.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const accessToken = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      accessToken,
    };
  },

  async login(payload: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    if (user.status === UserStatus.BANNED) {
      throw new AppError(403, "User is banned");
    }

    const passwordMatches = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!passwordMatches) {
      throw new AppError(401, "Invalid email or password");
    }

    const safeUser = buildSafeUser(user) as SafeUser;

    const accessToken = generateToken({
      userId: safeUser.id,
      email: safeUser.email,
      role: safeUser.role,
    });

    return {
      user: safeUser,
      accessToken,
    };
  },

  async currentUser(userId: string) {
    return getUserWithProfile(userId);
  },
};
