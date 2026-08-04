import type { UserRole } from "@/types/auth";

export const getDashboardPath = (role: UserRole) => {
  if (role === "ADMIN") {
    return "/dashboard/admin";
  }

  if (role === "TECHNICIAN") {
    return "/dashboard/technician";
  }

  return "/dashboard/customer";
};

export const publicRoutes = [
  "/",
  "/services",
  "/technicians",
  "/categories",
  "/about",
  "/contact",
  "/login",
  "/register",
];
