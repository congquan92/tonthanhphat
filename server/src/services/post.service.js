import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const PostService = {
    // ==================== PUBLIC ====================

    // Lấy tất cả bài viết (public - chỉ published)
    getAllPosts: async (page = 1, pageSize = 20) => {
        const where = { isPublished: true };

        // Calculate skip for pagination
        const skip = (page - 1) * pageSize;
        const total = await prisma.post.count({ where });
        const posts = await prisma.post.findMany({
            where,
            orderBy: { publishedAt: "desc" },
            skip,
            take: pageSize,
        });

        return {
            posts,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    },

    // Lấy bài viết nổi bật
    getFeaturedPosts: async (limit = 6) => {
        return prisma.post.findMany({
            where: { isPublished: true, isFeatured: true },
            orderBy: { publishedAt: "desc" },
            take: limit,
        });
    },

    // Lấy chi tiết bài viết theo slug
    getPostBySlug: async (slug) => {
        return prisma.post.findUnique({
            where: { slug, isPublished: true },
        });
    },

    // ==================== ADMIN ====================

    // Lấy tất cả bài viết (admin - bao gồm cả draft)
    getAllPostsAdmin: async (page = 1, pageSize = 20, search = null, filterStatus = null) => {
        const where = {};

        // Search filter
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { slug: { contains: search, mode: "insensitive" } },
                { author: { contains: search, mode: "insensitive" } },
            ];
        }

        // Status filter
        if (filterStatus === "published") {
            where.isPublished = true;
        } else if (filterStatus === "draft") {
            where.isPublished = false;
        }

        // Calculate skip for pagination
        const skip = (page - 1) * pageSize;
        const total = await prisma.post.count({ where });

        const posts = await prisma.post.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
        });

        return {
            posts,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.ceil(total / pageSize),
            },
        };
    },

    // Lấy bài viết theo ID
    getPostById: async (id) => {
        return prisma.post.findUnique({
            where: { id },
        });
    },

    // Tạo bài viết mới
    createPost: async (data) => {
        return prisma.post.create({
            data: {
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt,
                content: data.content,
                thumbnail: data.thumbnail,
                imagePublicId: data.imagePublicId,
                author: data.author,
                isPublished: data.isPublished ?? false,
                isFeatured: data.isFeatured ?? false,
                publishedAt: data.isPublished ? new Date() : null,
            },
        });
    },

    // Cập nhật bài viết
    updatePost: async (id, data) => {
        const updateData = {
            ...(data.title && { title: data.title }),
            ...(data.slug && { slug: data.slug }),
            ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
            ...(data.content !== undefined && { content: data.content }),
            ...(data.thumbnail !== undefined && { thumbnail: data.thumbnail }),
            ...(data.imagePublicId !== undefined && { imagePublicId: data.imagePublicId }),
            ...(data.author !== undefined && { author: data.author }),
            ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        };

        // Handle publish status change
        if (data.isPublished !== undefined) {
            updateData.isPublished = data.isPublished;
            // Set publishedAt when first published
            if (data.isPublished) {
                const existingPost = await prisma.post.findUnique({ where: { id } });
                if (!existingPost?.publishedAt) {
                    updateData.publishedAt = new Date();
                }
            }
        }

        return prisma.post.update({
            where: { id },
            data: updateData,
        });
    },

    // Xóa bài viết (soft delete)
    softDeletePost: async (id) => {
        return prisma.post.update({
            where: { id },
            data: { isPublished: false },
        });
    },

    // Xóa bài viết vĩnh viễn
    hardDeletePost: async (id) => {
        return prisma.post.delete({
            where: { id },
        });
    },
};
