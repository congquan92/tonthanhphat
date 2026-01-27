import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function createAdminUser() {
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
}

async function createContactInfo() {
    const existingContactInfo = await prisma.contactInfo.findFirst();
    if (!existingContactInfo) {
        await prisma.contactInfo.create({
            data: {
                companyName: "NHÀ MÁY TÔN THÀNH PHÁT",
                companyShortName: "TTP",
                companyTagline: "Chuyên Sản Xuất & Phân Phối Tôn Thép",
                companySlogan: "Chất lượng hàng đầu - Giá cả cạnh tranh",
                companyDescription: `CÔNG TY TNHH SẢN XUẤT THƯƠNG MẠI DỊCH VỤ TÔN THÉP THÀNH PHÁT 
Công Ty Tôn Thép Thành Phát xin trân trọng giới thiệu đến Quý khách hàng: 
Công ty được thành lập ngày 28/02/2020, hoạt động trong lĩnh vực sản xuất – thương mại – phân phối tôn thép. Trải qua quá trình hình thành và phát triển, Tôn Thép Thành Phát từng bước khẳng định vị thế là đơn vị cung cấp tôn thép uy tín, đáp ứng đa dạng nhu cầu của thị trường với chất lượng sản phẩm ổn định, giá cả hợp lý và dịch vụ chuyên nghiệp. 
Với phương châm lấy uy tín – chất lượng – sự minh bạch làm nền tảng, Công Ty Tôn Thép Thành Phát luôn chú trọng hoàn thiện quy trình sản xuất, kinh doanh và phân phối, nhằm mang đến cho khách hàng những sản phẩm đạt tiêu chuẩn, rõ ràng về nguồn gốc, chủng loại và giá thành. 
Trong giai đoạn đầu hoạt động, do còn hạn chế về kinh nghiệm và nguồn lực, công ty không tránh khỏi những thiếu sót ảnh hưởng đến sự hài lòng của Quý khách hàng. Chúng tôi xin chân thành ghi nhận và cam kết không ngừng cải tiến, nâng cao chất lượng sản phẩm cũng như phong cách phục vụ, đặc biệt từ năm 2024 trở đi, với mục tiêu phát triển bền vững và chuyên nghiệp hơn. 
Sự tin tưởng và đồng hành của Quý khách hàng chính là động lực và niềm vinh hạnh đối với Tôn Thép Thành Phát trong suốt quá trình phát triển. 
Kính chúc Quý khách hàng sức khỏe, thành công và thịnh vượng. 
Chúc cho mối quan hệ hợp tác giữa Quý khách hàng và Công Ty Tôn Thép Thành Phát ngày càng bền chặt. 
Trân trọng cảm ơn!`.trim(),
                companyEmail: "info@tonthanhphat.vn",
                companyPhone: ["0932695495", "0345658495"],
                iframeMap: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0984083966237!2d106.56168487570342!3d10.80377455868737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bd4b454c559%3A0xfcc3c09ec0a8158!2zTmjDoCBtw6F5IHTDtG4gVGjDoG5oIFBow6F0!5e0!3m2!1sen!2s!4v1756277384042!5m2!1sen!2s`,
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
}

async function createCategories() {
    // Create Product Categories (flat structure, no parent/child)
    let tonKemCategory, tonMauCategory, tonXopCategory, tongThepCategory;
    const existingCategories = await prisma.category.findFirst();

    if (!existingCategories) {
        // Create product categories directly (no parent category needed)
        tonKemCategory = await prisma.category.create({
            data: { name: "Tôn Kẽm", slug: "ton-kem", isActive: true, order: 1 },
        });
        tonMauCategory = await prisma.category.create({
            data: { name: "Tôn Màu", slug: "ton-mau", isActive: true, order: 2 },
        });
        tonXopCategory = await prisma.category.create({
            data: { name: "Tôn Xốp PU", slug: "ton-xop-pu", isActive: true, order: 3 },
        });
        tongThepCategory = await prisma.category.create({
            data: { name: "Tôn Lạnh", slug: "ton-lanh", isActive: true, order: 4 },
        });

        // Create additional product categories
        await prisma.category.createMany({
            data: [
                { name: "Tôn 5 Sóng", slug: "ton-5-song", isActive: true, order: 5 },
                { name: "Tôn 11 Sóng", slug: "ton-11-song", isActive: true, order: 6 },
            ],
        });

        console.log("Product categories created successfully.");
    } else {
        // Get existing categories
        tonKemCategory = await prisma.category.findUnique({ where: { slug: "ton-kem" } });
        tonMauCategory = await prisma.category.findUnique({ where: { slug: "ton-mau" } });
        tonXopCategory = await prisma.category.findUnique({ where: { slug: "ton-xop-pu" } });
        tongThepCategory = await prisma.category.findUnique({ where: { slug: "ton-lanh" } });
        console.log("Categories already exist.");
    }

    return { tonKemCategory, tonMauCategory, tonXopCategory, tongThepCategory };
}

async function createProducts(categories) {
    const { tonKemCategory, tonMauCategory, tonXopCategory, tongThepCategory } = categories;

    // Create Sample Products
    const existingProducts = await prisma.product.findFirst();
    if (!existingProducts) {
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
                images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800"],
                specs: [
                    { key: "Thương hiệu", value: "Hoa Sen" },
                    { key: "Độ dày", value: "0.35mm" },
                    { key: "Chiều rộng", value: "1000mm" },
                    { key: "Chiều dài", value: "Theo yêu cầu" },
                    { key: "Tiêu chuẩn", value: "JIS G3302" },
                ],
                categoryId: tonKemCategory?.id,
                isFeatured: true,
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
                    imagePublicIds: [],
                    specs: product.specs,
                    categoryId: product.categoryId,
                    isFeatured: product.isFeatured,
                    isActive: true,
                },
            });
        }

        console.log(`Created ${sampleProducts.length} sample products.`);
    } else {
        console.log("Products already exist.");
    }
}

async function createPosts() {
    // Create Sample Posts
    const existingPosts = await prisma.post.findFirst();
    if (!existingPosts) {
        const samplePosts = [
            {
                title: "Tôn Thành Phát Khai Trương Chi Nhánh Mới Tại Quận 7",
                slug: "ton-thanh-phat-khai-truong-chi-nhanh-moi-tai-quan-7",
                excerpt: "Ngày 15/01/2026, Công ty Tôn Thép Thành Phát chính thức khai trương chi nhánh mới tại Quận 7, TP.HCM nhằm phục vụ tốt hơn nhu cầu của khách hàng khu vực phía Nam.",
                content: `<h2>Tôn Thành Phát Khai Trương Chi Nhánh Mới</h2>
<p>Với mục tiêu mở rộng phạm vi hoạt động và nâng cao chất lượng phục vụ khách hàng, Công ty TNHH Sản Xuất Thương Mại Dịch Vụ Tôn Thép Thành Phát tự hào thông báo khai trương chi nhánh mới tại 456 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh.</p>
<h3>Thông tin chi nhánh mới</h3>
<ul>
<li>Địa chỉ: 456 Đường Nguyễn Văn Linh, Quận 7, TP.HCM</li>
<li>Diện tích: 2000m²</li>
<li>Kho hàng hiện đại với đầy đủ các loại tôn</li>
<li>Đội ngũ tư vấn chuyên nghiệp</li>
</ul>
<p>Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao với giá cả cạnh tranh nhất thị trường.</p>`,
                thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
                author: "Ban Biên Tập",
                isPublished: true,
                isFeatured: true,
                publishedAt: new Date("2026-01-15"),
            },
            {
                title: "Hướng Dẫn Chọn Tôn Phù Hợp Cho Nhà Xưởng",
                slug: "huong-dan-chon-ton-phu-hop-cho-nha-xuong",
                excerpt: "Chọn loại tôn phù hợp cho nhà xưởng là quyết định quan trọng ảnh hưởng đến chi phí và tuổi thổ công trình. Cùng tìm hiểu các tiêu chí quan trọng.",
                content: `<h2>Hướng Dẫn Chọn Tôn Cho Nhà Xưởng</h2>
<p>Việc lựa chọn loại tôn phù hợp cho nhà xưởng cần xem xét nhiều yếu tố từ ngân sách, khí hậu đến mục đích sử dụng.</p>
<h3>Các loại tôn phổ biến</h3>
<ul>
<li><strong>Tôn lạnh</strong>: Giá rẻ, phù hợp nhà xưởng tạm thời</li>
<li><strong>Tôn kẽm</strong>: Chống gỉ tốt, giá trung bình</li>
<li><strong>Tôn màu</strong>: Đẹp, bền, chống nóng tốt</li>
<li><strong>Tôn xốp PU</strong>: Cách nhiệt tốt nhất, phù hợp nhà xưởng có máy móc</li>
</ul>
<h3>Tiêu chí lựa chọn</h3>
<p>1. <strong>Độ dày</strong>: Phụ thuộc vào khẩu độ mái và tải trọng<br>
2. <strong>Độ bền</strong>: Xem xét tuổi thọ và bảo hành<br>
3. <strong>Khả năng cách nhiệt</strong>: Quan trọng với nhà xưởng có người làm việc<br>
4. <strong>Giá cả</strong>: Cân đối giữa chất lượng và ngân sách</p>`,
                thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
                author: "Kỹ Sư Nguyễn Văn A",
                isPublished: true,
                isFeatured: true,
                publishedAt: new Date("2026-01-10"),
            },
            {
                title: "Dự Án Cung Cấp Tôn Cho Khu Công Nghiệp Long Thành",
                slug: "du-an-cung-cap-ton-cho-khu-cong-nghiep-long-thanh",
                excerpt: "Tôn Thành Phát tự hào là nhà cung cấp tôn chính cho dự án khu công nghiệp Long Thành với tổng diện tích mái lên đến 50,000m².",
                content: `<h2>Dự Án Khu Công Nghiệp Long Thành</h2>
<p>Trong tháng 12/2025, Công ty Tôn Thép Thành Phát đã hoàn thành xuất sắc dự án cung cấp và thi công tôn cho Khu Công Nghiệp Long Thành, Đồng Nai.</p>
<h3>Thông tin dự án</h3>
<ul>
<li>Chủ đầu tư: Tập đoàn Công Nghiệp ABC</li>
<li>Diện tích mái: 50,000m²</li>
<li>Loại tôn: Tôn xốp PU 75mm + Tôn màu cao cấp</li>
<li>Thời gian thi công: 2 tháng</li>
<li>Giá trị hợp đồng: 15 tỷ VNĐ</li>
</ul>
<h3>Những thách thức</h3>
<p>Dự án đòi hỏi tiến độ nhanh và chất lượng cao. Đội ngũ Tôn Thành Phát đã làm việc 3 ca để đảm bảo tiến độ giao hàng và thi công đúng hạn.</p>
<p>Kết quả là một công trình hoàn thiện vượt mong đợi, nhận được sự hài lòng cao từ chủ đầu tư.</p>`,
                thumbnail: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800",
                author: "Phòng Dự Án",
                isPublished: true,
                isFeatured: true,
                publishedAt: new Date("2025-12-28"),
            },
            {
                title: "Tôn Xốp PU - Giải Pháp Cách Nhiệt Hiệu Quả",
                slug: "ton-xop-pu-giai-phap-cach-nhiet-hieu-qua",
                excerpt: "Tôn xốp PU là giải pháp cách nhiệt tối ưu cho nhà xưởng, giúp giảm nhiệt độ lên đến 10°C và tiết kiệm chi phí điện năng đáng kể.",
                content: `<h2>Tôn Xốp PU - Vật Liệu Cách Nhiệt Ưu Việt</h2>
<p>Trong điều kiện khí hậu nhiệt đới nóng ẩm của Việt Nam, việc cách nhiệt cho nhà xưởng là vô cùng quan trọng.</p>
<h3>Ưu điểm của Tôn Xốp PU</h3>
<ul>
<li><strong>Cách nhiệt xuất sắc</strong>: Hệ số dẫn nhiệt chỉ 0.022 W/mK</li>
<li><strong>Tiết kiệm năng lượng</strong>: Giảm 40-60% chi phí điều hòa</li>
<li><strong>Chống ồn</strong>: Giảm tiếng ồn từ mưa, gió</li>
<li><strong>Chống thấm tuyệt đối</strong>: Lõi xốp kín không thấm nước</li>
<li><strong>Nhẹ</strong>: Giảm tải cho kết cấu</li>
<li><strong>Lắp đặt nhanh</strong>: Tiết kiệm thời gian thi công</li>
</ul>
<h3>Ứng dụng</h3>
<p>Tôn xốp PU phù hợp cho: nhà xưởng sản xuất, kho lạnh, siêu thị, trung tâm thương mại, nhà thể thao...</p>`,
                thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                author: "Kỹ Sư Lê Văn B",
                isPublished: true,
                isFeatured: false,
                publishedAt: new Date("2025-12-20"),
            },
            {
                title: "Quy Trình Sản Xuất Tôn Màu Tại Tôn Thành Phát",
                slug: "quy-trinh-san-xuat-ton-mau-tai-ton-thanh-phat",
                excerpt: "Khám phá quy trình sản xuất tôn màu hiện đại với công nghệ tiên tiến, đảm bảo chất lượng sản phẩm đạt tiêu chuẩn quốc tế.",
                content: `<h2>Quy Trình Sản Xuất Tôn Màu</h2>
<p>Tôn Thành Phát tự hào sở hữu dây chuyền sản xuất tôn màu hiện đại, áp dụng công nghệ Nhật Bản.</p>
<h3>Các bước sản xuất</h3>
<ol>
<li><strong>Tiền xử lý</strong>: Làm sạch bề mặt tôn kẽm</li>
<li><strong>Sơn lót</strong>: Phủ lớp sơn chống gỉ</li>
<li><strong>Sơn phủ</strong>: Phủ lớp sơn màu chính (PVDF hoặc PE)</li>
<li><strong>Sấy khô</strong>: Nhiệt độ 200-250°C</li>
<li><strong>Làm nguội</strong>: Hạ nhiệt độ tự nhiên</li>
<li><strong>Kiểm tra chất lượng</strong>: Đo độ dày lớp sơn, độ bám dính</li>
<li><strong>Đóng gói</strong>: Bảo vệ bề mặt, chống xước</li>
</ol>
<h3>Kiểm soát chất lượng</h3>
<p>Mỗi cuộn tôn đều được kiểm tra kỹ lưỡng về màu sắc, độ dày lớp sơn, độ bám dính trước khi xuất kho.</p>`,
                thumbnail: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800",
                author: "Phòng Kỹ Thuật",
                isPublished: true,
                isFeatured: false,
                publishedAt: new Date("2025-12-15"),
            },
            {
                title: "Bảo Dưỡng Mái Tôn - Bí Quyết Kéo Dài Tuổi Thọ",
                slug: "bao-duong-mai-ton-bi-quyet-keo-dai-tuoi-tho",
                excerpt: "Hướng dẫn bảo dưỡng mái tôn định kỳ giúp kéo dài tuổi thọ và duy trì tính năng bảo vệ cho công trình của bạn.",
                content: `<h2>Bảo Dưỡng Mái Tôn Đúng Cách</h2>
<p>Mái tôn cần được bảo dưỡng định kỳ để đảm bảo tuổi thọ và hiệu quả sử dụng.</p>
<h3>Lịch trình bảo dưỡng</h3>
<ul>
<li><strong>Hàng tháng</strong>: Kiểm tra bề mặt, vệ sinh lá cây</li>
<li><strong>6 tháng/lần</strong>: Vệ sinh tổng thể, kiểm tra bu lông</li>
<li><strong>1 năm/lần</strong>: Kiểm tra chống gỉ, sơn lại nếu cần</li>
</ul>
<h3>Các bước vệ sinh</h3>
<ol>
<li>Dùng chổi mềm quét sạch bụi bẩn</li>
<li>Rửa bằng nước sạch (không dùng áp lực cao)</li>
<li>Dùng dung dịch tẩy nhẹ cho vết bẩn cứng đầu</li>
<li>Lau khô tự nhiên</li>
</ol>
<h3>Lưu ý</h3>
<p>- Không đi trực tiếp lên mái tôn<br>
- Không dùng hóa chất mạnh<br>
- Sơn lại ngay khi phát hiện gỉ sét</p>`,
                thumbnail: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
                author: "Bộ Phận Kỹ Thuật",
                isPublished: true,
                isFeatured: false,
                publishedAt: new Date("2025-12-10"),
            },
            {
                title: "Tôn Thành Phát Đạt Chứng Nhận ISO 9001:2015",
                slug: "ton-thanh-phat-dat-chung-nhan-iso-9001-2015",
                excerpt: "Công ty Tôn Thép Thành Phát vinh dự đạt chứng nhận ISO 9001:2015 về hệ thống quản lý chất lượng, khẳng định cam kết chất lượng với khách hàng.",
                content: `<h2>Tôn Thành Phát Đạt ISO 9001:2015</h2>
<p>Ngày 01/12/2025, Công ty TNHH Sản Xuất Thương Mại Dịch Vụ Tôn Thép Thành Phát chính thức nhận chứng nhận ISO 9001:2015 từ tổ chức TUV Rheinland.</p>
<h3>Ý nghĩa của chứng nhận</h3>
<p>ISO 9001:2015 là tiêu chuẩn quốc tế về hệ thống quản lý chất lượng, đảm bảo:</p>
<ul>
<li>Quy trình sản xuất chuẩn hóa</li>
<li>Kiểm soát chất lượng chặt chẽ</li>
<li>Cải tiến liên tục</li>
<li>Tăng sự hài lòng của khách hàng</li>
</ul>
<h3>Con đường phía trước</h3>
<p>Với chứng nhận này, Tôn Thành Phát cam kết tiếp tục nâng cao chất lượng sản phẩm và dịch vụ, xứng đáng với niềm tin của khách hàng.</p>`,
                thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
                author: "Ban Giám Đốc",
                isPublished: true,
                isFeatured: true,
                publishedAt: new Date("2025-12-01"),
            },
            {
                title: "So Sánh Tôn Kẽm Và Tôn Màu - Nên Chọn Loại Nào?",
                slug: "so-sanh-ton-kem-va-ton-mau-nen-chon-loai-nao",
                excerpt: "Phân tích ưu nhược điểm của tôn kẽm và tôn màu giúp bạn đưa ra lựa chọn phù hợp với nhu cầu và ngân sách.",
                content: `<h2>Tôn Kẽm vs Tôn Màu</h2>
<p>Cả tôn kẽm và tôn màu đều là lựa chọn phổ biến cho mái nhà, nhưng mỗi loại có ưu nhược điểm riêng.</p>
<h3>Tôn Kẽm</h3>
<p><strong>Ưu điểm:</strong></p>
<ul>
<li>Giá thành rẻ hơn 20-30%</li>
<li>Chống gỉ tốt nhờ lớp mạ kẽm</li>
<li>Phù hợp nhiều loại công trình</li>
</ul>
<p><strong>Nhược điểm:</strong></p>
<ul>
<li>Bị oxy hóa theo thời gian</li>
<li>Không có màu sắc đa dạng</li>
<li>Hấp thụ nhiệt cao hơn</li>
</ul>
<h3>Tôn Màu</h3>
<p><strong>Ưu điểm:</strong></p>
<ul>
<li>Màu sắc đa dạng, thẩm mỹ cao</li>
<li>Lớp sơn chống UV, giảm hấp thụ nhiệt</li>
<li>Tuổi thọ cao (15-20 năm)</li>
<li>Ít bảo trì</li>
</ul>
<p><strong>Nhược điểm:</strong></p>
<ul>
<li>Giá cao hơn tôn kẽm</li>
<li>Lớp sơn có thể bong tróc nếu không đúng quy cách</li>
</ul>
<h3>Kết luận</h3>
<p>- <strong>Chọn tôn kẽm</strong>: Nếu ngân sách hạn chế, công trình tạm thời<br>
- <strong>Chọn tôn màu</strong>: Nếu cần thẩm mỹ, bền lâu, ít bảo trì</p>`,
                thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
                author: "Chuyên Gia Tư Vấn",
                isPublished: true,
                isFeatured: false,
                publishedAt: new Date("2025-11-25"),
            },
        ];

        for (const post of samplePosts) {
            await prisma.post.create({
                data: post,
            });
        }

        console.log(`Created ${samplePosts.length} sample posts.`);
    } else {
        console.log("Posts already exist.");
    }
}

async function main() {
    // Create Admin User
    await createAdminUser();

    // Create Contact Info
    await createContactInfo();

    const categories = await createCategories(); // Create Categories
    await createProducts(categories); // Create Products
    // Create Posts

    await createPosts();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
