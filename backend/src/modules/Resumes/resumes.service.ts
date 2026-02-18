import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { JobRole, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads", "resumes");

function sanitizeFileName(name: string) {
  const base = path.basename(name);
  return base.replace(/[^\w.\-() ]+/g, "_").replace(/\s+/g, " ").trim();
}

function ensurePdfName(name: string) {
  return name.toLowerCase().endsWith(".pdf") ? name : `${name}.pdf`;
}

function toPosix(p: string) {
  return p.split(path.sep).join("/");
}

function isPathInside(child: string, parent: string) {
  const rel = path.relative(parent, child);
  return rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}

async function ensureDir(dir: string) {
  await fsp.mkdir(dir, { recursive: true });
}

async function safeUnlink(filePath: string) {
  try {
    await fsp.unlink(filePath);
  } catch (e: any) {
    if (e?.code !== "ENOENT") throw e;
  }
}

export interface CreateResumeInput {
  userId: string;
  jobRole: JobRole;
  originalFileName: string;
  buffer: Buffer;
}

export interface UpdateResumeInput {
  userId: string;
  id: string;
  jobRole?: JobRole;
  originalFileName?: string;
  buffer?: Buffer;
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
  const { userId, jobRole, originalFileName, buffer } = input;

  const existing = await prisma.resume.findUnique({
    where: { userId_jobRole: { userId, jobRole } },
  });
  if (existing) {
    const err: any = new Error(
      "Resume already exists for this role. Please replace it instead.",
    );
    err.statusCode = 409;
    throw err;
  }

  const safeName = ensurePdfName(sanitizeFileName(originalFileName || "resume.pdf"));
  const stamp = Date.now();
  const storedFileName = `${stamp}-${safeName}`;
  const roleDir = path.join(UPLOAD_ROOT, userId, jobRole);
  await ensureDir(roleDir);

  const absolutePath = path.join(roleDir, storedFileName);
  await fsp.writeFile(absolutePath, buffer);

  const relativePath = toPosix(
    path.relative(process.cwd(), absolutePath),
  );

  return prisma.resume.create({
    data: {
      userId,
      jobRole,
      fileUrl: relativePath,
      fileName: safeName,
    },
  });
};

const updateResume = async (input: UpdateResumeInput) => {
  const { userId, id, jobRole, originalFileName, buffer } = input;

  const resume = await prisma.resume.findFirst({ where: { id, userId } });
  if (!resume) {
    const err: any = new Error("Resume not found");
    err.statusCode = 404;
    throw err;
  }

  const nextRole = jobRole ?? resume.jobRole;
  let nextFileUrl = resume.fileUrl;
  let nextFileName = resume.fileName;

  if (buffer && originalFileName) {
    // Delete old file (best-effort) before writing new one
    const oldAbs = path.join(process.cwd(), resume.fileUrl);
    if (isPathInside(oldAbs, UPLOAD_ROOT)) {
      await safeUnlink(oldAbs);
    }

    const safeName = ensurePdfName(
      sanitizeFileName(originalFileName || "resume.pdf"),
    );
    const stamp = Date.now();
    const storedFileName = `${stamp}-${safeName}`;
    const roleDir = path.join(UPLOAD_ROOT, userId, nextRole);
    await ensureDir(roleDir);

    const absolutePath = path.join(roleDir, storedFileName);
    await fsp.writeFile(absolutePath, buffer);

    nextFileUrl = toPosix(path.relative(process.cwd(), absolutePath));
    nextFileName = safeName;
  }

  try {
    return await prisma.resume.update({
      where: { id },
      data: {
        jobRole: nextRole,
        fileUrl: nextFileUrl,
        fileName: nextFileName,
      },
    });
  } catch (e: any) {
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

  const abs = path.join(process.cwd(), resume.fileUrl);
  if (isPathInside(abs, UPLOAD_ROOT)) {
    await safeUnlink(abs);
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

  const abs = path.join(process.cwd(), resume.fileUrl);
  if (!isPathInside(abs, UPLOAD_ROOT)) {
    const err: any = new Error("Invalid resume file path");
    err.statusCode = 400;
    throw err;
  }

  if (!fs.existsSync(abs)) {
    const err: any = new Error("Resume file missing on server");
    err.statusCode = 404;
    throw err;
  }

  return { resume, absolutePath: abs };
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

