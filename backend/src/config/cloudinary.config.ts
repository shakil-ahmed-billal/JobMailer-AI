import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";
import config from "./index";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export const CloudinaryHelper = {
  uploadFile: async (
    fileBuffer: Buffer,
    fileName: string,
  ): Promise<UploadApiResponse> => {
    if (!fileBuffer || !fileName) {
      throw new Error("File buffer and file name are required for upload");
    }

    const extension = fileName.split(".").pop()?.toLowerCase();
    const fileNameWithoutExtension = fileName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const uniqueName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      fileNameWithoutExtension;

    const folderName = extension === "pdf" ? "pdfs" : "images";
    const folder = `job-mailer/${folderName}`;

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: uniqueName,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as UploadApiResponse);
        },
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  },

  deleteFile: async (url: string): Promise<boolean> => {
    try {
      const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
      const match = url.match(regex);

      if (match && match[1]) {
        const publicId = match[1];
        // Note: For deletion, resource_type MUST be specified if not "image"
        // But since we use PDFs as images/documents in Cloudinary, "image" usually works.
        // We'll try "image" first as it's the safest for PDF/images.
        const result = await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
        return result.result === "ok";
      }
      return false;
    } catch (error) {
      console.error("Cloudinary deletion error:", error);
      return false;
    }
  },
};

// Maintain compatibility with existing code during transition
export const uploadFileToCloudinary = CloudinaryHelper.uploadFile;
export const deleteFileFromCloudinary = CloudinaryHelper.deleteFile;
export const cloudinaryInstance = cloudinary;
