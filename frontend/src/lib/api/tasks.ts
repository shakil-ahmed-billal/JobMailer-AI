import { Task } from "@/types";
import { apiClient } from "./client";

export const tasksApi = {
  getAll: async (jobId?: string) => {
    const params = jobId ? { jobId } : {};
    const response = await apiClient.get<Task[]>("/tasks", { params });
    return response.data;
  },

  create: async (data: Partial<Task>) => {
    const response = await apiClient.post<Task>("/tasks", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Task>) => {
    const response = await apiClient.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/tasks/${id}`);
  },

  getUpcoming: async () => {
    // This might be a specific endpoint or filtered query
    const response = await apiClient.get<Task[]>("/tasks?upcoming=true");
    return response.data;
  },
};
