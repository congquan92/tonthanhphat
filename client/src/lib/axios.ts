import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Chỉ retry khi:
        // 1. Status là 401
        // 2. Chưa retry lần nào
        // 3. KHÔNG PHẢI là request login hoặc refresh
        const isLoginRequest = originalRequest.url?.includes("/auth/login");
        const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");

        if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest && !isRefreshRequest) {
            originalRequest._retry = true;

            try {
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, { withCredentials: true });
                return axiosInstance(originalRequest);
            } catch (err) {
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);
