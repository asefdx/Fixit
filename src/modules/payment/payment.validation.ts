import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  bookingId: z.string().trim().min(1, "Booking is required"),
  provider: z.enum(["stripe", "sslcommerz"]).optional(),
});

export const confirmPaymentSchema = z.object({
  paymentIntentId: z.string().trim().min(1, "Payment intent id is required"),
});

export type CreatePaymentIntentInput = z.infer<
  typeof createPaymentIntentSchema
>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>;
