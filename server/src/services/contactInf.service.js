import { prisma } from "../config/db.js";
export const ContactInfService = {
    getContactInfo: async () => {
        const contactInfo = await prisma.contactInfo.findFirst();
        return contactInfo;
    },
    updateContactInfo: async (contactInfoData) => {
        // Tìm record hiện có
        const existingRecord = await prisma.contactInfo.findFirst();
        
        if (existingRecord) {
            // Nếu đã có record, update nó
            const updatedContactInfo = await prisma.contactInfo.update({
                where: { id: existingRecord.id },
                data: contactInfoData,
            });
            return updatedContactInfo;
        } else {
            // Nếu chưa có, tạo mới
            const newContactInfo = await prisma.contactInfo.create({
                data: contactInfoData,
            });
            return newContactInfo;
        }
    },
};
