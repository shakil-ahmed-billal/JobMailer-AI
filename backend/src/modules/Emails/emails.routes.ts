import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { EmailsController } from "./emails.controller";
import {
  generateApplicationEmailSchema,
  generateReplyEmailSchema,
  getEmailSchema,
  getEmailsSchema,
  sendEmailSchema,
} from "./emails.validation";

const router = Router();

// All routes require authentication
router.use(authenticate);

// Email generation
router.post(
  "/generate-application",
  validateRequest(generateApplicationEmailSchema),
  EmailsController.generateApplicationEmail,
);

router.post(
  "/generate-reply",
  validateRequest(generateReplyEmailSchema),
  EmailsController.generateReplyEmail,
);

// Send email
router.post(
  "/send",
  validateRequest(sendEmailSchema),
  EmailsController.sendEmail,
);

// Get emails
router.get("/", validateRequest(getEmailsSchema), EmailsController.getEmails);
router.get(
  "/:id",
  validateRequest(getEmailSchema),
  EmailsController.getEmailById,
);

export default router;
