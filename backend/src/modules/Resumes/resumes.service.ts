import { JobRole, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { CloudinaryUtils } from "../../utils/cloudinary";

export interface CreateResumeInput {
  userId: string;
  jobRole: JobRole;
  fileName: string;
  fileUrl: string;
  publicId: string;
}

export interface UpdateResumeInput {
  userId: string;
  id: string;
  jobRole?: JobRole;
  fileName?: string;
  fileUrl?: string;
  publicId?: string;
}

const getResumes = async (userId: string) => {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
};

const getResumeById = async (userId: string, id: string) => {
  return prisma.resume.findFirst({ where: { id, userId } });
};

const createResume = async (input: CreateResumeInput) => {
  const { userId, jobRole, fileName, fileUrl, publicId } = input;

  const existing = await prisma.resume.findUnique({
    where: { userId_jobRole: { userId, jobRole } },
  });
  if (existing) {
    // If it exists, we should delete the newly uploaded file to keep Cloudinary clean
    await CloudinaryUtils.deleteFromCloudinary(publicId);

    const err: any = new Error(
      "Resume already exists for this role. Please replace it instead.",
    );
    err.statusCode = 409;
    throw err;
  }

  // Try to create record in DB
  try {
    return await prisma.resume.create({
      data: {
        userId,
        jobRole,
        fileUrl,
        publicId,
        fileName,
      },
    });
  } catch (dbError) {
    // Rollback: Delete from Cloudinary if DB fails
    await CloudinaryUtils.deleteFromCloudinary(publicId);
    throw dbError;
  }
};

const updateResume = async (input: UpdateResumeInput) => {
  const { userId, id, jobRole, fileName, fileUrl, publicId } = input;

  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) {
    // If record not found, delete the newly uploaded file
    if (publicId) {
      await CloudinaryUtils.deleteFromCloudinary(publicId);
    }
    const err: any = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }

  const nextRole = jobRole ?? resume.jobRole;
  const nextFileUrl = fileUrl ?? resume.fileUrl;
  const nextPublicId = publicId ?? resume.publicId;
  const nextFileName = fileName ?? resume.fileName;

  try {
    const updated = await prisma.resume.update({
      where: { id },
      data: {
        jobRole: nextRole,
        fileUrl: nextFileUrl,
        publicId: nextPublicId,
        fileName: nextFileName,
      },
    });

    // If successful and we uploaded a new file, delete the old one from Cloudinary
    if (publicId && resume.publicId && publicId !== resume.publicId) {
      await CloudinaryUtils.deleteFromCloudinary(resume.publicId);
    }

    return updated;
  } catch (e: any) {
    // Rollback: If DB update fails, delete the new file from Cloudinary (if we uploaded one)
    if (publicId) {
      await CloudinaryUtils.deleteFromCloudinary(publicId);
    }

    // Unique constraint: one resume per role per user
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      const err: any = new Error(
        "You already have a resume for that role. Delete it first or choose another role.",
      );
      err.statusCode = 409;
      throw err;
    }
    throw e;
  }
};

const deleteResume = async (userId: string, id: string) => {
  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) {
    const err: any = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }

  // Delete from Cloudinary
  if (resume.publicId) {
    await CloudinaryUtils.deleteFromCloudinary(resume.publicId);
  }

  await prisma.resume.delete({ where: { id } });
};

const getResumeFile = async (userId: string, id: string) => {
  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) {
    const err: any = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }

  return { resume, fileUrl: resume.fileUrl, publicId: resume.publicId };
};

const getResumeByUserAndRole = async (userId: string, jobRole: JobRole) => {
  return prisma.resume.findUnique({
    where: { userId_jobRole: { userId, jobRole } },
  });
};

export const ResumesService = {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  getResumeFile,
  getResumeByUserAndRole,
};
