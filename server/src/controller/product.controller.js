import { ProductService } from "../services/product.service.js";
import { CloudinaryHelper } from "../lib/cloudinary.js";

export const ProductController = {
    // ==================== PUBLIC ====================

    getAllProducts: async (req, res) => {
        try {
            const { category, limit } = req.query;
            const products = await ProductService.getAllProducts(
                category || null,
                limit ? parseInt(limit) : null
            );
            return res.json({ success: true, data: products });
        } catch (error) {
            console.error("getAllProducts error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    getFeaturedProducts: async (req, res) => {
        try {
            const { limit } = req.query;
            const products = await ProductService.getFeaturedProducts(
                limit ? parseInt(limit) : 8
            );
            return res.json({ success: true, data: products });
        } catch (error) {
            console.error("getFeaturedProducts error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    getProductBySlug: async (req, res) => {
        try {
            const { slug } = req.params;
            const product = await ProductService.getProductBySlug(slug);
            
            if (!product) {
                return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
            }

            // Lấy sản phẩm liên quan
            const relatedProducts = await ProductService.getRelatedProducts(
                product.id,
                product.categoryId,
                4
            );

            return res.json({ 
                success: true, 
                data: { ...product, relatedProducts } 
            });
        } catch (error) {
            console.error("getProductBySlug error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // ==================== ADMIN ====================

    getAllProductsAdmin: async (req, res) => {
        try {
            const products = await ProductService.getAllProductsAdmin();
            return res.json({ success: true, data: products });
        } catch (error) {
            console.error("getAllProductsAdmin error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await ProductService.getProductById(id);
            
            if (!product) {
                return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
            }

            return res.json({ success: true, data: product });
        } catch (error) {
            console.error("getProductById error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    createProduct: async (req, res) => {
        try {
            const product = await ProductService.createProduct(req.body);
            return res.status(201).json({ success: true, data: product, message: "Tạo sản phẩm thành công" });
        } catch (error) {
            console.error("createProduct error:", error);
            if (error.code === "P2002") {
                return res.status(400).json({ success: false, message: "Slug đã tồn tại" });
            }
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await ProductService.updateProduct(id, req.body);
            return res.json({ success: true, data: product, message: "Cập nhật sản phẩm thành công" });
        } catch (error) {
            console.error("updateProduct error:", error);
            if (error.code === "P2002") {
                return res.status(400).json({ success: false, message: "Slug đã tồn tại" });
            }
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            await ProductService.softDeleteProduct(id);
            return res.json({ success: true, message: "Xóa sản phẩm thành công" });
        } catch (error) {
            console.error("deleteProduct error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    hardDeleteProduct: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Lấy product để xóa ảnh trên Cloudinary
            const product = await ProductService.getProductById(id);
            if (product?.images && Array.isArray(product.images)) {
                // Xóa ảnh trên Cloudinary nếu có publicId
                // (cần lưu publicId khi upload)
            }
            
            await ProductService.hardDeleteProduct(id);
            return res.json({ success: true, message: "Xóa vĩnh viễn sản phẩm thành công" });
        } catch (error) {
            console.error("hardDeleteProduct error:", error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
        }
    },

    // ==================== UPLOAD ====================

    uploadImage: async (req, res) => {
        try {
            const { image, folder } = req.body;
            
            if (!image) {
                return res.status(400).json({ success: false, message: "Thiếu dữ liệu ảnh" });
            }

            const result = await CloudinaryHelper.uploadImage(image, folder || "products");
            return res.json({ success: true, data: result });
        } catch (error) {
            console.error("uploadImage error:", error);
            return res.status(500).json({ success: false, message: "Upload ảnh thất bại" });
        }
    },

    uploadMultipleImages: async (req, res) => {
        try {
            const { images, folder } = req.body;
            
            if (!images || !Array.isArray(images)) {
                return res.status(400).json({ success: false, message: "Thiếu dữ liệu ảnh" });
            }

            const results = await CloudinaryHelper.uploadMultipleImages(images, folder || "products");
            return res.json({ success: true, data: results });
        } catch (error) {
            console.error("uploadMultipleImages error:", error);
            return res.status(500).json({ success: false, message: "Upload ảnh thất bại" });
        }
    },
};
