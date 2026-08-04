export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:5000/api";

export const TOKEN_STORAGE_KEY = "fixitnow_access_token";
export const USER_STORAGE_KEY = "fixitnow_user";
