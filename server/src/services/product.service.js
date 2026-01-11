import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ProductService = {
    // ==================== PUBLIC ====================

    //Lấy tất cả sản phẩm (public)
    getAllProducts: async (categorySlug = null, page = 1, pageSize = 20) => {
        const where = { isActive: true };

        if (categorySlug) {
            where.category = { slug: categorySlug };
        }

        // Calculate skip for pagination
        const skip = (page - 1) * pageSize;
        const total = await prisma.product.count({ where });
        const products = await prisma.product.findMany({
            where,
            include: {
                category: {
                    select: { id: true, name: true, slug: true },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
        });

        return {
            products,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    },

    // Lấy sản phẩm nổi bật
    getFeaturedProducts: async (limit = 8) => {
        return prisma.product.findMany({
            where: { isActive: true, isFeatured: true },
            include: {
                category: {
                    select: { id: true, name: true, slug: true },
                },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    },

    // Lấy chi tiết sản phẩm theo slug
    getProductBySlug: async (slug) => {
        return prisma.product.findUnique({
            where: { slug },
            include: {
                category: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });
    },

    // Lấy sản phẩm liên quan
    getRelatedProducts: async (productId, categoryId, limit = 4) => {
        return prisma.product.findMany({
            where: {
                isActive: true,
                categoryId,
                id: { not: productId },
            },
            take: limit,
            orderBy: { createdAt: "desc" },
        });
    },

    // ==================== ADMIN ====================

    //Lấy tất cả sản phẩm (admin - bao gồm cả inactive)
    getAllProductsAdmin: async (page = 1, pageSize = 20, search = null, categoryId = null) => {
        const where = {};

        // Search filter
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
            ];
        }

        // Category filter
        if (categoryId) {
            where.categoryId = categoryId;
        }

        // Calculate skip for pagination
        const skip = (page - 1) * pageSize;
        const total = await prisma.product.count({ where });
        
        const products = await prisma.product.findMany({
            where,
            include: {
                category: {
                    select: { id: true, name: true, slug: true },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
        });

        return {
            products,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    },

    // Lấy sản phẩm theo ID
    getProductById: async (id) => {
        return prisma.product.findUnique({
            where: { id },
            include: {
                category: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });
    },

    // Tạo sản phẩm mới
    createProduct: async (data) => {
        return prisma.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                shortDesc: data.shortDesc,
                description: data.description,
                thumbnail: data.thumbnail,
                images: data.images,
                imagePublicIds: data.imagePublicIds, // Store Cloudinary public IDs
                specs: data.specs,
                categoryId: data.categoryId,
                isActive: data.isActive ?? true,
                isFeatured: data.isFeatured ?? false,
            },
            include: {
                category: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });
    },

    // Cập nhật sản phẩm
    updateProduct: async (id, data) => {
        return prisma.product.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.slug && { slug: data.slug }),
                ...(data.shortDesc !== undefined && { shortDesc: data.shortDesc }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
                ...(data.images !== undefined && { images: data.images }),
                ...(data.imagePublicIds !== undefined && { imagePublicIds: data.imagePublicIds }), // Update public IDs
                ...(data.specs !== undefined && { specs: data.specs }),
                ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
                ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
            },
            include: {
                category: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });
    },

    //  Xóa sản phẩm (soft delete)
    softDeleteProduct: async (id) => {
        return prisma.product.update({
            where: { id },
            data: { isActive: false },
        });
    },

    //Xóa sản phẩm vĩnh viễn
    hardDeleteProduct: async (id) => {
        return prisma.product.delete({
            where: { id },
        });
    },
};
