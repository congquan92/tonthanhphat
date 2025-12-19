import { axiosInstance } from "@/lib/axios";

export const AuthApi = {
    login: async (email: string, password: string) => {
        const res = await axiosInstance.post("/auth/login", { email, password });
        return res.data;
    },
};
