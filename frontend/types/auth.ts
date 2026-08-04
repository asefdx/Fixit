export type UserRole = "CUSTOMER" | "TECHNICIAN" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";

export type TechnicianProfile = {
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

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  technicianProfile?: TechnicianProfile | null;
};

export type AuthSession = {
  user: AuthUser;
  accessToken: string;
};
