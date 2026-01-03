import express from "express";
import { ContactInfoController } from "../controller/contactInf.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
// ==================== PUBLIC ====================
router.get("/contactInfo", ContactInfoController.getContactInfo);

// ==================== ADMIN ====================
router.put("/contactInfo", authMiddleware, ContactInfoController.updateContactInfo);

export default router;
