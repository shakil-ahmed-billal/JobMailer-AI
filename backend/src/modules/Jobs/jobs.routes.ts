import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { JobsController } from "./jobs.controller";
import {
  createJobSchema,
  deleteJobSchema,
  getJobSchema,
  getJobsSchema,
  updateJobSchema,
} from "./jobs.validation";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Job stats for dashboard
router.get("/stats", JobsController.getJobStats);

// CRUD operations
router.post("/", validateRequest(createJobSchema), JobsController.createJob);
router.get("/", validateRequest(getJobsSchema), JobsController.getJobs);
router.get("/:id", validateRequest(getJobSchema), JobsController.getJobById);
router.put("/:id", validateRequest(updateJobSchema), JobsController.updateJob);
router.delete(
  "/:id",
  validateRequest(deleteJobSchema),
  JobsController.deleteJob,
);

export default router;
