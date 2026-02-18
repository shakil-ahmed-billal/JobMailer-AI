import { JobRole } from "@/types";

export const JOB_ROLE_OPTIONS: { value: JobRole; label: string }[] = [
  { value: "FRONTEND_DEVELOPER", label: "Frontend Developer" },
  { value: "FRONTEND_ENGINEER", label: "Frontend Engineer" },
  { value: "BACKEND_DEVELOPER", label: "Backend Developer" },
  { value: "BACKEND_ENGINEER", label: "Backend Engineer" },
  { value: "MERN_STACK_DEVELOPER", label: "MERN Stack Developer" },
  { value: "FULL_STACK_DEVELOPER", label: "Full Stack Developer" },
  { value: "SOFTWARE_ENGINEER", label: "Software Engineer" },
  { value: "CMS_DEVELOPER", label: "CMS Developer" },
];

export function formatJobRole(role?: JobRole | null) {
  if (!role) return "—";
  return JOB_ROLE_OPTIONS.find((o) => o.value === role)?.label ?? role;
}

