import { PostService } from "../services/post.service.js";
import { CloudinaryHelper } from "../lib/cloudinary.js";

export const PostController = {
    // ==================== PUBLIC ====================
    getAllPosts: async (req, res) => {
        try {
            const { page, pageSize } = req.query;
            const result = await PostService.getAllPosts(page ? parseInt(page) : 1, pageSize ? parseInt(pageSize) : 20);
            return res.json({ success: true, data: result.posts, pagination: result.pagination });
        } catch (error) {
            console.error("getAllPosts error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    getFeaturedPosts: async (req, res) => {
        try {
            const { limit } = req.query;
            const posts = await PostService.getFeaturedPosts(limit ? parseInt(limit) : 6);
            return res.json({ success: true, data: posts });
        } catch (error) {
            console.error("getFeaturedPosts error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    getPostBySlug: async (req, res) => {
        try {
            const { slug } = req.params;
            const post = await PostService.getPostBySlug(slug);

            if (!post) {
                return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
            }

            return res.json({ success: true, data: post });
        } catch (error) {
            console.error("getPostBySlug error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // ==================== ADMIN ====================

    getAllPostsAdmin: async (req, res) => {
        try {
            const { page, pageSize, search, status } = req.query;
            const result = await PostService.getAllPostsAdmin(page ? parseInt(page) : 1, pageSize ? parseInt(pageSize) : 20, search || null, status || null);
            return res.json({ success: true, data: result.posts, pagination: result.pagination });
        } catch (error) {
            console.error("getAllPostsAdmin error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    getPostById: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await PostService.getPostById(id);

            if (!post) {
                return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
            }

            return res.json({ success: true, data: post });
        } catch (error) {
            console.error("getPostById error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    createPost: async (req, res) => {
        try {
            const post = await PostService.createPost(req.body);
            return res.status(201).json({ success: true, data: post, message: "Tạo bài viết thành công" });
        } catch (error) {
            console.error("createPost error:", error);

            // Cleanup uploaded image on error
            if (req.body.imagePublicId) {
                console.log("Cleaning up uploaded image due to error...");
                try {
                    await CloudinaryHelper.deleteImage(req.body.imagePublicId);
                    console.log("Deleted image:", req.body.imagePublicId);
                } catch (cleanupError) {
                    console.error("Cloudinary cleanup error:", cleanupError);
                }
            }

            if (error.code === "P2002") {
                return res.status(400).json({ success: false, message: "Slug đã tồn tại" });
            }
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    updatePost: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await PostService.updatePost(id, req.body);
            return res.json({ success: true, data: post, message: "Cập nhật bài viết thành công" });
        } catch (error) {
            console.error("updatePost error:", error);
            if (error.code === "P2002") {
                return res.status(400).json({ success: false, message: "Slug đã tồn tại" });
            }
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    deletePost: async (req, res) => {
        try {
            const { id } = req.params;
            await PostService.softDeletePost(id);
            return res.json({ success: true, message: "Đã ẩn bài viết" });
        } catch (error) {
            console.error("deletePost error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    hardDeletePost: async (req, res) => {
        try {
            const { id } = req.params;
            const post = await PostService.getPostById(id);
            if (post?.imagePublicId) {
                console.log("Deleting post image from Cloudinary...");
                try {
                    await CloudinaryHelper.deleteImage(post.imagePublicId);
                    console.log("Deleted image:", post.imagePublicId);
                } catch (cloudinaryError) {
                    console.error("Cloudinary delete error:", cloudinaryError);
                    // Continue with database deletion even if Cloudinary delete fails
                }
            }

            await PostService.hardDeletePost(id);
            return res.json({ success: true, message: "Xóa vĩnh viễn bài viết thành công" });
        } catch (error) {
            console.error("hardDeletePost error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // ==================== UPLOAD ====================

    uploadImage: async (req, res) => {
        try {
            const { image, folder } = req.body;

            if (!image) {
                return res.status(400).json({ success: false, message: "Thiếu dữ liệu ảnh" });
            }

            const result = await CloudinaryHelper.uploadImage(image, folder || "posts");
            return res.json({ success: true, data: result });
        } catch (error) {
            console.error("uploadImage error:", error);
            return res.status(500).json({ success: false, message: "Upload ảnh thất bại" });
        }
    },

    deleteImage: async (req, res) => {
        try {
            const { publicId } = req.params;

            if (!publicId) {
                return res.status(400).json({ success: false, message: "Thiếu publicId" });
            }

            await CloudinaryHelper.deleteImage(publicId);
            return res.json({ success: true, message: "Xóa ảnh thành công" });
        } catch (error) {
            console.error("deleteImage error:", error);
            return res.status(500).json({ success: false, message: "Xóa ảnh thất bại" });
        }
    },
};
