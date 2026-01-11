import { CategoryService } from "../services/category.service.js";

export const CategoryController = {
    // ==================== PUBLIC ====================
    // Lấy tất cả categories
    getAllCategories: async (req, res) => {
        try {
            const includeChildren = req.query.includeChildren === "true";
            const categories = await CategoryService.getAllCategories(includeChildren);
            return res.json({ success: true, data: categories });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // Lấy navLinks format sẵn cho navbar
    getNavLinks: async (req, res) => {
        try {
            const navLinks = await CategoryService.getNavLinks();
            return res.json({ success: true, data: navLinks });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // ==================== ADMIN ====================

    // Lấy tất cả categories cho admin (bao gồm inactive)
    getAllCategoriesAdmin: async (req, res) => {
        try {
            const categories = await CategoryService.getAllCategoriesAdmin();
            return res.json({ success: true, data: categories });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // Tạo category mới
    createCategory: async (req, res) => {
        try {
            const { name, slug, description, parentId, order, isActive } = req.body;

            if (!name || !slug) {
                return res.status(400).json({
                    success: false,
                    message: "name và slug là bắt buộc",
                });
            }

            const category = await CategoryService.createCategory({
                name,
                slug,
                description,
                parentId,
                order,
                isActive,
            });

            return res.status(201).json({
                success: true,
                message: "Tạo danh mục thành công",
                data: category,
            });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            if (error.code === "P2002") {
                return res.status(400).json({
                    success: false,
                    message: "Slug đã tồn tại, vui lòng chọn slug khác",
                });
            }
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // Cập nhật category
    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, slug, description, parentId, order, isActive } = req.body;

            if (!id) {
                return res.status(400).json({ success: false, message: "id là bắt buộc" });
            }

            const category = await CategoryService.updateCategory(id, {
                name,
                slug,
                description,
                parentId,
                order,
                isActive,
            });

            return res.json({
                success: true,
                message: "Cập nhật danh mục thành công",
                data: category,
            });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            if (error.code === "P2002") {
                return res.status(400).json({
                    success: false,
                    message: "Slug đã tồn tại, vui lòng chọn slug khác",
                });
            }
            if (error.code === "P2025") {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy danh mục",
                });
            }
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // Xóa mềm category
    softDeleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ success: false, message: "id là bắt buộc" });
            }

            await CategoryService.softDeleteCategory(id);
            return res.json({
                success: true,
                message: "Xóa danh mục thành công",
            });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            if (error.code === "P2025") {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy danh mục",
                });
            }
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // Xóa cứng category (xóa hoàn toàn)
    hardDeleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ success: false, message: "id là bắt buộc" });
            }

            await CategoryService.hardDeleteCategory(id);
            return res.json({
                success: true,
                message: "Xóa vĩnh viễn danh mục thành công",
            });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            if (error.code === "P2025") {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy danh mục",
                });
            }
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // Cập nhật thứ tự nhiều categories
    updateCategoriesOrder: async (req, res) => {
        try {
            const { categories } = req.body;

            if (!categories || !Array.isArray(categories)) {
                return res.status(400).json({
                    success: false,
                    message: "categories phải là một mảng",
                });
            }

            await CategoryService.updateCategoriesOrder(categories);
            return res.json({
                success: true,
                message: "Cập nhật thứ tự các danh mục thành công",
            });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },
};
