import { User } from "@/types";
import { apiClient } from "./client";

export const usersApi = {
  getProfile: async () => {
    const response = await apiClient.get<User>("/users/profile");
    return response.data;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put<User>("/users/profile", data);
    return response.data;
  },
};
