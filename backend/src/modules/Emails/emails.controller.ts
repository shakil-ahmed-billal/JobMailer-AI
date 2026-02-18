import { Request, Response } from "express";
import { AIProvider } from "../../../generated/prisma/client";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { EmailsService } from "./emails.service";
import { prisma } from "../../lib/prisma";
import { ResumesService } from "../Resumes/resumes.service";



const generateApplicationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { jobId, aiProvider = AIProvider.OPENAI } = req.body;

    // Validate AI provider
    if (!Object.values(AIProvider).includes(aiProvider)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid AI provider. Must be OPENAI or GEMINI",
      });
    }

    // Get job data
    const job = await prisma.job.findFirst({
      where: { id: jobId, userId },
    });

    if (!job) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Job not found",
      });
    }

    // Get user data with resume content
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    try {
      const result = await EmailsService.generateApplicationEmail({
        jobData: {
          companyName: job.companyName,
          jobTitle: job.jobTitle,
          jobRole: job.jobRole,
          jobDescription: job.jobDescription,
          companyEmail: job.companyEmail,
        },
        userData: {
          name: user.name,
          email: user.email,
          profileBio: user.profileBio || undefined,
          resumeContent: user.resumeContent || undefined,
          skills: user.skills || undefined,
          experience: user.experience || undefined,
          education: user.education || undefined,
          certifications: user.certifications || undefined,
          linkedinLink: user.linkedinLink || undefined,
          portfolioLink: user.portfolioLink || undefined,
        },
        aiProvider: aiProvider as AIProvider,
      });

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Application email generated successfully",
        data: result,
      });
    } catch (error: any) {
      sendResponse(res, {
        statusCode: 500,
        success: false,
        message: error.message,
      });
    }
  },
);

const generateReplyEmail = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { emailId, userPrompt, aiProvider = AIProvider.OPENAI } = req.body;

  // Validate AI provider
  if (!Object.values(AIProvider).includes(aiProvider)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid AI provider. Must be OPENAI or GEMINI",
    });
  }

  // Get original email
  const originalEmail = await EmailsService.getEmailById(userId, emailId);

  if (!originalEmail) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Email not found",
    });
  }

  // Get user data with resume content
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "User not found",
    });
  }

  try {
    const result = await EmailsService.generateReplyEmail({
      originalEmail: {
        subject: originalEmail.subject,
        content: originalEmail.content,
      },
      userPrompt,
      userData: {
        name: user.name,
        resumeContent: user.resumeContent || undefined,
        skills: user.skills || undefined,
      },
      aiProvider: aiProvider as AIProvider,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Reply email generated successfully",
      data: { ...result, jobId: originalEmail.jobId },
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
});

const sendEmail = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { jobId, subject, content, emailType, aiProvider = AIProvider.OPENAI } = req.body;

  // Validate AI provider
  if (!Object.values(AIProvider).includes(aiProvider)) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid AI provider. Must be OPENAI or GEMINI",
    });
  }

  // Get job to get company email
  const job = await prisma.job.findFirst({
    where: { id: jobId, userId },
  });

  if (!job) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Job not found",
    });
  }

  try {
    // Find matching resume for this job role and ensure file exists
    const resume = await ResumesService.getResumeByUserAndRole(
      userId,
      job.jobRole,
    );
    if (!resume) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message:
          "No resume uploaded for this role. Please upload resume first.",
      });
    }

    const { absolutePath } = await ResumesService.getResumeFile(userId, resume.id);

    const result = await EmailsService.sendEmail(
      job.companyEmail,
      subject,
      content,
      userId,
      jobId,
      emailType,
      aiProvider as AIProvider,
      {
        filename: resume.fileName,
        path: absolutePath,
        contentType: "application/pdf",
      },
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Email sent successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
});

const getEmails = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const filters = req.query;

  const result = await EmailsService.getEmails(userId, filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Emails retrieved successfully",
    data: result,
  });
});

const getEmailById = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  const result = await EmailsService.getEmailById(userId, id as string);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Email not found",
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Email retrieved successfully",
    data: result,
  });
});

export const EmailsController = {
  generateApplicationEmail,
  generateReplyEmail,
  sendEmail,
  getEmails,
  getEmailById,
};
