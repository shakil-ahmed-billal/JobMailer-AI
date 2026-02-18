import { ApiResponse, User } from "@/types";
import { apiClient } from "./client";

export const usersApi = {
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<User>>("/users/profile");
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put<ApiResponse<User>>("/users/profile", data);
    return response.data.data;
  },
};
