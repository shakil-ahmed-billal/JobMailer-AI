import { z } from "zod";
import { AIProvider, EmailType } from "../../../generated/prisma/client";

export const generateApplicationEmailSchema = z.object({
  body: z.object({
    jobId: z.string().uuid(),
    aiProvider: z.nativeEnum(AIProvider).optional().default(AIProvider.OPENAI),
  }),
});

export const generateReplyEmailSchema = z.object({
  body: z.object({
    emailId: z.string().uuid(),
    userPrompt: z.string().min(1, "Prompt is required"),
    aiProvider: z.nativeEnum(AIProvider).optional().default(AIProvider.OPENAI),
  }),
});

export const sendEmailSchema = z.object({
  body: z.object({
    jobId: z.string().uuid(),
    subject: z.string().min(1, "Subject is required"),
    content: z.string().min(1, "Content is required"),
    emailType: z.nativeEnum(EmailType),
    aiProvider: z.nativeEnum(AIProvider).optional().default(AIProvider.OPENAI),
  }),
});

export const getEmailsSchema = z.object({
  query: z.object({
    emailType: z.nativeEnum(EmailType).optional(),
    jobId: z.string().uuid().optional(),
  }),
});

export const getEmailSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
