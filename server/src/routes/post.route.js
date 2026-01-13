import express from "express";
import { PostController } from "../controller/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ==================== PUBLIC ====================
router.get("/", PostController.getAllPosts);
router.get("/featured", PostController.getFeaturedPosts);
router.get("/:slug", PostController.getPostBySlug);

// ==================== ADMIN ====================
router.get("/admin/all", authMiddleware, PostController.getAllPostsAdmin);
router.get("/admin/:id", authMiddleware, PostController.getPostById);
router.post("/", authMiddleware, PostController.createPost);
router.put("/:id", authMiddleware, PostController.updatePost);
router.delete("/:id", authMiddleware, PostController.deletePost);
router.delete("/:id/permanent", authMiddleware, PostController.hardDeletePost);

// ==================== UPLOAD ====================
router.post("/upload", authMiddleware, PostController.uploadImage);
router.delete("/upload/:publicId", authMiddleware, PostController.deleteImage);

export default router;
