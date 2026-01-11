import { axiosInstance } from "@/lib/axios";
import { CreateCategoryInput, UpdateCategoryInput, Category } from "@/api/type";

export type { Category, CreateCategoryInput, UpdateCategoryInput };

export const CategoryApi = {
    // ==================== PUBLIC ====================

    // Lấy category format sẵn cho navbar
    getNavLinks: async () => {
        const res = await axiosInstance.get("/categories/navlinks");
        return res.data;
    },

    // ==================== ADMIN ====================
    // Lấy tất cả categories cho admin
    getAllCategoriesAdmin: async () => {
        const res = await axiosInstance.get("/categories/admin/all");
        return res.data;
    },

    // Tạo category mới
    createCategory: async (data: CreateCategoryInput) => {
        const res = await axiosInstance.post("/categories", data);
        return res.data;
    },

    // Cập nhật category
    updateCategory: async (id: string, data: UpdateCategoryInput) => {
        const res = await axiosInstance.put(`/categories/${id}`, data);
        return res.data;
    },

    // Cập nhật thứ tự nhiều categories
    updateCategoriesOrder: async (categories: { id: string; order: number }[]) => {
        const res = await axiosInstance.patch("/categories/order", { categories });
        return res.data;
    },

    // Xóa mềm category
    softDeleteCategory: async (id: string) => {
        const res = await axiosInstance.delete(`/categories/${id}`);
        return res.data;
    },

    // Xóa cứng category
    hardDeleteCategory: async (id: string) => {
        const res = await axiosInstance.delete(`/categories/${id}/permanent`);
        return res.data;
    },
};
