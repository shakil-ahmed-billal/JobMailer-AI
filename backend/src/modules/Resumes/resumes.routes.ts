import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { ResumesController } from "./resumes.controller";
import { resumeIdSchema } from "./resumes.validation";

const router = Router();

router.use(authenticate);

router.get("/", ResumesController.getResumes);
router.post("/", multerUpload.single("file"), ResumesController.createResume);
router.put("/:id", multerUpload.single("file"), ResumesController.updateResume);
router.delete(
  "/:id",
  validateRequest(resumeIdSchema),
  ResumesController.deleteResume,
);
router.get(
  "/:id/file",
  validateRequest(resumeIdSchema),
  ResumesController.downloadResumeFile,
);

export default router;
