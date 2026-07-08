import type { NextFunction, Request, Response } from "express";
import { UserRole, UserStatus } from "@prisma/client";

import { prisma } from "../config/prisma";
import { AppError } from "../errors/AppError";
import { verifyJwt } from "../utils/jwt";
import type { AuthenticatedRequest } from "../interfaces/request.interface";

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "Unauthorized"));
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyJwt(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
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

    if (!user) {
      return next(new AppError(401, "Unauthorized"));
    }

    if (user.status === UserStatus.BANNED) {
      return next(new AppError(403, "User is banned"));
    }

    (req as AuthenticatedRequest).user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return next();
  } catch {
    return next(new AppError(401, "Invalid or expired token"));
  }
};

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      return next(new AppError(401, "Unauthorized"));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new AppError(403, "Forbidden"));
    }

    return next();
  };
};
