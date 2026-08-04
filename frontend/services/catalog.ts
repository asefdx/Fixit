import { request } from "@/lib/api";
import type {
  Category,
  ReviewListResponse,
  Service,
  ServiceListResponse,
  Technician,
  TechnicianListResponse,
} from "@/types/catalog";

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const catalogService = {
  async getCategories() {
    const response = await request<Category[]>("/categories");
    return response.data;
  },

  async getServices(
    params: {
      search?: string;
      category?: string;
      categoryId?: string;
      location?: string;
      minPrice?: number;
      maxPrice?: number;
      rating?: number;
      page?: number;
      limit?: number;
      sortBy?: "createdAt" | "price" | "averageRating" | "title";
      sortOrder?: "asc" | "desc";
    } = {},
  ) {
    const response = await request<ServiceListResponse>(
      `/services${buildQuery(params)}`,
    );

    return response.data;
  },

  async getServiceById(serviceId: string) {
    const response = await request<Service>(`/services/${serviceId}`);
    return response.data;
  },

  async getTechnicians(
    params: {
      search?: string;
      location?: string;
      skill?: string;
      minRating?: number;
      page?: number;
      limit?: number;
      sortBy?:
        | "createdAt"
        | "experienceYears"
        | "averageRating"
        | "reviewCount";
      sortOrder?: "asc" | "desc";
    } = {},
  ) {
    const response = await request<TechnicianListResponse>(
      `/technicians${buildQuery(params)}`,
    );

    return response.data;
  },

  async getTechnicianById(technicianId: string) {
    const response = await request<Technician>(`/technicians/${technicianId}`);
    return response.data;
  },

  async getReviewsByService(
    serviceId: string,
    params: { page?: number; limit?: number } = {},
  ) {
    const response = await request<ReviewListResponse>(
      `/reviews/service/${serviceId}${buildQuery(params)}`,
    );

    return response.data;
  },

  async getReviewsByTechnician(
    technicianId: string,
    params: { page?: number; limit?: number } = {},
  ) {
    const response = await request<ReviewListResponse>(
      `/reviews/technician/${technicianId}${buildQuery(params)}`,
    );

    return response.data;
  },
};
