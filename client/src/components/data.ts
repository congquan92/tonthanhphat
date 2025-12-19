// Navigation Links with Submenu
export type NavLink = {
    href: string;
    label: string;
    submenu?: { href: string; label: string }[];
};

export const navLinks: NavLink[] = [
    { href: "/", label: "Trang Chủ" },
    {
        href: "/san-pham",
        label: "Sản Phẩm",
        submenu: [
            { href: "/san-pham/ton-kem", label: "Tôn Kẽm" },
            { href: "/san-pham/ton-mau", label: "Tôn Màu" },
            { href: "/san-pham/ton-song-vuong", label: "Tôn Sóng Vuông" },
            { href: "/san-pham/ton-5-song", label: "Tôn 5 Sóng" },
            { href: "/san-pham/ton-11-song", label: "Tôn 11 Sóng" },
        ],
    },
    { href: "/gioi-thieu", label: "Giới Thiệu" },
    { href: "/bang-gia", label: "Bảng Giá" },
    {
        href: "/dich-vu",
        label: "Dịch Vụ",
        submenu: [
            { href: "/dich-vu/tu-van", label: "Tư Vấn Miễn Phí" },
            { href: "/dich-vu/bao-gia", label: "Báo Giá Nhanh" },
            { href: "/dich-vu/van-chuyen", label: "Vận Chuyển Toàn Quốc" },
            { href: "/dich-vu/bao-hanh", label: "Bảo Hành Chính Hãng" },
        ],
    },
    { href: "/lien-he", label: "Liên Hệ" },
];

// Footer Links
export const footerLinks = {
    products: [
        { href: "/san-pham/ton-kem", label: "Tôn Kẽm" },
        { href: "/san-pham/ton-mau", label: "Tôn Màu" },
        { href: "/san-pham/ton-song-vuong", label: "Tôn Sóng Vuông" },
        { href: "/san-pham/ton-5-song", label: "Tôn 5 Sóng" },
        { href: "/san-pham/ton-11-song", label: "Tôn 11 Sóng" },
    ],
    services: [
        { href: "/dich-vu/tu-van", label: "Tư Vấn Miễn Phí" },
        { href: "/dich-vu/bao-gia", label: "Báo Giá Nhanh" },
        { href: "/dich-vu/van-chuyen", label: "Vận Chuyển Toàn Quốc" },
        { href: "/dich-vu/bao-hanh", label: "Bảo Hành Chính Hãng" },
    ],
    quickLinks: [
        { href: "/gioi-thieu", label: "Giới Thiệu" },
        { href: "/bang-gia", label: "Bảng Giá" },
        { href: "/tin-tuc", label: "Tin Tức" },
        { href: "/lien-he", label: "Liên Hệ" },
    ],
    policies: [
        { href: "/chinh-sach-bao-mat", label: "Chính Sách Bảo Mật" },
        { href: "/dieu-khoan-su-dung", label: "Điều Khoản Sử Dụng" },
    ],
};

// Company Info
export const companyInfo = {
    name: "TÔN THÀNH PHÁT",
    shortName: "TP",
    tagline: "Nhà Máy Sản Xuất Tôn",
    slogan: "Chất lượng hàng đầu - Giá cả cạnh tranh",
    yearEstablished: 2005,
    description: "Chuyên sản xuất và phân phối các loại tôn chất lượng cao với giá cả cạnh tranh. Cam kết mang đến sản phẩm tốt nhất cho công trình của bạn.",
    logo: "/logo.png",
};

// Contact Info
export const contactInfo = {
    phone: "0901 234 567",
    phoneLink: "tel:0901234567",
    email: "info@tonthanhphat.vn",
    emailLink: "mailto:info@tonthanhphat.vn",
    address: "123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh",
    workingHours: {
        weekday: "Thứ 2 - Thứ 7: 7:30 - 17:30",
        weekend: "Chủ Nhật: 8:00 - 12:00",
    },
};

// Social Links
export const socialLinks = [
    {
        name: "Facebook",
        href: "https://facebook.com",
        icon: "facebook",
        bgColor: "bg-blue-600 hover:bg-blue-500",
    },
    {
        name: "Youtube",
        href: "https://youtube.com",
        icon: "youtube",
        bgColor: "bg-red-600 hover:bg-red-500",
    },
    {
        name: "Zalo",
        href: "https://zalo.me/0901234567",
        icon: "zalo",
        bgColor: "bg-blue-500 hover:bg-blue-400",
    },
];
