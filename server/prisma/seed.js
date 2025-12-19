import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
    // Create Admin User
    const email = "admin123@gmail.com";
    const password = "admin123";
    const existingAdmin = await prisma.adminUser.findUnique({
        where: { email },
    });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.adminUser.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        console.log(`Admin user created: ${email} / ${password}`);
    } else {
        console.log("Admin user already exists.");
    }

    // Create Contact Info
    const existingContactInfo = await prisma.contactInfo.findFirst();
    if (!existingContactInfo) {
        await prisma.contactInfo.create({
            data: {
                companyName: "TÔN THÀNH PHÁT",
                companyShortName: "TP",
                companyTagline: "Nhà Máy Sản Xuất Tôn",
                companySlogan: "Chất lượng hàng đầu - Giá cả cạnh tranh",
                companyDescription: "Chuyên sản xuất và phân phối các loại tôn chất lượng cao với giá cả cạnh tranh. Cam kết mang đến sản phẩm tốt nhất cho công trình của bạn.",
                companyEmail: "info@tonthanhphat.vn",
                companyPhone: ["0901 234 567", "0902 345 678"],
                addresses: [
                    {
                        type: "Chi nhánh 1",
                        address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
                    },
                    {
                        type: "Chi nhánh 2",
                        address: "345 Đường DEF, Quận GHI, TP. Hồ Chí Minh",
                    },
                ],
                socialLinks: [
                    {
                        platform: "Facebook",
                        url: "https://facebook.com",
                        icon: "facebook",
                    },
                    {
                        platform: "Youtube",
                        url: "https://youtube.com",
                        icon: "youtube",
                    },
                    {
                        platform: "Zalo",
                        url: "https://zalo.me/0901234567",
                        icon: "zalo",
                    },
                ],
            },
        });
        console.log("Contact info created.");
    } else {
        console.log("Contact info already exists.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
