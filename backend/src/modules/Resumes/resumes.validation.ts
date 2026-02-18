import { z } from "zod";
import { JobRole } from "../../../generated/prisma/client";

export const resumeIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getResumesSchema = z.object({
  query: z.object({}).optional(),
});

export const createResumeBodySchema = z.object({
  jobRole: z.nativeEnum(JobRole, { message: "Job role is required" }),
});

export const updateResumeBodySchema = z.object({
  jobRole: z.nativeEnum(JobRole).optional(),
});

