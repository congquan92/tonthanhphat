import express from "express";
import { CategoryController } from "../controller/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ==================== PUBLIC  ====================
router.get("/navlinks", CategoryController.getNavLinks);

// ==================== ADMIN ====================
router.get("/admin/all", authMiddleware, CategoryController.getAllCategoriesAdmin);
router.post("/", authMiddleware, CategoryController.createCategory);
router.put("/:id", authMiddleware, CategoryController.updateCategory);
router.delete("/:id", authMiddleware, CategoryController.softDeleteCategory);
router.delete("/:id/permanent", authMiddleware, CategoryController.hardDeleteCategory);

export default router;
