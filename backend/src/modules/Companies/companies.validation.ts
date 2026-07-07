import { z } from "zod";

const createCompanySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    company: z.string().optional(),
    webLink: z.string().url("Invalid web link").optional().or(z.literal("")),
    location: z.string().optional(),
  }),
});

const updateCompanySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    company: z.string().optional(),
    webLink: z.string().url("Invalid web link").optional().or(z.literal("")),
    location: z.string().optional(),
  }),
});

export const TopCompanyValidation = {
  createCompanySchema,
  updateCompanySchema,
};
