import { axiosInstance } from "@/lib/axios";

export interface Product {
    id: string;
    name: string;
    slug: string;
    shortDesc?: string;
    description?: string;
    thumbnail?: string;
    images?: string[];
    imagePublicIds?: string[]; // Cloudinary public IDs corresponding to images
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
    imagePublicIds?: string[]; // Cloudinary public IDs
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
    imagePublicIds?: string[]; // Cloudinary public IDs
    specs?: { key: string; value: string }[];
    categoryId?: string | null;
    order?: number;
    isActive?: boolean;
    isFeatured?: boolean;
}

export const ProductApi = {
    // ==================== PUBLIC ====================
    getAllProducts: async (page?: number, pageSize?: number, categorySlug?: string) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (pageSize) params.append("pageSize", pageSize.toString());
        if (categorySlug) params.append("category", categorySlug);
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
    getAllProductsAdmin: async (page?: number, pageSize?: number, search?: string, categoryId?: string) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (pageSize) params.append("pageSize", pageSize.toString());
        if (search) params.append("search", search);
        if (categoryId) params.append("categoryId", categoryId);
        const res = await axiosInstance.get(`/products/admin/all?${params.toString()}`);
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

    uploadImageFromFile: async (file: File, folder?: string): Promise<{ success: boolean; data: { url: string; publicId: string } }> => {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith("image/")) {
                reject(new Error("File phải là ảnh"));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64 = reader.result as string;
                    const result = await ProductApi.uploadImage(base64, folder || "products");
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error("Không thể đọc file"));
            reader.readAsDataURL(file);
        });
    },

    deleteImage: async (publicId: string) => {
        const res = await axiosInstance.delete(`/products/upload/${publicId}`);
        return res.data;
    },
};
