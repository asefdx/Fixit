import bcrypt from "bcrypt";

import { prisma } from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import type {
  ChangePasswordInput,
  UpdateProfileInput,
} from "./users.validation";

const userSelect = {
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
} as const;

export const usersService = {
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  },

  async updateProfile(userId: string, payload: UpdateProfileInput) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: payload.name,
        phone: payload.phone,
        avatarUrl: payload.avatarUrl,
      },
      select: userSelect,
    });

    return updatedUser;
  },

  async changePassword(userId: string, payload: ChangePasswordInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const matches = await bcrypt.compare(
      payload.currentPassword,
      user.password,
    );

    if (!matches) {
      throw new AppError(401, "Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: "Password updated successfully",
    };
  },
};
