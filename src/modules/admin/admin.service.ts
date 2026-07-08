import { BookingStatus, UserStatus } from "@prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import type {
  AdminBookingQueryInput,
  AdminUserQueryInput,
} from "./admin.validation";

const adminUserSelect = {
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
      location: true,
      skills: true,
      isVerified: true,
    },
  },
  _count: {
    select: {
      customerBookings: true,
      technicianBookings: true,
      customerPayments: true,
      customerReviews: true,
      technicianReviews: true,
    },
  },
} as const;

const adminBookingSelect = {
  id: true,
  bookingNumber: true,
  customerId: true,
  technicianId: true,
  serviceId: true,
  categoryId: true,
  scheduledAt: true,
  address: true,
  location: true,
  notes: true,
  price: true,
  status: true,
  requestedAt: true,
  acceptedAt: true,
  declinedAt: true,
  startedAt: true,
  completedAt: true,
  cancelledAt: true,
  cancelReason: true,
  createdAt: true,
  updatedAt: true,
  customer: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
  technician: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  },
  service: {
    select: {
      id: true,
      title: true,
      slug: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  payment: {
    select: {
      id: true,
      transactionId: true,
      stripePaymentIntentId: true,
      amount: true,
      currency: true,
      provider: true,
      status: true,
      paidAt: true,
    },
  },
} as const;

export const adminService = {
  async listUsers(query: AdminUserQueryInput) {
    const skip = (query.page - 1) * query.limit;

    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
      ];
    }

    if (query.role) {
      where.role = query.role;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: adminUserSelect,
        skip,
        take: query.limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async banUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.BANNED,
      },
      select: adminUserSelect,
    });

    return updatedUser;
  },

  async unbanUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        status: UserStatus.ACTIVE,
      },
      select: adminUserSelect,
    });

    return updatedUser;
  },

  async listBookings(query: AdminBookingQueryInput) {
    const skip = (query.page - 1) * query.limit;

    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        select: adminBookingSelect,
        skip,
        take: query.limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.booking.count({ where }),
    ]);

    return {
      bookings,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async getBookingById(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: adminBookingSelect,
    });

    if (!booking) {
      throw new AppError(404, "Booking not found");
    }

    return booking;
  },
};
