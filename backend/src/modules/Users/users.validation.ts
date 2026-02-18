import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    profileBio: z.string().optional(),
    resumeLink: z.string().url().optional().or(z.literal("")),
    linkedinLink: z.string().url().optional().or(z.literal("")),
    portfolioLink: z.string().url().optional().or(z.literal("")),
    resumeContent: z.string().optional(),
    skills: z.string().optional(),
    experience: z.string().optional(),
    education: z.string().optional(),
    certifications: z.string().optional(),
  }),
});
