import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { ResumesController } from "./resumes.controller";
import { resumeIdSchema } from "./resumes.validation";

const router = Router();

router.use(authenticate);

router.get("/", ResumesController.getResumes);
router.post("/", ...(ResumesController.createResume as any));
router.put("/:id", ...(ResumesController.updateResume as any));
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

