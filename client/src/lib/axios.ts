import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true, // Gửi cookie cùng với yêu cầu
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Chỉ cần gọi API refresh.
                // Backend sẽ nhận Refresh Cookie hiện tại và trả về Set-Cookie mới.
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, { withCredentials: true });

                // Sau khi refresh thành công, trình duyệt đã tự cập nhật Cookie mới.
                // Chỉ cần thực hiện lại request cũ.
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
