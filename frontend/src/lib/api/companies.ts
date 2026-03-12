import { ApiResponse, PaginatedResponse, TopCompany } from "@/types";
import { apiClient } from "./client";

export interface CompanyFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  location?: string;
}

export const companiesApi = {
  getAll: async (filters: CompanyFilters = {}) => {
    const params = { ...filters };
    const response = await apiClient.get<ApiResponse<PaginatedResponse<TopCompany>>>("/companies", { params });
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<TopCompany>>(`/companies/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<TopCompany>) => {
    const response = await apiClient.post<ApiResponse<TopCompany>>("/companies", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<TopCompany>) => {
    const response = await apiClient.patch<ApiResponse<TopCompany>>(`/companies/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/companies/${id}`);
  },
};
