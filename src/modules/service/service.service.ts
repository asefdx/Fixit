import { UserRole, UserStatus } from "@prisma/client";

import { prisma } from "../../config/prisma";
import { AppError } from "../../errors/AppError";
import { slugify } from "../../utils/slugify";
import type {
  ServiceInput,
  ServiceQueryInput,
  UpdateServiceInput,
} from "./service.validation";

const serviceSelect = {
  id: true,
  title: true,
  slug: true,
  description: true,
  price: true,
  serviceLocation: true,
  durationMinutes: true,
  imageUrl: true,
  averageRating: true,
  reviewCount: true,
  isFeatured: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      iconUrl: true,
      isActive: true,
    },
  },
  technician: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      status: true,
      technicianProfile: {
        select: {
          id: true,
          location: true,
          skills: true,
          isVerified: true,
          experienceYears: true,
          portfolioUrl: true,
        },
      },
    },
  },
} as const;

const buildServiceWhere = (query: ServiceQueryInput) => {
  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
      { serviceLocation: { contains: query.search, mode: "insensitive" } },
    ];
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.category) {
    where.category = {
      slug: query.category,
    };
  }

  if (query.location) {
    where.serviceLocation = {
      contains: query.location,
      mode: "insensitive",
    };
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {} as Record<string, number>;

    if (query.minPrice !== undefined) {
      (where.price as Record<string, number>).gte = query.minPrice;
    }

    if (query.maxPrice !== undefined) {
      (where.price as Record<string, number>).lte = query.maxPrice;
    }
  }

  if (query.rating !== undefined) {
    where.averageRating = {
      gte: query.rating,
    };
  }

  return where;
};

const assertTechnicianOwnership = async (
  serviceId: string,
  userId: string,
  role: UserRole,
) => {
  if (role === UserRole.ADMIN) {
    return;
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      technicianId: true,
    },
  });

  if (!service) {
    throw new AppError(404, "Service not found");
  }

  if (service.technicianId !== userId) {
    throw new AppError(
      403,
      "You do not have permission to manage this service",
    );
  }
};

export const serviceService = {
  async listServices(query: ServiceQueryInput) {
    const where = buildServiceWhere(query);
    const skip = (query.page - 1) * query.limit;

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        select: serviceSelect,
        skip,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
      }),
      prisma.service.count({ where }),
    ]);

    return {
      services,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async getServiceById(serviceId: string) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: serviceSelect,
    });

    if (!service || !service.isActive) {
      throw new AppError(404, "Service not found");
    }

    return service;
  },

  async createService(
    payload: ServiceInput,
    actor: { userId: string; role: UserRole },
  ) {
    if (actor.role !== UserRole.ADMIN && actor.role !== UserRole.TECHNICIAN) {
      throw new AppError(403, "Only technicians or admins can create services");
    }

    const technician =
      actor.role === UserRole.ADMIN && payload.technicianId
        ? await prisma.user.findUnique({ where: { id: payload.technicianId } })
        : await prisma.user.findUnique({ where: { id: actor.userId } });

    if (!technician) {
      throw new AppError(404, "Technician not found");
    }

    if (technician.role !== UserRole.TECHNICIAN) {
      throw new AppError(400, "Assigned user must be a technician");
    }

    const service = await prisma.service.create({
      data: {
        title: payload.title,
        slug: slugify(payload.title),
        description: payload.description,
        price: payload.price,
        serviceLocation: payload.serviceLocation,
        durationMinutes: payload.durationMinutes,
        imageUrl: payload.imageUrl,
        categoryId: payload.categoryId,
        technicianId: technician.id,
        isFeatured: payload.isFeatured ?? false,
        isActive: payload.isActive ?? true,
      },
      select: serviceSelect,
    });

    return service;
  },

  async updateService(
    serviceId: string,
    payload: UpdateServiceInput,
    actor: { userId: string; role: UserRole },
  ) {
    await assertTechnicianOwnership(serviceId, actor.userId, actor.role);

    const service = await prisma.service.update({
      where: { id: serviceId },
      data: {
        title: payload.title,
        slug: payload.title ? slugify(payload.title) : undefined,
        description: payload.description,
        price: payload.price,
        serviceLocation: payload.serviceLocation,
        durationMinutes: payload.durationMinutes,
        imageUrl: payload.imageUrl,
        categoryId: payload.categoryId,
        isFeatured: payload.isFeatured,
        isActive: payload.isActive,
      },
      select: serviceSelect,
    });

    return service;
  },

  async deleteService(
    serviceId: string,
    actor: { userId: string; role: UserRole },
  ) {
    await assertTechnicianOwnership(serviceId, actor.userId, actor.role);

    await prisma.service.update({
      where: { id: serviceId },
      data: {
        isActive: false,
      },
    });

    return {
      message: "Service deleted successfully",
    };
  },
};
