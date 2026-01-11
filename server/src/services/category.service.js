import { prisma } from "../config/db.js";

export const CategoryService = {
    // Lấy tất cả categories (có thể bao gồm children)
    getAllCategories: async (includeChildren = false) => {
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

    // Tạo category mới
    createCategory: async (data) => {
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
    updateCategory: async (id, data) => {
        return await prisma.category.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.slug !== undefined && { slug: data.slug }),
                ...(data.description !== undefined && { description: data.description }),
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
    softDeleteCategory: async (id) => {
        return await prisma.category.update({
            where: { id },
            data: { isActive: false },
        });
    },

    // Xóa cứng (hard delete) - xóa hoàn toàn
    hardDeleteCategory: async (id) => {
        return await prisma.category.delete({
            where: { id },
        });
    },

    // Cập nhật thứ tự nhiều categories cùng lúc
    updateCategoriesOrder: async (categories) => {
        const updatePromises = categories.map((cat) =>
            prisma.category.update({
                where: { id: cat.id },
                data: { order: cat.order },
            })
        );
        return await prisma.$transaction(updatePromises);
    },

    // Lấy navLinks format sẵn cho navbar
    getNavLinks: async () => {
        // Lấy tất cả root categories với children
        const rootCategories = await prisma.category.findMany({
            where: { isActive: true, parentId: null },
            orderBy: [{ order: "asc" }],
            include: {
                children: {
                    where: { isActive: true },
                    orderBy: [{ order: "asc" }],
                },
            },
        });

        // Transform thành navLinks format
        const navLinks = rootCategories.map((cat) => {
            const baseLink = {
                href: `/${cat.slug}`,
                label: cat.name,
            };

            // Nếu có children thì thêm submenu
            if (cat.children && cat.children.length > 0) {
                return {
                    ...baseLink,
                    submenu: cat.children.map((child) => ({
                        href: `/${cat.slug}/${child.slug}`,
                        label: child.name,
                    })),
                };
            }

            return baseLink;
        });

        return navLinks;
    },
};
