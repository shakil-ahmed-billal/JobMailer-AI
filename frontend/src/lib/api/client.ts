import { getAuthHeaders } from "./actions";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: any;
}

class ApiClient {
  private getBaseUrl(): string {
    if (typeof window !== "undefined") {
      return "/api/v1";
    }
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
    return `${backendUrl}/api/v1`;
  }

  constructor() {}

  private async request<T>(
    endpoint: string,
    options: any = {},
  ): Promise<ApiResponse<T>> {
    const cookies = await getAuthHeaders();
    const isBrowser = typeof window !== "undefined";
    const baseUrl = this.getBaseUrl();
    let url = `${baseUrl}${endpoint}`;

    // Handle query parameters (Axios-style params)
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }

    const headers: any = {
      ...options.headers,
    };

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = headers["Content-Type"] || "application/json";
    }

    // CRITICAL: Manual Cookie injection ONLY on server.
    // In browser, credentials: "include" + same-origin proxy handles it.
    if (!isBrowser && cookies) {
      headers["Cookie"] = cookies;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include", // CRITICAL for sending cookies
      });

      if (options.responseType === "blob") {
        const blob = await response.blob();
        return {
          success: response.ok,
          data: blob as any as T,
        };
      }

      const data = await response.json();

      // Better-auth and your backend might return 401
      if (response.status === 401 && typeof window !== "undefined") {
        // Handle logout if needed
      }

      return {
        success: response.ok,
        data: data,
        message: data.message,
        error: data.error,
      };
    } catch (error: any) {
      return {
        success: false,
        data: null as T,
        error: { message: error.message || "An error occurred" },
      };
    }
  }

  async get<T>(endpoint: string, options: any = {}) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, body?: any, options: any = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any, options: any = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body?: any, options: any = {}) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options: any = {}) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
