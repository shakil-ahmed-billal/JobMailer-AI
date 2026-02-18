import { ApiResponse, Task } from "@/types";
import { apiClient } from "./client";

export const tasksApi = {
  getAll: async (jobId?: string) => {
    const params = jobId ? { jobId } : {};
    const response = await apiClient.get<ApiResponse<Task[]>>("/tasks", {
      params,
    });
    return response.data.data;
  },

  create: async (data: Partial<Task>) => {
    const response = await apiClient.post<ApiResponse<Task>>("/tasks", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Task>) => {
    const response = await apiClient.put<ApiResponse<Task>>(
      `/tasks/${id}`,
      data,
    );
    return response.data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/tasks/${id}`);
  },

  getUpcoming: async () => {
    // This might be a specific endpoint or filtered query
    const response = await apiClient.get<ApiResponse<Task[]>>(
      "/tasks?upcoming=true",
    );
    return response.data.data;
  },
};
