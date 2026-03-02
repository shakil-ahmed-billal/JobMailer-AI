import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { TasksController } from "./tasks.controller";
import {
  createTaskSchema,
  deleteTaskSchema,
  getTaskSchema,
  getTasksSchema,
  updateTaskSchema,
} from "./tasks.validation";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Upcoming tasks for dashboard
router.get("/upcoming", TasksController.getUpcomingTasks);

// CRUD operations
router.post("/", validateRequest(createTaskSchema), TasksController.createTask);
router.get("/", validateRequest(getTasksSchema), TasksController.getTasks);
router.get("/:id", validateRequest(getTaskSchema), TasksController.getTaskById);
router.get(
  "/job/:id",
  validateRequest(getTaskSchema),
  TasksController.getTasksByJobId,
);
router.put(
  "/:id",
  validateRequest(updateTaskSchema),
  TasksController.updateTask,
);
router.delete(
  "/:id",
  validateRequest(deleteTaskSchema),
  TasksController.deleteTask,
);

export default router;
