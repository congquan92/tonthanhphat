import { axiosInstance } from "@/lib/axios";

export interface Product {
    id: string;
    name: string;
    slug: string;
    shortDesc?: string;
    description?: string;
    thumbnail?: string;
    images?: string[];
    specs?: { key: string; value: string }[];
    categoryId?: string;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    order: number;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductInput {
    name: string;
    slug: string;
    shortDesc?: string;
    description?: string;
    thumbnail?: string;
    images?: string[];
    specs?: { key: string; value: string }[];
    categoryId?: string;
    order?: number;
    isActive?: boolean;
    isFeatured?: boolean;
}

export interface UpdateProductInput {
    name?: string;
    slug?: string;
    shortDesc?: string;
    description?: string;
    thumbnail?: string;
    images?: string[];
    specs?: { key: string; value: string }[];
    categoryId?: string | null;
    order?: number;
    isActive?: boolean;
    isFeatured?: boolean;
}

export const ProductApi = {
    // ==================== PUBLIC ====================
    getAllProducts: async (categorySlug?: string, limit?: number) => {
        const params = new URLSearchParams();
        if (categorySlug) params.append("category", categorySlug);
        if (limit) params.append("limit", limit.toString());
        const res = await axiosInstance.get(`/products?${params.toString()}`);
        return res.data;
    },

    getFeaturedProducts: async (limit?: number) => {
        const params = limit ? `?limit=${limit}` : "";
        const res = await axiosInstance.get(`/products/featured${params}`);
        return res.data;
    },

    getProductBySlug: async (slug: string) => {
        const res = await axiosInstance.get(`/products/${slug}`);
        return res.data;
    },

    // ==================== ADMIN ====================
    getAllProductsAdmin: async () => {
        const res = await axiosInstance.get("/products/admin/all");
        return res.data;
    },

    getProductById: async (id: string) => {
        const res = await axiosInstance.get(`/products/admin/${id}`);
        return res.data;
    },

    createProduct: async (data: CreateProductInput) => {
        const res = await axiosInstance.post("/products", data);
        return res.data;
    },

    updateProduct: async (id: string, data: UpdateProductInput) => {
        const res = await axiosInstance.put(`/products/${id}`, data);
        return res.data;
    },

    deleteProduct: async (id: string) => {
        const res = await axiosInstance.delete(`/products/${id}`);
        return res.data;
    },

    hardDeleteProduct: async (id: string) => {
        const res = await axiosInstance.delete(`/products/${id}/permanent`);
        return res.data;
    },

    // ==================== UPLOAD ====================
    uploadImage: async (image: string, folder?: string) => {
        const res = await axiosInstance.post("/products/upload", { image, folder });
        return res.data;
    },

    uploadMultipleImages: async (images: string[], folder?: string) => {
        const res = await axiosInstance.post("/products/upload/multiple", { images, folder });
        return res.data;
    },
};
