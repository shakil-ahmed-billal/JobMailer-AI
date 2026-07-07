import express from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { SettingsController } from "./settings.controller";

const router = express.Router();

router.get("/", authenticate, SettingsController.getSettings);
router.put("/", authenticate, SettingsController.updateSettings);

export const SettingsRoutes = router;
