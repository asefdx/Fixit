import type { PaginationMeta } from "@/types/api";
import type { UserRole, UserStatus } from "@/types/auth";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TechnicianProfileSummary = {
  id: string;
  bio?: string | null;
  experienceYears?: number | null;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  hourlyRate?: number | null;
  serviceRadius?: number | null;
  portfolioUrl?: string | null;
  skills: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TechnicianReview = {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  service: {
    id: string;
    title: string;
    slug: string;
    averageRating: number;
    reviewCount: number;
  };
};

export type Technician = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  technicianProfile: TechnicianProfileSummary | null;
  _count?: {
    services: number;
    technicianReviews: number;
  };
  averageRating?: number;
  reviewCount?: number;
  reviews?: TechnicianReview[];
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  serviceLocation: string;
  durationMinutes?: number | null;
  imageUrl?: string | null;
  averageRating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  technician?: Pick<
    Technician,
    | "id"
    | "name"
    | "email"
    | "avatarUrl"
    | "role"
    | "status"
    | "technicianProfile"
  > | null;
};

export type Review = {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: {
    id: string;
    bookingNumber: string;
    status: string;
    scheduledAt: string;
  };
  customer: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  technician?: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  service: {
    id: string;
    title: string;
    slug: string;
    averageRating: number;
    reviewCount: number;
  };
};

export type CatalogListResponse<T> = {
  items: T[];
  meta?: PaginationMeta;
};

export type ServiceListResponse = {
  services: Service[];
  meta: PaginationMeta;
};

export type TechnicianListResponse = {
  technicians: Technician[];
  meta: PaginationMeta;
};

export type ReviewListResponse = {
  reviews: Review[];
  meta: PaginationMeta;
};
