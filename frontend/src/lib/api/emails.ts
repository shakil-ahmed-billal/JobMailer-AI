import { ApiResponse, Email, EmailType } from "@/types";
import { apiClient } from "./client";

export const emailsApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Email[]>>("/emails");
    return response.data.data;
  },

  generate: async (jobId: string, userProfile: any) => {
    const response = await apiClient.post<
      ApiResponse<{ subject: string; content: string }>
    >("/emails/generate", {
      jobId,
      userProfile,
    });
    return response.data.data;
  },

  generateReply: async (emailId: string, instruction: string) => {
    const response = await apiClient.post<
      ApiResponse<{ subject: string; content: string }>
    >("/emails/reply-generate", {
      emailId,
      instruction,
    });
    return response.data.data;
  },

  send: async (data: {
    jobId: string;
    subject: string;
    content: string;
    emailType: EmailType;
    to: string;
  }) => {
    const response = await apiClient.post<ApiResponse<Email>>(
      "/emails/send",
      data,
    );
    return response.data.data;
  },
};
