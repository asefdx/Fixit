"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authService } from "@/services/auth";
import {
  clearAuthSession,
  loadAuthSession,
  saveAuthSession,
} from "@/lib/session";
import { getDashboardPath } from "@/lib/routes";
import type { AuthSession, AuthUser, UserRole } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: { email: string; password: string }) => Promise<AuthSession>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
    avatarUrl?: string;
    role: UserRole;
  }) => Promise<AuthSession>;
  logout: () => void;
  refreshSession: () => Promise<void>;
  getDashboardPath: (role: UserRole) => string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(loadAuthSession());
    setHydrated(true);
  }, []);

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.me(),
    enabled: hydrated && !!session?.accessToken,
    retry: false,
  });

  useEffect(() => {
    if (meQuery.data && session?.accessToken) {
      const nextSession = {
        accessToken: session.accessToken,
        user: meQuery.data,
      } satisfies AuthSession;

      setSession(nextSession);
      saveAuthSession(nextSession);
    }
  }, [meQuery.data, session?.accessToken]);

  useEffect(() => {
    if (meQuery.isError) {
      clearAuthSession();
      setSession(null);
    }
  }, [meQuery.isError]);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      const nextSession: AuthSession = data;
      setSession(nextSession);
      saveAuthSession(nextSession);
      queryClient.setQueryData(["auth", "me"], nextSession.user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      const nextSession: AuthSession = data;
      setSession(nextSession);
      saveAuthSession(nextSession);
      queryClient.setQueryData(["auth", "me"], nextSession.user);
    },
  });

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      accessToken: session?.accessToken ?? null,
      isLoading:
        !hydrated ||
        loginMutation.isPending ||
        registerMutation.isPending ||
        meQuery.isLoading,
      isAuthenticated: !!session?.accessToken && !!session?.user,
      login: async (payload) => loginMutation.mutateAsync(payload),
      register: async (payload) => registerMutation.mutateAsync(payload),
      logout: () => {
        clearAuthSession();
        setSession(null);
        queryClient.removeQueries({ queryKey: ["auth"] });
      },
      refreshSession: async () => {
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      },
      getDashboardPath,
    }),
    [
      hydrated,
      loginMutation,
      meQuery.isLoading,
      queryClient,
      registerMutation,
      session,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
