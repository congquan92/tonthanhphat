import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const BannerService = {
    // ==================== PUBLIC ====================

    /**
     * Lấy tất cả banners active, sorted by order
     */
    getAllBanners: async () => {
        return prisma.banner.findMany({
            where: { isActive: true },
            orderBy: { order: "asc" },
        });
    },

    // ==================== ADMIN ====================

    /**
     * Lấy tất cả banners (bao gồm cả inactive)
     */
    getAllBannersAdmin: async () => {
        return prisma.banner.findMany({
            orderBy: { order: "asc" },
        });
    },

    /**
     * Lấy banner theo ID
     */
    getBannerById: async (id) => {
        return prisma.banner.findUnique({
            where: { id },
        });
    },

    /**
     * Tạo banner mới
     * Validate order unique constraint
     */
    createBanner: async (data) => {
        // Check if order already exists
        const existingBanner = await prisma.banner.findUnique({
            where: { order: data.order },
        });

        if (existingBanner) {
            throw new Error(`Order ${data.order} đã tồn tại`);
        }

        return prisma.banner.create({
            data: {
                imageUrl: data.imageUrl,
                publicId: data.publicId, // Store Cloudinary public ID
                alt: data.alt,
                order: data.order,
                isActive: data.isActive ?? true,
            },
        });
    },

    /**
     * Cập nhật banner
     * Validate order unique nếu thay đổi
     */
    updateBanner: async (id, data) => {
        // Nếu update order, check unique constraint
        if (data.order !== undefined) {
            const existingBanner = await prisma.banner.findUnique({
                where: { order: data.order },
            });

            // Nếu tìm thấy banner khác với order này
            if (existingBanner && existingBanner.id !== id) {
                throw new Error(`Order ${data.order} đã tồn tại`);
            }
        }

        return prisma.banner.update({
            where: { id },
            data: {
                ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
                ...(data.publicId !== undefined && { publicId: data.publicId }),
                ...(data.alt !== undefined && { alt: data.alt }),
                ...(data.order !== undefined && { order: data.order }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
            },
        });
    },

    /**
     * Xóa banner vĩnh viễn (hard delete)
     */
    hardDeleteBanner: async (id) => {
        return prisma.banner.delete({
            where: { id },
        });
    },
};
