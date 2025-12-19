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

    // Create Categories
    const existingCategories = await prisma.category.findFirst();
    if (!existingCategories) {
        // Tạo category cha: Sản Phẩm
        const sanPham = await prisma.category.create({
            data: {
                name: "Sản Phẩm",
                slug: "san-pham",
                description: "Các sản phẩm tôn chất lượng cao",
                order: 1,
                isActive: true,
            },
        });

        // Tạo category con cho Sản Phẩm
        await prisma.category.createMany({
            data: [
                {
                    name: "Tôn Kẽm",
                    slug: "ton-kem",
                    description: "Tôn kẽm chất lượng cao",
                    parentId: sanPham.id,
                    order: 1,
                    isActive: true,
                },
                {
                    name: "Tôn Màu",
                    slug: "ton-mau",
                    description: "Tôn màu đa dạng",
                    parentId: sanPham.id,
                    order: 2,
                    isActive: true,
                },
                {
                    name: "Tôn Sóng Vuông",
                    slug: "ton-song-vuong",
                    description: "Tôn sóng vuông chắc chắn",
                    parentId: sanPham.id,
                    order: 3,
                    isActive: true,
                },
                {
                    name: "Tôn 5 Sóng",
                    slug: "ton-5-song",
                    description: "Tôn 5 sóng tiêu chuẩn",
                    parentId: sanPham.id,
                    order: 4,
                    isActive: true,
                },
                {
                    name: "Tôn 11 Sóng",
                    slug: "ton-11-song",
                    description: "Tôn 11 sóng bền đẹp",
                    parentId: sanPham.id,
                    order: 5,
                    isActive: true,
                },
            ],
        });

        // Tạo category cha: Dịch Vụ
        const dichVu = await prisma.category.create({
            data: {
                name: "Dịch Vụ",
                slug: "dich-vu",
                description: "Các dịch vụ hỗ trợ khách hàng",
                order: 2,
                isActive: true,
            },
        });

        // Tạo category con cho Dịch Vụ
        await prisma.category.createMany({
            data: [
                {
                    name: "Tư Vấn Miễn Phí",
                    slug: "tu-van",
                    description: "Tư vấn miễn phí cho khách hàng",
                    parentId: dichVu.id,
                    order: 1,
                    isActive: true,
                },
                {
                    name: "Báo Giá Nhanh",
                    slug: "bao-gia",
                    description: "Báo giá nhanh chóng chính xác",
                    parentId: dichVu.id,
                    order: 2,
                    isActive: true,
                },
                {
                    name: "Vận Chuyển Toàn Quốc",
                    slug: "van-chuyen",
                    description: "Vận chuyển toàn quốc",
                    parentId: dichVu.id,
                    order: 3,
                    isActive: true,
                },
                {
                    name: "Bảo Hành Chính Hãng",
                    slug: "bao-hanh",
                    description: "Bảo hành chính hãng uy tín",
                    parentId: dichVu.id,
                    order: 4,
                    isActive: true,
                },
            ],
        });

        // Tạo các category không có con
        await prisma.category.createMany({
            data: [
                {
                    name: "Trang Chủ",
                    slug: "/",
                    description: "Trang chủ website",
                    order: 0,
                    isActive: true,
                },
                {
                    name: "Giới Thiệu",
                    slug: "gioi-thieu",
                    description: "Giới thiệu về công ty",
                    order: 3,
                    isActive: true,
                },
                {
                    name: "Bảng Giá",
                    slug: "bang-gia",
                    description: "Bảng giá sản phẩm",
                    order: 4,
                    isActive: true,
                },
                {
                    name: "Liên Hệ",
                    slug: "lien-he",
                    description: "Thông tin liên hệ",
                    order: 5,
                    isActive: true,
                },
            ],
        });

        console.log("Categories created successfully.");
    } else {
        console.log("Categories already exist.");
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
