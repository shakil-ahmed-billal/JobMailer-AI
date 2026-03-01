import { AIProvider, Email, EmailType } from "@/types";
import { apiClient } from "./client";

export const emailsApi = {
  getAll: async () => {
    const response = await apiClient.get<Email[]>("/emails");
    return response.data;
  },

  generate: async (jobId: string, aiProvider: AIProvider = "OPENAI") => {
    const response = await apiClient.post<{ subject: string; content: string }>(
      "/emails/generate-application",
      {
        jobId,
        aiProvider,
      },
    );
    return response.data;
  },

  generateReply: async (
    emailId: string,
    instruction: string,
    aiProvider: AIProvider = "OPENAI",
  ) => {
    const response = await apiClient.post<{ subject: string; content: string }>(
      "/emails/generate-reply",
      {
        emailId,
        userPrompt: instruction,
        aiProvider,
      },
    );
    return response.data;
  },

  send: async (data: {
    jobId: string;
    subject: string;
    content: string;
    emailType: EmailType;
    aiProvider?: AIProvider;
  }) => {
    const response = await apiClient.post<Email>("/emails/send", data);
    return response.data;
  },
};
