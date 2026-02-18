export type JobStatus =
  | "DRAFT"
  | "APPLIED"
  | "INTERVIEW"
  | "REJECTED"
  | "OFFER";
export type ApplyStatus = "NOT_APPLIED" | "APPLIED";
export type ResponseStatus =
  | "NO_RESPONSE"
  | "REPLIED"
  | "REJECTED"
  | "ACCEPTED";
export type EmailSendStatus = "NOT_SENT" | "SENT" | "FAILED";
export type EmailType = "APPLICATION" | "REPLY";
export type TaskStatus = "PENDING" | "SUBMITTED" | "OVERDUE";
export type AIProvider = "OPENAI" | "GEMINI";
export type JobRole =
  | "FRONTEND_DEVELOPER"
  | "FRONTEND_ENGINEER"
  | "BACKEND_DEVELOPER"
  | "BACKEND_ENGINEER"
  | "MERN_STACK_DEVELOPER"
  | "FULL_STACK_DEVELOPER"
  | "SOFTWARE_ENGINEER"
  | "CMS_DEVELOPER";

export interface User {
  id: string;
  name: string;
  email: string;
  profileBio?: string | null;
  resumeLink?: string | null;
  linkedinLink?: string | null;
  portfolioLink?: string | null;
  resumeContent?: string | null;
  skills?: string | null;
  experience?: string | null;
  education?: string | null;
  certifications?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  userId: string;
  companyName: string;
  companyEmail: string;
  jobTitle: string;
  jobDescription: string;
  jobRole: JobRole;
  companyWebsite?: string | null;
  companyLinkedin?: string | null;
  companyNumber?: string | null;
  location?: string | null;
  salary?: string | null;
  notes?: string | null;
  status: JobStatus;
  applyStatus: ApplyStatus;
  responseStatus: ResponseStatus;
  emailSendStatus: EmailSendStatus;
  applyDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  jobRole: JobRole;
  fileUrl: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Email {
  id: string;
  userId: string;
  jobId: string;
  subject: string;
  content: string;
  aiProvider: AIProvider;
  emailType: EmailType;
  status: EmailSendStatus;
  sentAt?: string | null;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  jobId: string;
  title: string;
  taskLink?: string | null;
  deadline: string;
  submitStatus: TaskStatus;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  job?: Job; // Optional relation for display
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
  error?: unknown;
}
