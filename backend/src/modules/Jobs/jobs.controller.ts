import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { JobsService } from "./jobs.service";

const createJob = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await JobsService.createJob(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Job created successfully",
    data: result,
  });
});

const getJobs = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const filters = req.query;
  const result = await JobsService.getJobs(userId, filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Jobs retrieved successfully",
    data: result,
  });
});

const getJobById = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const result = await JobsService.getJobById(userId, id as string);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Job not found",
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job retrieved successfully",
    data: result,
  });
});

const updateJob = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  try {
    const result = await JobsService.updateJob(userId, id  as string, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Job updated successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message,
    });
  }
});

const deleteJob = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  try {
    await JobsService.deleteJob(userId, id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message,
    });
  }
});

const getJobStats = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await JobsService.getJobStats(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Job statistics retrieved successfully",
    data: result,
  });
});

export const JobsController = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobStats,
};
