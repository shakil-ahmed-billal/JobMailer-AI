import { Router } from "express";
import emailsRoutes from "../modules/Emails/emails.routes";
import jobsRoutes from "../modules/Jobs/jobs.routes";
import resumesRoutes from "../modules/Resumes/resumes.routes";
import tasksRoutes from "../modules/Tasks/tasks.route";
import usersRoutes from "../modules/Users/users.routes";

const router = Router();

// API routes
router.use("/jobs", jobsRoutes);
router.use("/emails", emailsRoutes);
router.use("/tasks", tasksRoutes);
router.use("/resumes", resumesRoutes);
router.use("/users", usersRoutes);

export default router;
