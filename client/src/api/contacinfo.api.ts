import { axiosInstance } from "@/lib/axios";

export const ContactInfoApi = {
    getContactInfo: async () => {
        const res = await axiosInstance.get("/info/contactInfo");
        return res.data;
    },

    updateContactInfo: async (contactInfo: { phone: string; address: string; email: string }) => {
        const res = await axiosInstance.put("/info/contactInfo", contactInfo);
        return res.data;
    },
};
