import { UserRole } from "@prisma/client";
import { z } from "zod";

export const serviceSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Service title must be at least 2 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Service description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  serviceLocation: z.string().trim().min(2, "Service location is required"),
  durationMinutes: z
    .number()
    .int()
    .positive("Duration must be positive")
    .optional(),
  imageUrl: z.string().url("Image must be a valid URL").optional(),
  categoryId: z.string().trim().min(1, "Category is required"),
  technicianId: z.string().trim().min(1).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateServiceSchema = serviceSchema.partial();

export const serviceQuerySchema = z.object({
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  location: z.string().trim().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z
    .enum(["createdAt", "price", "averageRating", "title"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type ServiceInput = z.infer<typeof serviceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
export type ServiceQueryInput = z.infer<typeof serviceQuerySchema>;
