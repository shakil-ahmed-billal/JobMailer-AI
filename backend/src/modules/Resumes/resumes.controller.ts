import { Request, Response } from "express";
import multer from "multer";
import { JobRole } from "../../../generated/prisma/client";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createResumeBodySchema,
  updateResumeBodySchema,
} from "./resumes.validation";
import { ResumesService } from "./resumes.service";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

function isPdf(
  file: Express.Multer.File | undefined,
): file is Express.Multer.File {
  if (!file) return false;
  const nameOk = file.originalname?.toLowerCase().endsWith(".pdf");
  const mimeOk = file.mimetype === "application/pdf";
  // Some clients send application/octet-stream; we still require .pdf extension.
  return nameOk && (mimeOk || file.mimetype === "application/octet-stream");
}

const getResumes = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await ResumesService.getResumes(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Resumes retrieved successfully",
    data: result,
  });
});

const createResume = [
  upload.single("file"),
  catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;

    const parsed = createResumeBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid request",
      });
    }

    const file = req.file;
    if (!isPdf(file)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Only PDF files are allowed (max 5MB).",
      });
    }

    try {
      const result = await ResumesService.createResume({
        userId,
        jobRole: parsed.data.jobRole as JobRole,
        originalFileName: file.originalname,
        buffer: file.buffer,
      });

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Resume uploaded successfully",
        data: result,
      });
    } catch (e: any) {
      sendResponse(res, {
        statusCode: e?.statusCode || 500,
        success: false,
        message: e?.message || "Failed to upload resume",
      });
    }
  }),
];

const updateResume = [
  upload.single("file"),
  catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const id = String(req.params.id);

    const parsed = updateResumeBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid request",
      });
    }

    const file = req.file;
    if (file && !isPdf(file)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Only PDF files are allowed (max 5MB).",
      });
    }

    try {
      const result = await ResumesService.updateResume({
        userId,
        id,
        jobRole: parsed.data.jobRole,
        originalFileName: file?.originalname,
        buffer: file?.buffer,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Resume updated successfully",
        data: result,
      });
    } catch (e: any) {
      sendResponse(res, {
        statusCode: e?.statusCode || 500,
        success: false,
        message: e?.message || "Failed to update resume",
      });
    }
  }),
];

const deleteResume = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const id = String(req.params.id);

  try {
    await ResumesService.deleteResume(userId, id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (e: any) {
    sendResponse(res, {
      statusCode: e?.statusCode || 500,
      success: false,
      message: e?.message || "Failed to delete resume",
    });
  }
});

const downloadResumeFile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const id = String(req.params.id);

  try {
    const { resume, absolutePath } = await ResumesService.getResumeFile(
      userId,
      id,
    );

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(resume.fileName)}"`,
    );
    return res.sendFile(absolutePath);
  } catch (e: any) {
    return sendResponse(res, {
      statusCode: e?.statusCode || 500,
      success: false,
      message: e?.message || "Failed to download resume",
    });
  }
});

export const ResumesController = {
  getResumes,
  createResume,
  updateResume,
  deleteResume,
  downloadResumeFile,
};

