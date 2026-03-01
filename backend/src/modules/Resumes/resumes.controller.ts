import { Request, Response } from "express";
import { JobRole } from "../../../generated/prisma/client";
import { catchAsync } from "../../utils/catchAsync";
import { CloudinaryUtils } from "../../utils/cloudinary";
import { sendResponse } from "../../utils/sendResponse";
import { ResumesService } from "./resumes.service";
import {
  createResumeBodySchema,
  updateResumeBodySchema,
} from "./resumes.validation";

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

const createResume = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const parsed = createResumeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    if (req.file) {
      // If validation fails, we should delete the already uploaded file
      await CloudinaryUtils.deleteFromCloudinary(req.file.filename);
    }
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid request",
    });
  }

  const file = req.file;
  if (!file) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Please upload a resume file",
    });
  }

  try {
    const result = await ResumesService.createResume({
      userId,
      jobRole: parsed.data.jobRole as JobRole,
      fileName: file.originalname,
      fileUrl: file.path,
      publicId: file.filename,
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
});

const updateResume = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const id = String(req.params.id);

  const parsed = updateResumeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    if (req.file) {
      await CloudinaryUtils.deleteFromCloudinary(req.file.filename);
    }
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid request",
    });
  }

  const file = req.file;

  try {
    const result = await ResumesService.updateResume({
      userId,
      id,
      jobRole: parsed.data.jobRole,
      fileName: file?.originalname,
      fileUrl: file?.path,
      publicId: file?.filename,
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
});

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
    const { publicId, resume } = await ResumesService.getResumeFile(userId, id);

    if (!publicId) {
      throw new Error("Resume public ID not found");
    }

    const buffer = await CloudinaryUtils.fetchFileBuffer(publicId);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${resume.fileName}"`,
    );
    return res.send(buffer);
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
