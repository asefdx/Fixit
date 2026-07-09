import { DayOfWeek } from "@prisma/client";
import { z } from "zod";

const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export const technicianListQuerySchema = z.object({
  search: z.string().trim().optional(),
  location: z.string().trim().optional(),
  skill: z.string().trim().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z
    .enum(["createdAt", "experienceYears", "averageRating", "reviewCount"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const technicianProfileSchema = z.object({
  bio: z.string().trim().optional(),
  experienceYears: z
    .number()
    .int()
    .min(0, "Experience years must be positive")
    .optional(),
  location: z.string().trim().min(2, "Location is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  hourlyRate: z.number().positive("Hourly rate must be positive").optional(),
  serviceRadius: z
    .number()
    .int()
    .positive("Service radius must be positive")
    .optional(),
  portfolioUrl: z.string().url("Portfolio must be a valid URL").optional(),
  skills: z
    .array(z.string().trim().min(1))
    .min(1, "At least one skill is required"),
});

const availabilityBaseSchema = z.object({
  dayOfWeek: z.nativeEnum(DayOfWeek),
  startTime: z.string().regex(timePattern, "Start time must use HH:MM format"),
  endTime: z.string().regex(timePattern, "End time must use HH:MM format"),
  isAvailable: z.boolean().optional(),
  notes: z.string().trim().optional(),
});

export const availabilitySchema = availabilityBaseSchema.refine(
  (data) => data.startTime !== data.endTime,
  {
    message: "Start time and end time must be different",
    path: ["endTime"],
  },
);

export const updateAvailabilitySchema = availabilityBaseSchema.partial().refine(
  (data) => {
    if (data.startTime && data.endTime) {
      return data.startTime !== data.endTime;
    }

    return true;
  },
  {
    message: "Start time and end time must be different",
    path: ["endTime"],
  },
);

export type TechnicianProfileInput = z.infer<typeof technicianProfileSchema>;
export type AvailabilityInput = z.infer<typeof availabilitySchema>;
export type UpdateAvailabilityInput = z.infer<typeof updateAvailabilitySchema>;
export type TechnicianListQueryInput = z.infer<
  typeof technicianListQuerySchema
>;
