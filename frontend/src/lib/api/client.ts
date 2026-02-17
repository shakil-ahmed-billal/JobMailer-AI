import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/sessions
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
