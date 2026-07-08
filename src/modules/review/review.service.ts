import { BookingStatus, UserRole } from "@prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import type {
  CreateReviewInput,
  ReviewListQueryInput,
} from "./review.validation";

const reviewSelect = {
  id: true,
  bookingId: true,
  customerId: true,
  technicianId: true,
  serviceId: true,
  rating: true,
  comment: true,
  createdAt: true,
  updatedAt: true,
  booking: {
    select: {
      id: true,
      bookingNumber: true,
      status: true,
      scheduledAt: true,
    },
  },
  customer: {
    select: {
      id: true,
      name: true,
      avatarUrl: true,
    },
  },
  technician: {
    select: {
      id: true,
      name: true,
      avatarUrl: true,
    },
  },
  service: {
    select: {
      id: true,
      title: true,
      slug: true,
      averageRating: true,
      reviewCount: true,
    },
  },
} as const;

const getBookingOrFail = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customerId: true,
      technicianId: true,
      serviceId: true,
      status: true,
      review: {
        select: {
          id: true,
        },
      },
      service: {
        select: {
          id: true,
          averageRating: true,
          reviewCount: true,
        },
      },
    },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  return booking;
};

const assertCustomerAccess = (
  bookingCustomerId: string,
  actor: { userId: string; role: UserRole },
) => {
  if (actor.role !== UserRole.CUSTOMER || bookingCustomerId !== actor.userId) {
    throw new AppError(403, "You do not have permission to create this review");
  }
};

export const reviewService = {
  async createReview(
    payload: CreateReviewInput,
    actor: { userId: string; role: UserRole },
  ) {
    const booking = await getBookingOrFail(payload.bookingId);
    assertCustomerAccess(booking.customerId, actor);

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new AppError(
        400,
        "Reviews can only be created after a booking is completed",
      );
    }

    if (booking.review) {
      throw new AppError(409, "This booking already has a review");
    }

    const [review] = await prisma.$transaction([
      prisma.review.create({
        data: {
          bookingId: booking.id,
          customerId: booking.customerId,
          technicianId: booking.technicianId ?? "",
          serviceId: booking.serviceId,
          rating: payload.rating,
          comment: payload.comment,
        },
        select: reviewSelect,
      }),
      prisma.service.update({
        where: { id: booking.serviceId },
        data: {
          reviewCount: booking.service.reviewCount + 1,
          averageRating:
            (booking.service.averageRating * booking.service.reviewCount +
              payload.rating) /
            (booking.service.reviewCount + 1),
        },
      }),
    ]);

    return review;
  },

  async listReviewsByService(serviceId: string, query: ReviewListQueryInput) {
    const skip = (query.page - 1) * query.limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { serviceId },
        select: reviewSelect,
        skip,
        take: query.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where: { serviceId } }),
    ]);

    return {
      reviews,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async listReviewsByTechnician(
    technicianId: string,
    query: ReviewListQueryInput,
  ) {
    const skip = (query.page - 1) * query.limit;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { technicianId },
        select: reviewSelect,
        skip,
        take: query.limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.review.count({ where: { technicianId } }),
    ]);

    return {
      reviews,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },
};
