import { z } from "zod";
import {
  ApplyStatus,
  JobRole,
  JobStatus,
  ResponseStatus,
} from "../../../generated/prisma/client";

export const createJobSchema = z.object({
  body: z.object({
    companyName: z.string().min(1, "Company name is required"),
    companyEmail: z.string().email("Invalid email address"),
    jobTitle: z.string().min(1, "Job title is required"),
    jobDescription: z.string().min(1, "Job description is required"),
    jobRole: z.nativeEnum(JobRole, { message: "Job role is required" }),
    companyWebsite: z.string().url().optional().or(z.literal("")),
    companyLinkedin: z.string().url().optional().or(z.literal("")),
    companyNumber: z.string().optional(),
    location: z.string().optional(),
    salary: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateJobSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    companyName: z.string().min(1).optional(),
    companyEmail: z.string().email().optional(),
    jobTitle: z.string().min(1).optional(),
    jobDescription: z.string().min(1).optional(),
    jobRole: z.nativeEnum(JobRole).optional(),
    companyWebsite: z.string().url().optional().or(z.literal("")),
    companyLinkedin: z.string().url().optional().or(z.literal("")),
    companyNumber: z.string().optional(),
    location: z.string().optional(),
    salary: z.string().optional(),
    notes: z.string().optional(),
    status: z.nativeEnum(JobStatus).optional(),
    applyStatus: z.nativeEnum(ApplyStatus).optional(),
    responseStatus: z.nativeEnum(ResponseStatus).optional(),
  }),
});

export const getJobSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deleteJobSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getJobsSchema = z.object({
  query: z.object({
    status: z.nativeEnum(JobStatus).optional(),
    applyStatus: z.nativeEnum(ApplyStatus).optional(),
    responseStatus: z.nativeEnum(ResponseStatus).optional(),
    // Multi-select supported via comma-separated string, e.g. jobRole=FRONTEND_DEVELOPER,BACKEND_ENGINEER
    jobRole: z.string().optional(),
    search: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});
