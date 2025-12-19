import { prisma } from "../config/db.js";
export const ContactInfService = {
    getContactInfo: async () => {
        const contactInfo = await prisma.contactInfo.findFirst();
        return contactInfo;
    },
    updateContactInfo: async (contactInfoData) => {
        const updatedContactInfo = await prisma.contactInfo.update({
            where: { id: contactInfoData.id },
            data: contactInfoData,
        });
        return updatedContactInfo;
    },
};
