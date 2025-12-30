import express from "express";
import { BannerController } from "../controller/banner.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ==================== PUBLIC ====================
router.get("/", BannerController.getAllBanners);

// ==================== ADMIN ====================
router.get("/admin/all", authMiddleware, BannerController.getAllBannersAdmin);
router.get("/admin/:id", authMiddleware, BannerController.getBannerById);
router.post("/", authMiddleware, BannerController.createBanner);
router.put("/:id", authMiddleware, BannerController.updateBanner);
router.delete("/:id", authMiddleware, BannerController.deleteBanner);

// ==================== UPLOAD ====================
router.post("/upload", authMiddleware, BannerController.uploadImage);

export default router;
