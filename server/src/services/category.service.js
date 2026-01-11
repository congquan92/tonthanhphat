import { prisma } from "../config/db.js";

export const CategoryService = {


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



    // Lấy product categories cho dropdown "Sản Phẩm"
    getNavLinks: async () => {
        // Lấy tất cả categories active (không phân biệt parent/child)
        const categories = await prisma.category.findMany({
            where: { isActive: true },
            orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        });

        // Transform thành format cho dropdown
        return categories.map((cat) => ({
            href: `/san-pham/${cat.slug}`,
            label: cat.name,
        }));
    },
};
