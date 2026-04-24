import { TaskStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

interface CreateTaskData {
  jobId: string;
  title: string;
  taskLink?: string;
  deadline: Date;
  description?: string;
}

interface UpdateTaskData {
  title?: string;
  taskLink?: string;
  deadline?: Date;
  submitStatus?: TaskStatus;
  description?: string;
}

interface TaskFilters {
  jobId?: string;
  submitStatus?: TaskStatus;
}

const createTask = async (userId: string, data: CreateTaskData) => {
  // Verify job belongs to user
  const job = await prisma.job.findFirst({
    where: { id: data.jobId, userId },
  });

  if (!job) {
    throw new Error("Job not found");
  }

  // Check if deadline has passed and set status accordingly
  const now = new Date();
  const deadline = new Date(data.deadline);
  const submitStatus = deadline < now ? TaskStatus.OVERDUE : TaskStatus.PENDING;

  return await prisma.task.create({
    data: {
      ...data,
      userId,
      submitStatus,
      deadline: new Date(data.deadline),
    },
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true,
        },
      },
    },
  });
};

const getTasks = async (userId: string, filters: any = {}) => {
  const { jobId, submitStatus, page = 1, limit = 10 } = filters;
  const validPage = Math.max(1, Number(page) || 1);
  const validLimit = Math.max(1, Number(limit) || 10);
  const skip = (validPage - 1) * validLimit;
  const take = validLimit;

  const where: any = { userId };

  if (jobId) where.jobId = jobId;
  if (submitStatus) where.submitStatus = submitStatus;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take,
      orderBy: { deadline: "asc" },
      include: {
        job: {
          select: {
            id: true,
            companyName: true,
            jobTitle: true,
          },
        },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: tasks,
    meta: {
      total,
      page: validPage,
      limit: validLimit,
      totalPages: Math.ceil(total / validLimit),
    },
  };
};

const getTasksByJobId = async (userId: string, jobId: string) => {
  return await prisma.task.findMany({
    where: {
      userId,
      jobId,
    },
    orderBy: { deadline: "asc" },
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true,
        },
      },
    },
  });
};

const getTaskById = async (userId: string, taskId: string) => {
  return await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true,
        },
      },
    },
  });
};

const updateTask = async (
  userId: string,
  taskId: string,
  data: UpdateTaskData,
) => {
  // Verify ownership
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  const updateData: any = { ...data };
  if (data.deadline) {
    updateData.deadline = new Date(data.deadline);
  }

  return await prisma.task.update({
    where: { id: taskId },
    data: updateData,
  });
};

const deleteTask = async (userId: string, taskId: string) => {
  // Verify ownership
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  return await prisma.task.delete({
    where: { id: taskId },
  });
};

const getUpcomingTasks = async (userId: string, limit: number = 5) => {
  const now = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  return await prisma.task.findMany({
    where: {
      userId,
      deadline: {
        gte: now,
        lte: oneWeekFromNow,
      },
      submitStatus: TaskStatus.PENDING,
    },
    orderBy: { deadline: "asc" },
    take: limit,
    include: {
      job: {
        select: {
          id: true,
          companyName: true,
          jobTitle: true,
        },
      },
    },
  });
};

export const TasksService = {
  createTask,
  getTasks,
  getTasksByJobId,
  getTaskById,
  updateTask,
  deleteTask,
  getUpcomingTasks,
};
