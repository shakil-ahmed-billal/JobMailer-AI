import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "../utils/cloudinary";
import { prisma } from "../lib/prisma";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req: any, file: any) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();

    const fileNameWithoutExtension = originalName
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

    const folder = extension === "pdf" ? "pdfs" : "images";

    const userId = req.user?.id;
    let cloud_name, api_key, api_secret;

    if (userId) {
      const settings = await prisma.userSettings.findUnique({ where: { userId } });
      if (settings?.cloudinaryCloudName && settings?.cloudinaryApiKey && settings?.cloudinaryApiSecret) {
        cloud_name = settings.cloudinaryCloudName;
        api_key = settings.cloudinaryApiKey;
        api_secret = settings.cloudinaryApiSecret;
      }
    }

    return {
      folder: `job-mailer/${folder}`,
      public_id: uniqueName,
      resource_type: "auto",
      access_mode: "public",
      ...(cloud_name && { cloud_name }),
      ...(api_key && { api_key }),
      ...(api_secret && { api_secret }),
    };
  },
});

export const multerUpload = multer({ storage });
