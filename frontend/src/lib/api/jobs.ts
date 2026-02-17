import { Job, PaginatedResponse } from "@/types";
import { apiClient } from "./client";

export interface JobFilters {
  status?: string;
  applyStatus?: string;
  responseStatus?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const jobsApi = {
  getAll: async (filters?: JobFilters, page = 1, limit = 10) => {
    const params = { ...filters, page, limit };
    const response = await apiClient.get<PaginatedResponse<Job>>("/jobs", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Job>(`/jobs/${id}`);
    return response.data;
  },

  create: async (data: Partial<Job>) => {
    const response = await apiClient.post<Job>("/jobs", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Job>) => {
    const response = await apiClient.put<Job>(`/jobs/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/jobs/${id}`);
  },

  getStats: async () => {
    try {
      const response = await apiClient.get("/jobs/stats/overview");
      return response.data;
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
