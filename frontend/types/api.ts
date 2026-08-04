export type ApiResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errorDetails?: unknown;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items?: T[];
  users?: T[];
  bookings?: T[];
  services?: T[];
  technicians?: T[];
  reviews?: T[];
  categories?: T[];
  meta: PaginationMeta;
};
