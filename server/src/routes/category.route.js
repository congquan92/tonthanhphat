import express from "express";
import { CategoryController } from "../controller/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ==================== PUBLIC  ====================
router.get("/", CategoryController.getAllCategories);
router.get("/root", CategoryController.getRootCategories);
router.get("/:parentId/children", CategoryController.getCategoryChildren);

// ==================== ADMIN ====================
router.get("/admin/all", authMiddleware, CategoryController.getAllCategoriesAdmin);
router.post("/", authMiddleware, CategoryController.createCategory);
router.patch("/order", authMiddleware, CategoryController.updateCategoriesOrder);
router.put("/:id", authMiddleware, CategoryController.updateCategory);
router.patch("/:id/order", authMiddleware, CategoryController.updateCategoryOrder);
router.delete("/:id", authMiddleware, CategoryController.softDeleteCategory);
router.delete("/:id/permanent", authMiddleware, CategoryController.hardDeleteCategory);

export default router;
