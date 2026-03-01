import axios from "axios";
import { getAuthHeaders } from "./actions";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/sessions
});

// PH-L2-Assignment-4 approach: manually inject cookies
apiClient.interceptors.request.use(async (config) => {
  try {
    const cookies = await getAuthHeaders();
    if (cookies) {
      config.headers["Cookie"] = cookies;
      // Also try to extract the session token specifically if needed
      const sessionToken = cookies
        .split("; ")
        .find((row) => row.startsWith("jobmailer-ai.session_token="))
        ?.split("=")[1];

      if (sessionToken) {
        config.headers["Authorization"] = `Bearer ${sessionToken}`;
      }
    }
  } catch (error) {
    console.error("Failed to get auth headers", error);
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here if needed (e.g., 401 Unauthorized redirect)
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/login") &&
      !window.location.pathname.includes("/register")
    ) {
      // Optional: Redirect to login or clear auth state
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
