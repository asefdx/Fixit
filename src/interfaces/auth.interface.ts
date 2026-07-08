import type { UserRole } from "@prisma/client";

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}
