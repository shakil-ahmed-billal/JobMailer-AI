import { Resume } from "@/types";
import { apiClient } from "./client";

export const resumesApi = {
  getAll: async () => {
    const response = await apiClient.get<Resume[]>("/resumes");
    return response.data;
  },

  upload: async (data: { jobRole: string; file: File }) => {
    const form = new FormData();
    form.append("jobRole", data.jobRole);
    form.append("file", data.file);

    const response = await apiClient.post<Resume>("/resumes", form);
    return response.data;
  },

  update: async (id: string, data: { jobRole?: string; file?: File } = {}) => {
    const form = new FormData();
    if (data.jobRole) form.append("jobRole", data.jobRole);
    if (data.file) form.append("file", data.file);

    const response = await apiClient.put<Resume>(`/resumes/${id}`, form);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/resumes/${id}`);
  },

  download: async (id: string, fileName: string) => {
    const response = await apiClient.get<BlobPart>(`/resumes/${id}/file`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data as BlobPart], {
      type: "application/pdf",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};
