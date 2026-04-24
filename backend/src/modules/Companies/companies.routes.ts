import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { TopCompaniesController } from "./companies.controller";
import { TopCompanyValidation } from "./companies.validation";

const router = Router();

// All routes require authentication
router.use(authenticate);

// CRUD operations
router.post("/", validateRequest(TopCompanyValidation.createCompanySchema), TopCompaniesController.createCompany);
router.get("/", TopCompaniesController.getCompanies);
router.get("/:id", TopCompaniesController.getCompanyById);
router.patch("/:id", validateRequest(TopCompanyValidation.updateCompanySchema), TopCompaniesController.updateCompany);
router.delete("/:id", TopCompaniesController.deleteCompany);

export default router;
