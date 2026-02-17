import { z } from "zod";
import { EmailType } from "../../../generated/prisma/client";

export const generateApplicationEmailSchema = z.object({
  body: z.object({
    jobId: z.string().uuid(),
  }),
});

export const generateReplyEmailSchema = z.object({
  body: z.object({
    emailId: z.string().uuid(),
    userPrompt: z.string().min(1, "Prompt is required"),
  }),
});

export const sendEmailSchema = z.object({
  body: z.object({
    jobId: z.string().uuid(),
    subject: z.string().min(1, "Subject is required"),
    content: z.string().min(1, "Content is required"),
    emailType: z.nativeEnum(EmailType),
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
