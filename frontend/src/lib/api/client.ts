import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies/sessions
});

// Request interceptor to add manual token if needed
apiClient.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    // Better-auth stores the session token in local storage or cookies.
    // We can try to get it from the cookie via a helper or just let axios handle withCredentials.
    // However, if the user wants manual cookie set, we can try to pass the session token as a header.
    const sessionToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jobmailer-ai.session_token="))
      ?.split("=")[1];

    if (sessionToken) {
      config.headers["Authorization"] = `Bearer ${sessionToken}`;
    }
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
