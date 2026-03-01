import { v2 as cloudinary } from "cloudinary";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string,
  fileName: string,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        public_id: fileName.split(".")[0], // Remove extension for public_id
        access_mode: "public",
        type: "upload",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    uploadStream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

export const fetchFileBuffer = async (publicId: string): Promise<Buffer> => {
  try {
    const metadata = await cloudinary.api.resource(publicId);

    const expiresAt = Math.floor(Date.now() / 1000) + 3600;
    const url = (cloudinary.utils as any).private_download_url(
      publicId,
      metadata.format,
      {
        resource_type: metadata.resource_type || "image",
        type: metadata.type || "upload",
        expires_at: expiresAt,
      },
    );

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch file from Cloudinary: ${response.status}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error: any) {
    throw error;
  }
};

export const CloudinaryUtils = {
  uploadToCloudinary,
  deleteFromCloudinary,
  fetchFileBuffer,
};

export const cloudinaryUpload = cloudinary;
