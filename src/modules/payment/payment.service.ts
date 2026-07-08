import { BookingStatus, PaymentStatus, UserRole } from "@prisma/client";

import { prisma } from "../../config/prisma";
import { getStripeClient } from "../../config/stripe";
import { AppError } from "../../errors/AppError";
import type {
  ConfirmPaymentInput,
  CreatePaymentIntentInput,
} from "./payment.validation";

const paymentSelect = {
  id: true,
  bookingId: true,
  customerId: true,
  transactionId: true,
  stripePaymentIntentId: true,
  amount: true,
  currency: true,
  provider: true,
  status: true,
  paidAt: true,
  metadata: true,
  createdAt: true,
  updatedAt: true,
  booking: {
    select: {
      id: true,
      bookingNumber: true,
      status: true,
      scheduledAt: true,
      service: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  },
} as const;

const assertCustomerAccess = (
  booking: { customerId: string },
  actor: { userId: string; role: UserRole },
) => {
  if (actor.role === UserRole.ADMIN) {
    return;
  }

  if (actor.role !== UserRole.CUSTOMER || booking.customerId !== actor.userId) {
    throw new AppError(
      403,
      "You do not have permission to access this payment",
    );
  }
};

const getBookingOrFail = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      bookingNumber: true,
      customerId: true,
      technicianId: true,
      serviceId: true,
      categoryId: true,
      price: true,
      status: true,
      payment: {
        select: {
          id: true,
          status: true,
          stripePaymentIntentId: true,
          transactionId: true,
        },
      },
    },
  });

  if (!booking) {
    throw new AppError(404, "Booking not found");
  }

  return booking;
};

export const paymentService = {
  async createPaymentIntent(
    payload: CreatePaymentIntentInput,
    actor: { userId: string; role: UserRole },
  ) {
    const booking = await getBookingOrFail(payload.bookingId);
    assertCustomerAccess(booking, actor);

    if (booking.status !== BookingStatus.ACCEPTED) {
      throw new AppError(
        400,
        "Payment can only be initiated for accepted bookings",
      );
    }

    if (booking.payment?.status === PaymentStatus.COMPLETED) {
      throw new AppError(400, "This booking has already been paid");
    }

    const stripe = getStripeClient();
    const amount = Math.round(Number(booking.price) * 100);

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: booking.id,
        customerId: booking.customerId,
      },
    });

    const payment = await prisma.payment.upsert({
      where: {
        bookingId: booking.id,
      },
      create: {
        bookingId: booking.id,
        customerId: booking.customerId,
        transactionId: null,
        stripePaymentIntentId: intent.id,
        amount: booking.price,
        currency: "usd",
        provider: "stripe",
        status: PaymentStatus.PENDING,
        metadata: {
          bookingNumber: booking.bookingNumber,
        },
      },
      update: {
        customerId: booking.customerId,
        transactionId: null,
        stripePaymentIntentId: intent.id,
        amount: booking.price,
        currency: "usd",
        provider: "stripe",
        status: PaymentStatus.PENDING,
        metadata: {
          bookingNumber: booking.bookingNumber,
        },
      },
      select: paymentSelect,
    });

    return {
      payment,
      clientSecret: intent.client_secret,
    };
  },

  async confirmPayment(
    payload: ConfirmPaymentInput,
    actor: { userId: string; role: UserRole },
  ) {
    const stripe = getStripeClient();
    const intent = await stripe.paymentIntents.retrieve(
      payload.paymentIntentId,
    );

    if (intent.status !== "succeeded") {
      throw new AppError(400, "Payment has not been completed successfully");
    }

    const payment = await prisma.payment.findUnique({
      where: {
        stripePaymentIntentId: payload.paymentIntentId,
      },
      select: {
        id: true,
        bookingId: true,
        customerId: true,
      },
    });

    if (!payment) {
      throw new AppError(404, "Payment record not found");
    }

    assertCustomerAccess({ customerId: payment.customerId }, actor);

    const updatedPayment = await prisma.$transaction(async (transaction) => {
      await transaction.booking.update({
        where: { id: payment.bookingId },
        data: {
          status: BookingStatus.PAID,
        },
      });

      return transaction.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          transactionId:
            (intent.latest_charge as string | null | undefined) ?? intent.id,
          paidAt: new Date(),
        },
        select: paymentSelect,
      });
    });

    return updatedPayment;
  },

  async getPaymentHistory(customerId: string) {
    return prisma.payment.findMany({
      where: {
        customerId,
      },
      select: paymentSelect,
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getPaymentDetails(
    paymentId: string,
    actor: { userId: string; role: UserRole },
  ) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      select: paymentSelect,
    });

    if (!payment) {
      throw new AppError(404, "Payment not found");
    }

    assertCustomerAccess({ customerId: payment.customerId }, actor);

    return payment;
  },
};
