import { axiosInstance } from "@/lib/axios";

export interface Banner {
    id: string;
    imageUrl: string;
    publicId?: string; // Cloudinary public ID
    alt: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBannerInput {
    imageUrl: string;
    publicId?: string; // Cloudinary public ID
    alt: string;
    order: number;
    isActive?: boolean;
}

export interface UpdateBannerInput {
    imageUrl?: string;
    publicId?: string; // Cloudinary public ID
    alt?: string;
    order?: number;
    isActive?: boolean;
}

export const BannerApi = {
    // ==================== PUBLIC ====================
    getAllBanners: async () => {
        const res = await axiosInstance.get("/banners");
        return res.data;
    },

    // ==================== ADMIN ====================
    getAllBannersAdmin: async () => {
        const res = await axiosInstance.get("/banners/admin/all");
        return res.data;
    },

    getBannerById: async (id: string) => {
        const res = await axiosInstance.get(`/banners/admin/${id}`);
        return res.data;
    },

    createBanner: async (data: CreateBannerInput) => {
        const res = await axiosInstance.post("/banners", data);
        return res.data;
    },

    updateBanner: async (id: string, data: UpdateBannerInput) => {
        const res = await axiosInstance.put(`/banners/${id}`, data);
        return res.data;
    },

    deleteBanner: async (id: string) => {
        const res = await axiosInstance.delete(`/banners/${id}`);
        return res.data;
    },

    // ==================== UPLOAD ====================
    uploadImage: async (image: string, folder?: string) => {
        const res = await axiosInstance.post("/banners/upload", { image, folder });
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
                    const result = await BannerApi.uploadImage(base64, folder || "banners");
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error("Không thể đọc file"));
            reader.readAsDataURL(file);
        });
    },
};
