import { z } from "zod";
import { TaskStatus } from "../../../generated/prisma/client";

export const createTaskSchema = z.object({
  body: z.object({
    jobId: z.string().uuid(),
    title: z.string().min(1, "Title is required"),
    taskLink: z.string().url().optional().or(z.literal("")),
    deadline: z.string().datetime(),
    description: z.string().optional(),
    submitStatus: z.nativeEnum(TaskStatus).optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    title: z.string().min(1).optional(),
    taskLink: z.string().url().optional().or(z.literal("")),
    deadline: z.string().datetime().optional(),
    submitStatus: z.nativeEnum(TaskStatus).optional(),
    description: z.string().optional(),
  }),
});

export const getTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const deleteTaskSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getTasksSchema = z.object({
  query: z.object({
    jobId: z.string().uuid().optional(),
    submitStatus: z.nativeEnum(TaskStatus).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
