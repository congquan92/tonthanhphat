import { axiosInstance } from "@/lib/axios";

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    thumbnail?: string;
    imagePublicId?: string;
    author?: string;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePostInput {
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    thumbnail?: string;
    imagePublicId?: string;
    author?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
}

export interface UpdatePostInput {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    thumbnail?: string;
    imagePublicId?: string;
    author?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
}

export const PostApi = {
    // ==================== PUBLIC ====================
    getAllPosts: async (page?: number, pageSize?: number) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (pageSize) params.append("pageSize", pageSize.toString());
        const res = await axiosInstance.get(`/posts?${params.toString()}`);
        return res.data;
    },

    getFeaturedPosts: async (limit?: number) => {
        const params = limit ? `?limit=${limit}` : "";
        const res = await axiosInstance.get(`/posts/featured${params}`);
        return res.data;
    },

    getPostBySlug: async (slug: string) => {
        const res = await axiosInstance.get(`/posts/${slug}`);
        return res.data;
    },

    // ==================== ADMIN ====================
    getAllPostsAdmin: async (page?: number, pageSize?: number, search?: string, status?: string) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page.toString());
        if (pageSize) params.append("pageSize", pageSize.toString());
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        const res = await axiosInstance.get(`/posts/admin/all?${params.toString()}`);
        return res.data;
    },

    getPostById: async (id: string) => {
        const res = await axiosInstance.get(`/posts/admin/${id}`);
        return res.data;
    },

    createPost: async (data: CreatePostInput) => {
        const res = await axiosInstance.post("/posts", data);
        return res.data;
    },

    updatePost: async (id: string, data: UpdatePostInput) => {
        const res = await axiosInstance.put(`/posts/${id}`, data);
        return res.data;
    },

    deletePost: async (id: string) => {
        const res = await axiosInstance.delete(`/posts/${id}`);
        return res.data;
    },

    hardDeletePost: async (id: string) => {
        const res = await axiosInstance.delete(`/posts/${id}/permanent`);
        return res.data;
    },

    // ==================== UPLOAD ====================
    uploadImage: async (image: string, folder?: string) => {
        const res = await axiosInstance.post("/posts/upload", { image, folder });
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
                    const result = await PostApi.uploadImage(base64, folder || "posts");
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
        const res = await axiosInstance.delete(`/posts/upload/${publicId}`);
        return res.data;
    },
};
