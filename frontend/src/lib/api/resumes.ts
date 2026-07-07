import { ApiResponse, Resume } from "@/types";
import { apiClient } from "./client";

export const resumesApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<Resume[]>>("/resumes");
    return response.data.data;
  },

  upload: async (data: { jobRole: string; file: File }) => {
    const form = new FormData();
    form.append("jobRole", data.jobRole);
    form.append("file", data.file);

    const response = await apiClient.post<ApiResponse<Resume>>(
      "/resumes",
      form,
    );
    return response.data.data;
  },

  update: async (id: string, data: { jobRole?: string; file?: File } = {}) => {
    const form = new FormData();
    if (data.jobRole) form.append("jobRole", data.jobRole);
    if (data.file) form.append("file", data.file);

    const response = await apiClient.put<ApiResponse<Resume>>(
      `/resumes/${id}`,
      form,
    );
    return response.data.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/resumes/${id}`);
  },

  download: async (id: string, fileName: string) => {
    const response = await apiClient.get<Blob>(`/resumes/${id}/file`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};
