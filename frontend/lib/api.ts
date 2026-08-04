import { API_BASE_URL, TOKEN_STORAGE_KEY } from "./constants";
import type { ApiErrorResponse, ApiResponse } from "@/types/api";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
  token?: string;
};

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

const isJsonBody = (body: RequestOptions["body"]) =>
  body !== null &&
  typeof body === "object" &&
  !(body instanceof FormData) &&
  !(body instanceof Blob) &&
  !(body instanceof URLSearchParams);

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const token = options.token ?? getStoredToken();
  const headers = new Headers(options.headers);

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let body: BodyInit | undefined;

  if (options.body !== undefined && options.body !== null) {
    if (isJsonBody(options.body)) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(options.body);
    } else {
      body = options.body as BodyInit;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as ApiResponse<T> | ApiErrorResponse)
    : null;

  if (!response.ok) {
    const errorMessage =
      payload && "message" in payload
        ? payload.message
        : "Something went wrong";

    throw new ApiError(errorMessage, response.status, payload);
  }

  return payload as ApiResponse<T>;
}
