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

