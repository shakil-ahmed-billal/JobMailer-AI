import {
  ApplyStatus,
  JobRole,
  JobStatus,
  ResponseStatus,
} from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

interface CreateJobData {
  companyName: string;
  companyEmail: string;
  jobTitle: string;
  jobDescription: string;
  jobRole: JobRole;
  companyWebsite?: string;
  companyLinkedin?: string;
  companyNumber?: string;
  location?: string;
  salary?: string;
  notes?: string;
}

interface UpdateJobData extends Partial<CreateJobData> {
  status?: JobStatus;
  applyStatus?: ApplyStatus;
  responseStatus?: ResponseStatus;
}

interface JobFilters {
  status?: JobStatus;
  applyStatus?: ApplyStatus;
  responseStatus?: ResponseStatus;
  jobRole?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

const createJob = async (userId: string, data: CreateJobData) => {
  return await prisma.job.create({
    data: {
      ...data,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

const getJobs = async (userId: string, filters: JobFilters = {}) => {
  const { status, applyStatus, responseStatus, jobRole, search, startDate, endDate } =
    filters;

  const where: any = { userId };

  if (status) where.status = status;
  if (applyStatus) where.applyStatus = applyStatus;
  if (responseStatus) where.responseStatus = responseStatus;
  if (jobRole) {
    const roles = jobRole
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    if (roles.length > 0) where.jobRole = { in: roles };
  }

  if (search) {
    where.OR = [
      { companyName: { contains: search, mode: "insensitive" } },
      { jobTitle: { contains: search, mode: "insensitive" } },
    ];
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  return await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          tasks: true,
          emails: true,
        },
      },
    },
  });
};

const getJobById = async (userId: string, jobId: string) => {
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
    },
    include: {
      tasks: {
        orderBy: { deadline: "asc" },
      },
      emails: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return job;
};

const updateJob = async (
  userId: string,
  jobId: string,
  data: UpdateJobData,
) => {
  // Verify ownership
  const job = await prisma.job.findFirst({
    where: { id: jobId, userId },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  return await prisma.job.update({
    where: { id: jobId },
    data,
  });
};

const deleteJob = async (userId: string, jobId: string) => {
  // Verify ownership
  const job = await prisma.job.findFirst({
    where: { id: jobId, userId },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  return await prisma.job.delete({
    where: { id: jobId },
  });
};

const getJobStats = async (userId: string) => {
  const totalJobs = await prisma.job.count({ where: { userId } });

  const appliedJobs = await prisma.job.count({
    where: { userId, applyStatus: "APPLIED" },
  });

  const emailsSent = await prisma.email.count({
    where: { userId, status: "SENT" },
  });

  const responseStats = await prisma.job.groupBy({
    by: ["responseStatus"],
    where: { userId },
    _count: true,
  });
  const jobStatusStats = await prisma.job.groupBy({
    by: ["status"],
    where: { userId },
    _count: true,
  });

  const interviewCount =
    jobStatusStats.find((s) => s.status === "INTERVIEW")?._count || 0;

  // Calculate response rate: (Jobs with response / Applied jobs) * 100
  const totalResponses = responseStats.reduce((acc, curr) => {
    if (curr.responseStatus !== "NO_RESPONSE") return acc + curr._count;
    return acc;
  }, 0);

  const responseRate =
    appliedJobs > 0 ? Math.round((totalResponses / appliedJobs) * 100) : 0;

  return {
    totalJobs,
    appliedJobs,
    emailsSent, // Keeping this if needed elsewhere
    responseStats, // Keeping this if needed elsewhere
    interviewCount,
    responseRate,
  };
};

export const JobsService = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats,
};
