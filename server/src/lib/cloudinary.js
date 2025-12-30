import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const CloudinaryHelper = {
    uploadImage: async (file, folder = "products") => {
        try {
            // Determine transformation based on folder
            const isBanner = folder === "banners";

            const transformation = isBanner
                ? [
                      // Banners need high resolution for desktop displays
                      { width: 2560, height: 1440, crop: "limit" }, // Support up to 2K displays
                      { quality: "auto:best" }, // Best quality for banners
                      { format: "webp" }, // Still use WebP for optimization
                  ]
                : [
                      // Products can use smaller size
                      { width: 1200, height: 1200, crop: "limit" },
                      { quality: "auto:good" },
                      { format: "webp" },
                  ];

            const result = await cloudinary.uploader.upload(file, {
                folder: `tonthanhphat/${folder}`,
                resource_type: "image",
                transformation,
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

    uploadMultipleImages: async (files, folder = "products") => {
        const uploadPromises = files.map((file) => CloudinaryHelper.uploadImage(file, folder));
        return Promise.all(uploadPromises);
    },

    deleteImage: async (publicId) => {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error("Cloudinary delete error:", error);
        }
    },

    deleteMultipleImages: async (publicIds) => {
        try {
            await cloudinary.api.delete_resources(publicIds);
        } catch (error) {
            console.error("Cloudinary bulk delete error:", error);
        }
    },
};
