import { ApiResponse, TopCompany } from "@/types";
import { apiClient } from "./client";

export const companiesApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<TopCompany[]>>("/companies");
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
