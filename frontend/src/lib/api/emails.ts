import { Email, EmailType } from "@/types";
import { apiClient } from "./client";

export const emailsApi = {
  getAll: async () => {
    const response = await apiClient.get<Email[]>("/emails");
    return response.data;
  },

  generate: async (jobId: string, userProfile: any) => {
    const response = await apiClient.post<{ subject: string; content: string }>(
      "/emails/generate",
      {
        jobId,
        userProfile,
      },
    );
    return response.data;
  },

  generateReply: async (emailId: string, instruction: string) => {
    const response = await apiClient.post<{ subject: string; content: string }>(
      "/emails/reply-generate",
      {
        emailId,
        instruction,
      },
    );
    return response.data;
  },

  send: async (data: {
    jobId: string;
    subject: string;
    content: string;
    emailType: EmailType;
    to: string;
  }) => {
    const response = await apiClient.post<Email>("/emails/send", data);
    return response.data;
  },
};
