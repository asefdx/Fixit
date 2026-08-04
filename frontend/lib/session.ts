import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from "./constants";
import type { AuthSession } from "@/types/auth";

export const loadAuthSession = (): AuthSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const accessToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  const userRaw = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!accessToken || !userRaw) {
    return null;
  }

  try {
    return {
      accessToken,
      user: JSON.parse(userRaw) as AuthSession["user"],
    };
  } catch {
    return null;
  }
};

export const saveAuthSession = (session: AuthSession) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, session.accessToken);
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.user));
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_STORAGE_KEY);
};
