import { BookingStatus } from "@prisma/client";
import { z } from "zod";

export const createBookingSchema = z
  .object({
    serviceId: z.string().trim().min(1, "Service is required"),
    scheduledAt: z.coerce.date(),
    address: z.string().trim().min(5, "Address is required"),
    location: z.string().trim().min(2, "Location is required"),
    notes: z.string().trim().optional(),
  })
  .refine((data) => data.scheduledAt.getTime() > Date.now(), {
    message: "Scheduled date must be in the future",
    path: ["scheduledAt"],
  });

export const bookingActionSchema = z.object({
  reason: z.string().trim().optional(),
});

export const bookingStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingActionInput = z.infer<typeof bookingActionSchema>;
