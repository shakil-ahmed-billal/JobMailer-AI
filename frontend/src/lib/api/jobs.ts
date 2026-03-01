import { ApiResponse, Job, PaginatedResponse } from "@/types";
import { apiClient } from "./client";

export interface JobFilters {
  status?: string;
  applyStatus?: string;
  responseStatus?: string;
  jobRole?: string; // comma-separated enum values for multi-select
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const jobsApi = {
  getAll: async (filters?: JobFilters, page = 1, limit = 10) => {
    const params = { ...filters, page, limit };
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Job>>>(
      "/jobs",
      {
        params,
      },
    );
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Job>) => {
    const response = await apiClient.post<ApiResponse<Job>>("/jobs", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<Job>) => {
    const response = await apiClient.put<ApiResponse<Job>>(`/jobs/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/jobs/${id}`);
  },

  getStats: async () => {
    try {
      const response = await apiClient.get<
        ApiResponse<{
          totalJobs: number;
          appliedJobs: number;
          interviewCount: number;
          responseRate: number;
        }>
      >("/jobs/stats/overview");
      return response.data.data;
    } catch (error) {
      // Fallback for now if endpoint doesn't exist
      return {
        totalJobs: 0,
        appliedJobs: 0,
        responseRate: 0,
        interviewCount: 0,
      };
    }
  },
};
