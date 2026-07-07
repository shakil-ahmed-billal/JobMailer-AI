import { prisma } from "../../lib/prisma";

interface UpdateProfileData {
  name?: string;
  profileBio?: string;
  resumeLink?: string;
  linkedinLink?: string;
  portfolioLink?: string;
  resumeContent?: string;
  skills?: string;
  experience?: string;
  education?: string;
  certifications?: string;
}

const updateProfile = async (userId: string, data: UpdateProfileData) => {
  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      profileBio: true,
      resumeLink: true,
      linkedinLink: true,
      portfolioLink: true,
      resumeContent: true,
      skills: true,
      experience: true,
      education: true,
      certifications: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getProfile = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profileBio: true,
      resumeLink: true,
      linkedinLink: true,
      portfolioLink: true,
      resumeContent: true,
      skills: true,
      experience: true,
      education: true,
      certifications: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getRecentActivity = async (userId: string, limit: number = 5) => {
  // Fetch latest activities from different models
  const [jobs, tasks, emails] = await Promise.all([
    prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        companyName: true,
        jobTitle: true,
        createdAt: true,
        applyStatus: true,
      },
    }),
    prisma.task.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: limit,
      select: { id: true, title: true, updatedAt: true, submitStatus: true },
    }),
    prisma.email.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: { id: true, subject: true, emailType: true, createdAt: true },
    }),
  ]);

  // Format activities
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });
  const userName = user?.name || "You";

  const activities: any[] = [];

  jobs.forEach((job) => {
    activities.push({
      id: `job-${job.id}`,
      user: { name: userName, image: "/avatars/01.png" },
      action: job.applyStatus === "APPLIED" ? "applied to" : "saved a job at",
      target: `${job.jobTitle} at ${job.companyName}`,
      time: job.createdAt.toISOString(),
      type: "job",
      timestamp: new Date(job.createdAt).getTime(),
    });
  });

  tasks.forEach((task) => {
    activities.push({
      id: `task-${task.id}`,
      user: { name: userName, image: "/avatars/01.png" },
      action:
        task.submitStatus === "SUBMITTED" ? "completed task" : "updated task",
      target: task.title,
      time: task.updatedAt.toISOString(),
      type: "task",
      timestamp: new Date(task.updatedAt).getTime(),
    });
  });

  emails.forEach((email) => {
    activities.push({
      id: `email-${email.id}`,
      user: { name: "System", image: "/avatars/02.png" },
      action:
        email.emailType === "APPLICATION"
          ? "sent application email titled"
          : "sent reply email titled",
      target: `"${email.subject}"`,
      time: email.createdAt.toISOString(),
      type: "email",
      timestamp: new Date(email.createdAt).getTime(),
    });
  });

  // Sort by timestamp descending and take the limit
  return activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit)
    .map(({ timestamp, ...rest }) => rest);
};

export const UsersService = {
  updateProfile,
  getProfile,
  getRecentActivity,
};
