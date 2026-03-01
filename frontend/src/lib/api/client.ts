import getCookies from "@/constants/getCookies";
import { ApiResponse } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: any = {},
  ): Promise<ApiResponse<T>> {
    const cookies = await getCookies();

    try {
      // For FormData, we must NOT set Content-Type manually so the browser can set the boundary
      const isFormData = options.body instanceof FormData;

      const headers: any = {
        ...(cookies && { Cookie: cookies }),
        ...options.headers,
      };

      if (!isFormData && !headers["Content-Type"] && !headers["content-type"]) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(cookies && { Cookie: cookies }),
          ...options.headers,
        },
        // withCredentials: true,
      });

      const contentType = response.headers.get("content-type");
      let data: any;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = {
          success: response.ok,
          message: text || response.statusText,
          data: text as any,
        };
      }

      if (!response.ok) {
        return {
          statusCode: response.status,
          success: false,
          message: data.message || data.error?.message || "An error occurred",
          data: data.data || (null as any),
          error: data.error,
        };
      }

      return data as ApiResponse<T>;
    } catch (error) {
      console.error("API Request Error:", error);
      if (error instanceof Error) {
        return {
          statusCode: 500,
          success: false,
          message: error.message,
          data: null as any,
          error: { message: error.message },
        };
      }
      return {
        statusCode: 500,
        success: false,
        message: "An error occurred",
        data: null as any,
        error: { message: "An error occurred" },
      };
    }
  }

  async get<T>(endpoint: string, options: any = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options: any = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options: any = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options: any = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async delete<T>(
    endpoint: string,
    options: any = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_URL);
