import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { UsersController } from "./users.controller";
import { updateProfileSchema } from "./users.validation";

const router = Router();

router.use(authenticate);

router.get("/profile", UsersController.getProfile);
router.put(
  "/profile",
  validateRequest(updateProfileSchema),
  UsersController.updateProfile,
);

export default router;
