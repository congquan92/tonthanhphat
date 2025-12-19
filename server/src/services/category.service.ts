import { prisma } from "../config/db.js";

interface CreateCategoryInput {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    order?: number;
    isActive?: boolean;
}

interface UpdateCategoryInput {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: string | null;
    order?: number;
    isActive?: boolean;
}

export const CategoryService = {
    // Lấy tất cả categories (có thể bao gồm children)
    getAllCategories: async (includeChildren: boolean = false) => {
        return await prisma.category.findMany({
            where: { isActive: true },
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
            include: includeChildren
                ? {
                      children: {
                          where: { isActive: true },
                          orderBy: [{ order: "asc" }, { createdAt: "desc" }],
                      },
                  }
                : undefined,
        });
    },

    // Lấy tất cả categories (bao gồm cả inactive) - cho admin
    getAllCategoriesAdmin: async () => {
        return await prisma.category.findMany({
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
            include: {
                parent: true,
                children: {
                    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
                },
            },
        });
    },

    // Lấy các category gốc (không có parentId)
    getRootCategories: async () => {
        return await prisma.category.findMany({
            where: {
                isActive: true,
                parentId: null,
            },
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
            include: {
                children: {
                    where: { isActive: true },
                    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
                },
            },
        });
    },

    // Tạo category mới
    createCategory: async (data: CreateCategoryInput) => {
        return await prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                parentId: data.parentId,
                order: data.order ?? 0,
                isActive: data.isActive ?? true,
            },
            include: {
                parent: true,
            },
        });
    },

    // Cập nhật category
    updateCategory: async (id: string, data: UpdateCategoryInput) => {
        return await prisma.category.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.slug !== undefined && { slug: data.slug }),
                ...(data.description !== undefined && {
                    description: data.description,
                }),
                ...(data.parentId !== undefined && { parentId: data.parentId }),
                ...(data.order !== undefined && { order: data.order }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
            },
            include: {
                parent: true,
                children: true,
            },
        });
    },

    // Xóa mềm (soft delete) - đặt isActive = false
    softDeleteCategory: async (id: string) => {
        return await prisma.category.update({
            where: { id },
            data: { isActive: false },
        });
    },

    // Xóa cứng (hard delete) - xóa hoàn toàn
    hardDeleteCategory: async (id: string) => {
        return await prisma.category.delete({
            where: { id },
        });
    },

    // Cập nhật thứ tự của category
    updateCategoryOrder: async (id: string, order: number) => {
        return await prisma.category.update({
            where: { id },
            data: { order },
        });
    },

    // Cập nhật thứ tự nhiều categories cùng lúc
    updateCategoriesOrder: async (
        categories: { id: string; order: number }[]
    ) => {
        const updatePromises = categories.map((cat) =>
            prisma.category.update({
                where: { id: cat.id },
                data: { order: cat.order },
            })
        );
        return await prisma.$transaction(updatePromises);
    },

    // Lấy children của một category
    getCategoryChildren: async (parentId: string) => {
        return await prisma.category.findMany({
            where: {
                parentId,
                isActive: true,
            },
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        });
    },
};
