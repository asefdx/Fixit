import { BookingStatus, UserRole } from "@prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import type {
  BookingActionInput,
  CreateBookingInput,
} from "./booking.validation";

const bookingSelect = {
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
  service: {
    select: {
      id: true,
      title: true,
      slug: true,
      serviceLocation: true,
      price: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  },
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
      technicianProfile: {
        select: {
          id: true,
          location: true,
          skills: true,
          isVerified: true,
        },
      },
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
      createdAt: true,
      updatedAt: true,
    },
  },
  review: {
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const;

const createBookingNumber = () => {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BK-${Date.now()}-${suffix}`;
};

const getBookingOrFail = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: bookingSelect,
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  return booking;
};

const assertBookingOwnerOrStaff = (
  booking: { customerId: string; technicianId: string | null },
  actor: { userId: string; role: UserRole },
) => {
  if (actor.role === UserRole.ADMIN) {
    return;
  }

  if (actor.role === UserRole.CUSTOMER && booking.customerId !== actor.userId) {
    throw new AppError(
      403,
      "You do not have permission to access this booking",
    );
  }

  if (
    actor.role === UserRole.TECHNICIAN &&
    booking.technicianId !== actor.userId
  ) {
    throw new AppError(
      403,
      "You do not have permission to access this booking",
    );
  }
};

const assertTechnicianOwnBooking = (
  booking: { technicianId: string | null },
  actor: { userId: string; role: UserRole },
) => {
  if (actor.role === UserRole.ADMIN) {
    return;
  }

  if (
    actor.role !== UserRole.TECHNICIAN ||
    booking.technicianId !== actor.userId
  ) {
    throw new AppError(
      403,
      "You do not have permission to manage this booking",
    );
  }
};

export const bookingService = {
  async listBookingsByActor(actor: { userId: string; role: UserRole }) {
    if (actor.role === UserRole.CUSTOMER) {
      return this.listCustomerBookings(actor.userId);
    }

    if (actor.role === UserRole.TECHNICIAN) {
      return this.listTechnicianBookings(actor.userId);
    }

    return prisma.booking.findMany({
      select: bookingSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async createBooking(customerId: string, payload: CreateBookingInput) {
    const service = await prisma.service.findUnique({
      where: { id: payload.serviceId },
      select: {
        id: true,
        price: true,
        categoryId: true,
        technicianId: true,
        isActive: true,
      },
    });

    if (!service || !service.isActive) {
      throw new AppError(404, "Service not found");
    }

    if (!service.technicianId) {
      throw new AppError(400, "This service is not assigned to a technician");
    }

    const booking = await prisma.booking.create({
      data: {
        bookingNumber: createBookingNumber(),
        customerId,
        technicianId: service.technicianId,
        serviceId: service.id,
        categoryId: service.categoryId,
        scheduledAt: payload.scheduledAt,
        address: payload.address,
        location: payload.location,
        notes: payload.notes,
        price: service.price,
        status: BookingStatus.REQUESTED,
      },
      select: bookingSelect,
    });

    return booking;
  },

  async listCustomerBookings(customerId: string) {
    return prisma.booking.findMany({
      where: {
        customerId,
      },
      select: bookingSelect,
      orderBy: {
        scheduledAt: "desc",
      },
    });
  },

  async listTechnicianBookings(technicianId: string) {
    return prisma.booking.findMany({
      where: {
        technicianId,
      },
      select: bookingSelect,
      orderBy: {
        scheduledAt: "desc",
      },
    });
  },

  async getBookingDetails(
    bookingId: string,
    actor: { userId: string; role: UserRole },
  ) {
    const booking = await getBookingOrFail(bookingId);
    assertBookingOwnerOrStaff(booking, actor);
    return booking;
  },

  async acceptBooking(
    bookingId: string,
    actor: { userId: string; role: UserRole },
  ) {
    const booking = await getBookingOrFail(bookingId);
    assertTechnicianOwnBooking(booking, actor);

    if (booking.status !== BookingStatus.REQUESTED) {
      throw new AppError(400, "Only requested bookings can be accepted");
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.ACCEPTED,
        acceptedAt: new Date(),
      },
      select: bookingSelect,
    });
  },

  async declineBooking(
    bookingId: string,
    actor: { userId: string; role: UserRole },
    payload: BookingActionInput,
  ) {
    const booking = await getBookingOrFail(bookingId);
    assertTechnicianOwnBooking(booking, actor);

    if (booking.status !== BookingStatus.REQUESTED) {
      throw new AppError(400, "Only requested bookings can be declined");
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.DECLINED,
        declinedAt: new Date(),
        cancelReason: payload.reason,
      },
      select: bookingSelect,
    });
  },

  async startWork(
    bookingId: string,
    actor: { userId: string; role: UserRole },
  ) {
    const booking = await getBookingOrFail(bookingId);
    assertTechnicianOwnBooking(booking, actor);

    if (booking.status !== BookingStatus.PAID) {
      throw new AppError(400, "Only paid bookings can be started");
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      select: bookingSelect,
    });
  },

  async completeWork(
    bookingId: string,
    actor: { userId: string; role: UserRole },
  ) {
    const booking = await getBookingOrFail(bookingId);
    assertTechnicianOwnBooking(booking, actor);

    if (booking.status !== BookingStatus.IN_PROGRESS) {
      throw new AppError(400, "Only in-progress bookings can be completed");
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.COMPLETED,
        completedAt: new Date(),
      },
      select: bookingSelect,
    });
  },

  async cancelBooking(
    bookingId: string,
    actor: { userId: string; role: UserRole },
    payload: BookingActionInput,
  ) {
    const booking = await getBookingOrFail(bookingId);
    assertBookingOwnerOrStaff(booking, actor);

    if (
      booking.status === BookingStatus.IN_PROGRESS ||
      booking.status === BookingStatus.COMPLETED ||
      booking.status === BookingStatus.CANCELLED
    ) {
      throw new AppError(400, "This booking can no longer be cancelled");
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelReason: payload.reason,
      },
      select: bookingSelect,
    });
  },
};
