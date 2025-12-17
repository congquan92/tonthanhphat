import express from "express";
import { AuthController } from "../controller/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/change-password", authMiddleware, AuthController.changePassword);
router.post("/logout", AuthController.logout);

export default router;
