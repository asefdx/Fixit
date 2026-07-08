import { UserRole, UserStatus } from "@prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import type {
  AvailabilityInput,
  TechnicianListQueryInput,
  TechnicianProfileInput,
  UpdateAvailabilityInput,
} from "./technician.validation";

const technicianSelect = {
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
      bio: true,
      experienceYears: true,
      location: true,
      latitude: true,
      longitude: true,
      hourlyRate: true,
      serviceRadius: true,
      portfolioUrl: true,
      skills: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  _count: {
    select: {
      services: true,
      technicianReviews: true,
    },
  },
} as const;

const availabilitySelect = {
  id: true,
  technicianProfileId: true,
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  isAvailable: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
} as const;

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
  customer: {
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
    },
  },
} as const;

const getTechnicianProfileOrFail = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
      technicianProfile: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  if (user.role !== UserRole.TECHNICIAN) {
    throw new AppError(403, "Technician access required");
  }

  if (user.status === UserStatus.BANNED) {
    throw new AppError(403, "User is banned");
  }

  return user;
};

export const technicianService = {
  async listTechnicians(query: TechnicianListQueryInput) {
    const skip = (query.page - 1) * query.limit;

    const where: Record<string, unknown> = {
      role: UserRole.TECHNICIAN,
      status: UserStatus.ACTIVE,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        {
          technicianProfile: {
            location: { contains: query.search, mode: "insensitive" },
          },
        },
      ];
    }

    if (query.location) {
      where.technicianProfile = {
        ...(where.technicianProfile as Record<string, unknown> | undefined),
        location: { contains: query.location, mode: "insensitive" },
      };
    }

    if (query.skill) {
      where.technicianProfile = {
        ...(where.technicianProfile as Record<string, unknown> | undefined),
        skills: {
          has: query.skill,
        },
      };
    }

    const [technicians, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: technicianSelect,
        skip,
        take: query.limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({ where }),
    ]);

    const items = await Promise.all(
      technicians.map(async (technician) => {
        const reviewStats = await prisma.review.aggregate({
          where: { technicianId: technician.id },
          _avg: { rating: true },
          _count: { rating: true },
        });

        return {
          ...technician,
          averageRating: reviewStats._avg.rating ?? 0,
          reviewCount: reviewStats._count.rating,
        };
      }),
    );

    const filtered = items.filter((technician) => {
      if (query.minRating === undefined) {
        return true;
      }

      return technician.averageRating >= query.minRating;
    });

    const sorted = [...filtered].sort((left, right) => {
      const leftValue = left[query.sortBy as keyof typeof left] as
        | number
        | Date
        | undefined;
      const rightValue = right[query.sortBy as keyof typeof right] as
        | number
        | Date
        | undefined;

      const leftComparable =
        leftValue instanceof Date
          ? leftValue.getTime()
          : Number(leftValue ?? 0);
      const rightComparable =
        rightValue instanceof Date
          ? rightValue.getTime()
          : Number(rightValue ?? 0);

      return query.sortOrder === "asc"
        ? leftComparable - rightComparable
        : rightComparable - leftComparable;
    });

    return {
      technicians: sorted,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async getTechnicianProfile(userId: string) {
    const technician = await prisma.user.findUnique({
      where: { id: userId },
      select: technicianSelect,
    });

    if (!technician || technician.role !== UserRole.TECHNICIAN) {
      throw new AppError(404, "Technician not found");
    }

    const [reviewStats, reviews] = await Promise.all([
      prisma.review.aggregate({
        where: { technicianId: technician.id },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      prisma.review.findMany({
        where: { technicianId: technician.id },
        select: reviewSelect,
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    return {
      ...technician,
      averageRating: reviewStats._avg.rating ?? 0,
      reviewCount: reviewStats._count.rating,
      reviews,
    };
  },

  async upsertProfile(userId: string, payload: TechnicianProfileInput) {
    const technician = await getTechnicianProfileOrFail(userId);

    const updatedProfile = await prisma.technicianProfile.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        bio: payload.bio,
        experienceYears: payload.experienceYears,
        location: payload.location,
        latitude: payload.latitude,
        longitude: payload.longitude,
        hourlyRate: payload.hourlyRate,
        serviceRadius: payload.serviceRadius,
        portfolioUrl: payload.portfolioUrl,
        skills: payload.skills,
      },
      update: {
        bio: payload.bio,
        experienceYears: payload.experienceYears,
        location: payload.location,
        latitude: payload.latitude,
        longitude: payload.longitude,
        hourlyRate: payload.hourlyRate,
        serviceRadius: payload.serviceRadius,
        portfolioUrl: payload.portfolioUrl,
        skills: payload.skills,
      },
      select: {
        id: true,
        bio: true,
        experienceYears: true,
        location: true,
        latitude: true,
        longitude: true,
        hourlyRate: true,
        serviceRadius: true,
        portfolioUrl: true,
        skills: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      technicianId: technician.id,
      profile: updatedProfile,
    };
  },

  async listAvailability(userId: string) {
    const technician = await getTechnicianProfileOrFail(userId);

    const profile = await prisma.technicianProfile.findUnique({
      where: { userId: technician.id },
      select: {
        id: true,
      },
    });

    if (!profile) {
      throw new AppError(404, "Technician profile not found");
    }

    return prisma.technicianAvailability.findMany({
      where: {
        technicianProfileId: profile.id,
      },
      select: availabilitySelect,
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
  },

  async createAvailability(userId: string, payload: AvailabilityInput) {
    const technician = await getTechnicianProfileOrFail(userId);
    const profile = await prisma.technicianProfile.findUnique({
      where: { userId: technician.id },
      select: {
        id: true,
      },
    });

    if (!profile) {
      throw new AppError(404, "Technician profile not found");
    }

    return prisma.technicianAvailability.create({
      data: {
        technicianProfileId: profile.id,
        dayOfWeek: payload.dayOfWeek,
        startTime: payload.startTime,
        endTime: payload.endTime,
        isAvailable: payload.isAvailable ?? true,
        notes: payload.notes,
      },
      select: availabilitySelect,
    });
  },

  async updateAvailability(
    userId: string,
    availabilityId: string,
    payload: UpdateAvailabilityInput,
  ) {
    const technician = await getTechnicianProfileOrFail(userId);
    const profile = await prisma.technicianProfile.findUnique({
      where: { userId: technician.id },
      select: {
        id: true,
      },
    });

    if (!profile) {
      throw new AppError(404, "Technician profile not found");
    }

    const availability = await prisma.technicianAvailability.findFirst({
      where: {
        id: availabilityId,
        technicianProfileId: profile.id,
      },
    });

    if (!availability) {
      throw new AppError(404, "Availability slot not found");
    }

    return prisma.technicianAvailability.update({
      where: {
        id: availabilityId,
      },
      data: {
        dayOfWeek: payload.dayOfWeek,
        startTime: payload.startTime,
        endTime: payload.endTime,
        isAvailable: payload.isAvailable,
        notes: payload.notes,
      },
      select: availabilitySelect,
    });
  },

  async deleteAvailability(userId: string, availabilityId: string) {
    const technician = await getTechnicianProfileOrFail(userId);
    const profile = await prisma.technicianProfile.findUnique({
      where: { userId: technician.id },
      select: {
        id: true,
      },
    });

    if (!profile) {
      throw new AppError(404, "Technician profile not found");
    }

    const availability = await prisma.technicianAvailability.findFirst({
      where: {
        id: availabilityId,
        technicianProfileId: profile.id,
      },
    });

    if (!availability) {
      throw new AppError(404, "Availability slot not found");
    }

    await prisma.technicianAvailability.delete({
      where: { id: availabilityId },
    });

    return {
      message: "Availability slot deleted successfully",
    };
  },
};
