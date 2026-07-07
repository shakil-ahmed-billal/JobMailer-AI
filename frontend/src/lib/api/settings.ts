import { ApiResponse } from "@/types";
import { apiClient } from "./client";

export interface UserSettings {
  openaiApiKey?: string;
  geminiApiKey?: string;
  groqApiKey?: string;
  openrouterApiKey?: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  smtpUser?: string;
  smtpPassword?: string;
}

export const settingsApi = {
  getSettings: async () => {
    const response = await apiClient.get<ApiResponse<UserSettings>>("/settings");
    return response.data.data;
  },

  updateSettings: async (data: UserSettings) => {
    const response = await apiClient.put<ApiResponse<UserSettings>>("/settings", data);
    return response.data.data;
  },
};
