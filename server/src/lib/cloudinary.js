import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const CloudinaryHelper = {
    /**
     * Upload ảnh lên Cloudinary từ base64 hoặc URL
     * @param {string} file - Base64 string hoặc URL
     * @param {string} folder - Thư mục lưu trữ (vd: "products", "categories")
     * @returns {Promise<{url: string, publicId: string}>}
     */
    uploadImage: async (file, folder = "products") => {
        try {
            const result = await cloudinary.uploader.upload(file, {
                folder: `tonthanhphat/${folder}`,
                resource_type: "image",
                transformation: [
                    { width: 1200, height: 1200, crop: "limit" }, // Giới hạn kích thước max
                    { quality: "auto:good" }, // Tự động optimize
                    { format: "webp" }, // Convert sang WebP
                ],
            });
            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw new Error("Không thể upload ảnh");
        }
    },

    /**
     * Upload nhiều ảnh
     * @param {string[]} files - Array base64 strings hoặc URLs
     * @param {string} folder
     * @returns {Promise<Array<{url: string, publicId: string}>>}
     */
    uploadMultipleImages: async (files, folder = "products") => {
        const uploadPromises = files.map((file) => CloudinaryHelper.uploadImage(file, folder));
        return Promise.all(uploadPromises);
    },

    /**
     * Xóa ảnh khỏi Cloudinary
     * @param {string} publicId
     */
    deleteImage: async (publicId) => {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Cloudinary delete error:", error);
        }
    },

    /**
     * Xóa nhiều ảnh
     * @param {string[]} publicIds
     */
    deleteMultipleImages: async (publicIds) => {
        try {
            await cloudinary.api.delete_resources(publicIds);
        } catch (error) {
            console.error("Cloudinary bulk delete error:", error);
        }
    },
};
