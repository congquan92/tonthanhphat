import { BannerService } from "../services/banner.service.js";
import { CloudinaryHelper } from "../lib/cloudinary.js";

export const BannerController = {
    // ==================== PUBLIC ====================

    getAllBanners: async (req, res) => {
        try {
            const banners = await BannerService.getAllBanners();
            return res.json({ success: true, data: banners });
        } catch (error) {
            console.error("getAllBanners error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // ==================== ADMIN ====================

    getAllBannersAdmin: async (req, res) => {
        try {
            const banners = await BannerService.getAllBannersAdmin();
            return res.json({ success: true, data: banners });
        } catch (error) {
            console.error("getAllBannersAdmin error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    getBannerById: async (req, res) => {
        try {
            const { id } = req.params;
            const banner = await BannerService.getBannerById(id);

            if (!banner) {
                return res.status(404).json({ success: false, message: "Không tìm thấy banner" });
            }

            return res.json({ success: true, data: banner });
        } catch (error) {
            console.error("getBannerById error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    createBanner: async (req, res) => {
        try {
            const banner = await BannerService.createBanner(req.body);
            return res.status(201).json({ success: true, data: banner, message: "Tạo banner thành công" });
        } catch (error) {
            console.error("createBanner error:", error);
            if (req.body.publicId) {
                try {
                    await CloudinaryHelper.deleteImage(req.body.publicId);
                    console.log("Cleaned up uploaded image:", req.body.publicId);
                } catch (cleanupError) {
                    console.error("Cloudinary cleanup error:", cleanupError);
                    // Don't throw - we already failed to create banner
                }
            }

            if (error.message.includes("đã tồn tại")) {
                return res.status(400).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    updateBanner: async (req, res) => {
        try {
            const { id } = req.params;
            const banner = await BannerService.updateBanner(id, req.body);
            return res.json({ success: true, data: banner, message: "Cập nhật banner thành công" });
        } catch (error) {
            console.error("updateBanner error:", error);
            if (error.message.includes("đã tồn tại")) {
                return res.status(400).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    deleteBanner: async (req, res) => {
        try {
            const { id } = req.params;
            // Get banner to extract publicId
            const banner = await BannerService.getBannerById(id);
            if (!banner) {
                return res.status(404).json({ success: false, message: "Không tìm thấy banner" });
            }

            // Delete image from Cloudinary if publicId exists
            if (banner.publicId) {
                try {
                    await CloudinaryHelper.deleteImage(banner.publicId);
                    console.log("Deleted image from Cloudinary:", banner.publicId);
                } catch (cloudinaryError) {
                    console.error("Cloudinary delete error:", cloudinaryError);
                    // Continue with database deletion even if Cloudinary delete fails
                }
            }

            // Delete banner from database
            await BannerService.hardDeleteBanner(id);
            return res.json({ success: true, message: "Xóa banner thành công" });
        } catch (error) {
            console.error("deleteBanner error:", error);
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

            const result = await CloudinaryHelper.uploadImage(image, folder || "banners");
            return res.json({ success: true, data: result });
        } catch (error) {
            console.error("uploadImage error:", error);
            return res.status(500).json({ success: false, message: "Upload ảnh thất bại" });
        }
    },
};
