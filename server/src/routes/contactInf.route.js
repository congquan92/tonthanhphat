import express from "express";
import { ContactInfoController } from "../controller/contactInf.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/contactInfo", ContactInfoController.getContactInfo);
router.put("/contactInfo", authMiddleware, ContactInfoController.updateContactInfo);

export default router;
