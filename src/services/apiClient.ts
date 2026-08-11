import type { ApiError, ApiResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

class ApiClientError extends Error {
  status: number;
  errors: ApiError[] | null;

  constructor(message: string, status: number, errors: ApiError[] | null) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.errors = errors;
  }
}

const parseResponse = async <TData>(
  response: Response
): Promise<ApiResponse<TData>> => {
  const payload = (await response.json()) as ApiResponse<TData>;

  if (!response.ok || !payload.success) {
    throw new ApiClientError(payload.message, response.status, payload.errors);
  }

  return payload;
};

export const apiClient = {
  async get<TData>(
    path: string,
    init?: RequestInit
  ): Promise<ApiResponse<TData>> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    });

    return parseResponse<TData>(response);
  },

  async post<TData, TBody extends object>(
    path: string,
    body: TBody,
    init?: RequestInit
  ): Promise<ApiResponse<TData>> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init?.headers,
      },
      body: JSON.stringify(body),
    });

    return parseResponse<TData>(response);
  },
};

export { ApiClientError };
