import { ContactInfService } from "../services/contactInf.service.js";
import { ValidateContactInfo } from "../lib/validate.js";
export const ContactInfoController = {
    getContactInfo: async (req, res) => {
        try {
            const contactInfo = await ContactInfService.getContactInfo();
            return res.json({ success: true, data: contactInfo });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Lỗi hệ thống", error: error });
        }
    },

    updateContactInfo: async (req, res) => {
        try {
            const result = ValidateContactInfo.safeParse(req.body); // true or false
            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: "Dữ liệu không hợp lệ",
                    errors: result.error.flatten().fieldErrors, // Trả về lỗi chi tiết từng trường
                });
            }

            const updatedContactInfo = await ContactInfService.updateContactInfo(result.data);
            return res.json({
                success: true,
                message: "Cập nhật thông tin thành công",
                data: updatedContactInfo,
            });
        } catch (error) {
            console.error("Lỗi Controller:", error);
            return res.status(500).json({
                success: false,
                message: "Lỗi hệ thống khi cập nhật thông tin",
            });
        }
    },
};
