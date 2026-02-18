import { ApiResponse, AIProvider, Email, EmailType } from "@/types";
import { apiClient } from "./client";

export const emailsApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Email[]>>("/emails");
    return response.data.data;
  },

  generate: async (jobId: string, aiProvider: AIProvider = "OPENAI") => {
    const response = await apiClient.post<
      ApiResponse<{ subject: string; content: string }>
    >("/emails/generate-application", {
      jobId,
      aiProvider,
    });
    return response.data.data;
  },

  generateReply: async (
    emailId: string,
    instruction: string,
    aiProvider: AIProvider = "OPENAI",
  ) => {
    const response = await apiClient.post<
      ApiResponse<{ subject: string; content: string }>
    >("/emails/generate-reply", {
      emailId,
      userPrompt: instruction,
      aiProvider,
    });
    return response.data.data;
  },

  send: async (data: {
    jobId: string;
    subject: string;
    content: string;
    emailType: EmailType;
    aiProvider?: AIProvider;
  }) => {
    const response = await apiClient.post<ApiResponse<Email>>(
      "/emails/send",
      data,
    );
    return response.data.data;
  },
};
