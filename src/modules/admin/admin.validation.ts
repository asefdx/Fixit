import { BookingStatus, UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

export const adminUserQuerySchema = z.object({
  search: z.string().trim().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const adminBookingQuerySchema = z.object({
  status: z.nativeEnum(BookingStatus).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type AdminUserQueryInput = z.infer<typeof adminUserQuerySchema>;
export type AdminBookingQueryInput = z.infer<typeof adminBookingQuerySchema>;
