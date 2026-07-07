import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SettingsService } from "./settings.service";

const getSettings = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await SettingsService.getSettings(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Settings retrieved successfully",
    data: result,
  });
});

const updateSettings = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  
  // Filter out any unwanted fields, just take the API keys
  const {
    openaiApiKey,
    geminiApiKey,
    groqApiKey,
    openrouterApiKey,
    cloudinaryCloudName,
    cloudinaryApiKey,
    cloudinaryApiSecret,
    smtpHost,
    smtpPort,
    smtpSecure,
    smtpUser,
    smtpPassword,
  } = req.body;

  const data = {
    openaiApiKey,
    geminiApiKey,
    groqApiKey,
    openrouterApiKey,
    cloudinaryCloudName,
    cloudinaryApiKey,
    cloudinaryApiSecret,
    smtpHost,
    smtpPort,
    smtpSecure,
    smtpUser,
    smtpPassword,
  };

  const result = await SettingsService.updateSettings(userId, data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Settings updated successfully",
    data: result,
  });
});

export const SettingsController = {
  getSettings,
  updateSettings,
};
