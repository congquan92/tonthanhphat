import express from "express";
import { ProductController } from "../controller/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ==================== PUBLIC ====================
router.get("/", ProductController.getAllProducts);
router.get("/featured", ProductController.getFeaturedProducts);
router.get("/:slug", ProductController.getProductBySlug);

// ==================== ADMIN ====================
router.get("/admin/all", authMiddleware, ProductController.getAllProductsAdmin);
router.get("/admin/:id", authMiddleware, ProductController.getProductById);
router.post("/", authMiddleware, ProductController.createProduct);
router.put("/:id", authMiddleware, ProductController.updateProduct);
router.delete("/:id", authMiddleware, ProductController.deleteProduct);
router.delete("/:id/permanent", authMiddleware, ProductController.hardDeleteProduct);

// ==================== UPLOAD ====================
router.post("/upload", authMiddleware, ProductController.uploadImage);
router.post("/upload/multiple", authMiddleware, ProductController.uploadMultipleImages);

export default router;
