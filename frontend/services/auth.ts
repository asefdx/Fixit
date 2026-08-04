import { request } from "@/lib/api";
import type { AuthSession, AuthUser } from "@/types/auth";

type AuthEnvelope = {
  user: AuthUser;
  accessToken: string;
};

export const authService = {
  async login(payload: { email: string; password: string }) {
    const response = await request<AuthEnvelope>("/auth/login", {
      method: "POST",
      body: payload,
    });

    return response.data;
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
    avatarUrl?: string;
    role: AuthUser["role"];
  }) {
    const response = await request<AuthEnvelope>("/auth/register", {
      method: "POST",
      body: payload,
    });

    return response.data;
  },

  async me() {
    const response = await request<AuthUser>("/auth/me", {
      method: "GET",
    });

    return response.data;
  },
};
