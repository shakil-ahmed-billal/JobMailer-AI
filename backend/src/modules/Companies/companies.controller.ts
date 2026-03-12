import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { TopCompaniesService } from "./companies.service";

const createCompany = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await TopCompaniesService.createCompany(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Top Company created successfully",
    data: result,
  });
});

const getCompanies = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await TopCompaniesService.getCompanies(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Top Companies retrieved successfully",
    data: result,
  });
});

const getCompanyById = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const result = await TopCompaniesService.getCompanyById(userId, id as string);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Top Company not found",
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Top Company retrieved successfully",
    data: result,
  });
});

const updateCompany = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  try {
    const result = await TopCompaniesService.updateCompany(userId, id as string, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Top Company updated successfully",
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

const deleteCompany = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;

  try {
    await TopCompaniesService.deleteCompany(userId, id as string);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Top Company deleted successfully",
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 404,
      success: false,
      message: error.message,
    });
  }
});

export const TopCompaniesController = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
