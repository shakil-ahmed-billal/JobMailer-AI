import { Router } from "express";
import emailsRoutes from "../modules/Emails/emails.routes";
import jobsRoutes from "../modules/Jobs/jobs.routes";
import tasksRoutes from "../modules/Tasks/tasks.route";

const router = Router();

// API routes
router.use("/jobs", jobsRoutes);
router.use("/emails", emailsRoutes);
router.use("/tasks", tasksRoutes);

export default router;
