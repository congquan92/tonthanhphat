import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";

const stats = [
    {
        title: "Tổng doanh thu",
        value: "₫245,600,000",
        change: "+12.5%",
        trend: "up",
        icon: DollarSign,
        color: "from-emerald-500 to-teal-500",
    },
    {
        title: "Đơn hàng mới",
        value: "156",
        change: "+8.2%",
        trend: "up",
        icon: ShoppingCart,
        color: "from-blue-500 to-cyan-500",
    },
    {
        title: "Sản phẩm",
        value: "2,340",
        change: "+3.1%",
        trend: "up",
        icon: Package,
        color: "from-purple-500 to-pink-500",
    },
    {
        title: "Khách hàng",
        value: "1,890",
        change: "-2.4%",
        trend: "down",
        icon: Users,
        color: "from-orange-500 to-amber-500",
    },
];

const recentOrders = [
    {
        id: "#ORD-001",
        customer: "Nguyễn Văn A",
        product: "Tôn lợp mái 0.4mm",
        amount: "₫12,500,000",
        status: "Hoàn thành",
        statusColor: "bg-emerald-100 text-emerald-700",
    },
    {
        id: "#ORD-002",
        customer: "Trần Thị B",
        product: "Tôn chống nóng",
        amount: "₫8,900,000",
        status: "Đang xử lý",
        statusColor: "bg-blue-100 text-blue-700",
    },
    {
        id: "#ORD-003",
        customer: "Lê Hoàng C",
        product: "Tôn mạ kẽm",
        amount: "₫15,200,000",
        status: "Chờ xác nhận",
        statusColor: "bg-amber-100 text-amber-700",
    },
    {
        id: "#ORD-004",
        customer: "Phạm Minh D",
        product: "Tôn cách nhiệt",
        amount: "₫6,750,000",
        status: "Hoàn thành",
        statusColor: "bg-emerald-100 text-emerald-700",
    },
    {
        id: "#ORD-005",
        customer: "Hoàng Kim E",
        product: "Tôn giả ngói",
        amount: "₫22,100,000",
        status: "Đang giao",
        statusColor: "bg-purple-100 text-purple-700",
    },
];

export { stats, recentOrders };
