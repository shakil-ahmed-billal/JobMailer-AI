import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TasksService } from "./tasks.service";

const createTask = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const result = await TasksService.createTask(userId, req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Task created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 400,
      success: false,
      message: error.message,
    });
  }
});

const getTasks = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const filters = req.query;
  const result = await TasksService.getTasks(userId, filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tasks retrieved successfully",
    data: result,
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const result = await TasksService.getTaskById(userId, id as string);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Task not found",
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task retrieved successfully",
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  try {
    const result = await TasksService.updateTask(userId, id as string, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Task updated successfully",
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

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  try {
    await TasksService.deleteTask(userId, id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message,
    });
  }
});

const getUpcomingTasks = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await TasksService.getUpcomingTasks(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Upcoming tasks retrieved successfully",
    data: result,
  });
});

export const TasksController = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getUpcomingTasks,
};
