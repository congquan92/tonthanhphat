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
                companyName: "NHÀ MÁY TÔN THÀNH PHÁT",
                companyShortName: "TTP",
                companyTagline: "Chuyên Sản Xuất & Phân Phối Tôn Thép",
                companySlogan: "Chất lượng hàng đầu - Giá cả cạnh tranh",
                companyDescription: "Nhà máy Tôn Thành Phát chuyên sản xuất và phân phối các loại tôn lợp, tôn xốp, tôn mạ kẽm, tôn màu chất lượng cao. Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến sản phẩm tốt nhất cho mọi công trình.",
                companyEmail: "info@tonthanhphat.vn",
                companyPhone: ["0901 234 567", "0902 345 678"],
                addresses: [
                    {
                        type: "Nhà máy",
                        address: "123 Đường Quốc Lộ 1A, Xã Bình Chánh, Huyện Bình Chánh, TP. Hồ Chí Minh",
                    },
                    {
                        type: "Văn phòng",
                        address: "456 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
                    },
                ],
                socialLinks: [
                    { platform: "Facebook", url: "https://facebook.com/tonthanhphat", icon: "facebook" },
                    { platform: "Youtube", url: "https://youtube.com/@tonthanhphat", icon: "youtube" },
                    { platform: "Zalo", url: "https://zalo.me/0901234567", icon: "zalo" },
                    { platform: "Tiktok", url: "https://tiktok.com/@tonthanhphat", icon: "tiktok" },
                ],
            },
        });
        console.log("Contact info created.");
    } else {
        console.log("Contact info already exists.");
    }

    // Create Categories
    let tonKemCategory, tonMauCategory, tonXopCategory, tongThepCategory;
    const existingCategories = await prisma.category.findFirst();
    
    if (!existingCategories) {
        // Tạo category cha: Sản Phẩm
        const sanPham = await prisma.category.create({
            data: {
                name: "Sản Phẩm",
                slug: "san-pham",
                order: 1,
                isActive: true,
            },
        });

        // Tạo category con cho Sản Phẩm
        tonKemCategory = await prisma.category.create({
            data: { name: "Tôn Kẽm", slug: "ton-kem", parentId: sanPham.id, order: 1, isActive: true },
        });
        tonMauCategory = await prisma.category.create({
            data: { name: "Tôn Màu", slug: "ton-mau", parentId: sanPham.id, order: 2, isActive: true },
        });
        tonXopCategory = await prisma.category.create({
            data: { name: "Tôn Xốp PU", slug: "ton-xop-pu", parentId: sanPham.id, order: 3, isActive: true },
        });
        tongThepCategory = await prisma.category.create({
            data: { name: "Tôn Lạnh", slug: "ton-lanh", parentId: sanPham.id, order: 4, isActive: true },
        });

        await prisma.category.createMany({
            data: [
                { name: "Tôn 5 Sóng", slug: "ton-5-song", parentId: sanPham.id, order: 5, isActive: true },
                { name: "Tôn 11 Sóng", slug: "ton-11-song", parentId: sanPham.id, order: 6, isActive: true },
            ],
        });

        // Tạo các category khác
        await prisma.category.createMany({
            data: [
                { name: "Trang Chủ", slug: "trang-chu", order: 0, isActive: true },
                { name: "Giới Thiệu", slug: "gioi-thieu", order: 2, isActive: true },
                { name: "Tin Tức", slug: "tin-tuc", order: 3, isActive: true },
                { name: "Liên Hệ", slug: "lien-he", order: 4, isActive: true },
            ],
        });

        console.log("Categories created successfully.");
    } else {
        // Lấy categories đã tồn tại
        tonKemCategory = await prisma.category.findUnique({ where: { slug: "ton-kem" } });
        tonMauCategory = await prisma.category.findUnique({ where: { slug: "ton-mau" } });
        tonXopCategory = await prisma.category.findUnique({ where: { slug: "ton-xop-pu" } });
        tongThepCategory = await prisma.category.findUnique({ where: { slug: "ton-lanh" } });
        console.log("Categories already exist.");
    }

    // Create Sample Products
    const existingProducts = await prisma.product.findFirst();
    if (!existingProducts) {
        // Sample images from placeholder (sẽ thay bằng Cloudinary URLs thực tế)
        const sampleProducts = [
            // Tôn Kẽm Products
            {
                name: "Tôn Kẽm Hoa Sen 0.35mm",
                slug: "ton-kem-hoa-sen-035mm",
                shortDesc: "Tôn kẽm chất lượng cao từ Hoa Sen, độ dày 0.35mm",
                description: `<h2>Tôn Kẽm Hoa Sen 0.35mm - Chất Lượng Vượt Trội</h2>
<p>Tôn kẽm Hoa Sen là sản phẩm được sản xuất trên dây chuyền công nghệ hiện đại, đạt tiêu chuẩn JIS G3302.</p>
<h3>Đặc điểm nổi bật:</h3>
<ul>
<li>Lớp mạ kẽm dày, chống ăn mòn tốt</li>
<li>Độ bền cao, tuổi thọ lâu dài</li>
<li>Phù hợp mọi loại công trình</li>
</ul>`,
                thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                images: [
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
                ],
                specs: [
                    { key: "Thương hiệu", value: "Hoa Sen" },
                    { key: "Độ dày", value: "0.35mm" },
                    { key: "Chiều rộng", value: "1000mm" },
                    { key: "Chiều dài", value: "Theo yêu cầu" },
                    { key: "Tiêu chuẩn", value: "JIS G3302" },
                ],
                categoryId: tonKemCategory?.id,
                isFeatured: true,
                order: 1,
            },
            {
                name: "Tôn Kẽm Hòa Phát 0.4mm",
                slug: "ton-kem-hoa-phat-04mm",
                shortDesc: "Tôn kẽm Hòa Phát độ dày 0.4mm, bền bỉ với thời gian",
                description: `<h2>Tôn Kẽm Hòa Phát 0.4mm</h2>
<p>Sản phẩm đến từ tập đoàn Hòa Phát - thương hiệu thép hàng đầu Việt Nam.</p>`,
                thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
                images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"],
                specs: [
                    { key: "Thương hiệu", value: "Hòa Phát" },
                    { key: "Độ dày", value: "0.4mm" },
                    { key: "Chiều rộng", value: "1000mm" },
                ],
                categoryId: tonKemCategory?.id,
                isFeatured: true,
                order: 2,
            },
            // Tôn Màu Products
            {
                name: "Tôn Màu Xanh Dương 0.45mm",
                slug: "ton-mau-xanh-duong-045mm",
                shortDesc: "Tôn màu xanh dương cao cấp, chống phai màu",
                description: `<h2>Tôn Màu Xanh Dương 0.45mm</h2>
<p>Tôn màu phủ sơn PVDF cao cấp, chống phai màu, bền đẹp theo thời gian.</p>`,
                thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
                specs: [
                    { key: "Màu sắc", value: "Xanh dương" },
                    { key: "Độ dày", value: "0.45mm" },
                    { key: "Lớp phủ", value: "PVDF" },
                ],
                categoryId: tonMauCategory?.id,
                isFeatured: true,
                order: 1,
            },
            {
                name: "Tôn Màu Đỏ Đô 0.5mm",
                slug: "ton-mau-do-do-05mm",
                shortDesc: "Tôn màu đỏ đô sang trọng, phù hợp nhà xưởng",
                description: `<h2>Tôn Màu Đỏ Đô 0.5mm</h2>
<p>Màu đỏ đô truyền thống, phù hợp với các công trình nhà xưởng, kho bãi.</p>`,
                thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
                images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"],
                specs: [
                    { key: "Màu sắc", value: "Đỏ đô" },
                    { key: "Độ dày", value: "0.5mm" },
                ],
                categoryId: tonMauCategory?.id,
                isFeatured: false,
                order: 2,
            },
            // Tôn Xốp PU Products
            {
                name: "Tôn Xốp PU Cách Nhiệt 50mm",
                slug: "ton-xop-pu-cach-nhiet-50mm",
                shortDesc: "Tôn xốp PU cách nhiệt hiệu quả, tiết kiệm điện năng",
                description: `<h2>Tôn Xốp PU Cách Nhiệt 50mm</h2>
<p>Giải pháp cách nhiệt hoàn hảo cho nhà xưởng, giảm nhiệt độ đến 10°C.</p>
<h3>Ưu điểm:</h3>
<ul>
<li>Cách nhiệt hiệu quả, tiết kiệm điện điều hòa</li>
<li>Chống thấm, chống ồn</li>
<li>Lắp đặt nhanh chóng</li>
</ul>`,
                thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
                specs: [
                    { key: "Loại", value: "Tôn xốp PU" },
                    { key: "Độ dày xốp", value: "50mm" },
                    { key: "Mật độ xốp", value: "40kg/m³" },
                    { key: "Hệ số cách nhiệt", value: "0.022 W/mK" },
                ],
                categoryId: tonXopCategory?.id,
                isFeatured: true,
                order: 1,
            },
            {
                name: "Tôn Xốp PU Trắng Sữa 75mm",
                slug: "ton-xop-pu-trang-sua-75mm",
                shortDesc: "Tôn xốp PU màu trắng sữa, cách nhiệt tối ưu",
                description: `<h2>Tôn Xốp PU Trắng Sữa 75mm</h2>
<p>Tôn xốp cao cấp với lớp xốp dày 75mm, cách nhiệt tối đa.</p>`,
                thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
                images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"],
                specs: [
                    { key: "Loại", value: "Tôn xốp PU" },
                    { key: "Độ dày xốp", value: "75mm" },
                    { key: "Màu sắc", value: "Trắng sữa" },
                ],
                categoryId: tonXopCategory?.id,
                isFeatured: true,
                order: 2,
            },
            // Tôn Lạnh Products
            {
                name: "Tôn Lạnh SECC 0.5mm",
                slug: "ton-lanh-secc-05mm",
                shortDesc: "Tôn lạnh SECC chất lượng Nhật Bản",
                description: `<h2>Tôn Lạnh SECC 0.5mm</h2>
<p>Tôn lạnh SECC nhập khẩu, bề mặt mịn, dễ gia công.</p>`,
                thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
                specs: [
                    { key: "Loại", value: "SECC" },
                    { key: "Độ dày", value: "0.5mm" },
                    { key: "Xuất xứ", value: "Nhật Bản" },
                ],
                categoryId: tongThepCategory?.id,
                isFeatured: false,
                order: 1,
            },
            {
                name: "Tôn Lạnh SPCC 0.8mm",
                slug: "ton-lanh-spcc-08mm",
                shortDesc: "Tôn lạnh SPCC dùng trong cơ khí, nội thất",
                description: `<h2>Tôn Lạnh SPCC 0.8mm</h2>
<p>Tôn lạnh SPCC phù hợp cho ngành cơ khí, sản xuất nội thất kim loại.</p>`,
                thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
                images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"],
                specs: [
                    { key: "Loại", value: "SPCC" },
                    { key: "Độ dày", value: "0.8mm" },
                ],
                categoryId: tongThepCategory?.id,
                isFeatured: false,
                order: 2,
            },
        ];

        for (const product of sampleProducts) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    slug: product.slug,
                    shortDesc: product.shortDesc,
                    description: product.description,
                    thumbnail: product.thumbnail,
                    images: product.images,
                    specs: product.specs,
                    categoryId: product.categoryId,
                    isFeatured: product.isFeatured,
                    order: product.order,
                    isActive: true,
                },
            });
        }

        console.log(`Created ${sampleProducts.length} sample products.`);
    } else {
        console.log("Products already exist.");
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
