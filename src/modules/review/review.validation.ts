import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.string().trim().min(1, "Booking is required"),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().optional(),
});

export const reviewListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ReviewListQueryInput = z.infer<typeof reviewListQuerySchema>;
