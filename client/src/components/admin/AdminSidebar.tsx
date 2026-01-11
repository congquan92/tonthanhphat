import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, FileText, Settings, LogOut, ChevronLeft, Menu, ImageUp, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthApi } from "@/api/auth.api";
import { toast } from "sonner";

interface AdminSidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

const menuItems = [
    {
        title: "Sản phẩm",
        href: "/admin/products",
        icon: Package,
    },
    {
        title: "Category",
        href: "/admin/categories",
        icon: BookMarked,
    },
    {
        title: "Bài viết",
        href: "/admin/posts",
        icon: FileText,
    },
    {
        title: "Banner",
        href: "/admin/banners",
        icon: ImageUp,
    },
    {
        title: "Cài đặt",
        href: "/admin/settings",
        icon: Settings,
    },
];

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await AuthApi.logout();
            router.push("/admin/dashboard");
            toast.success("Đăng xuất thành công");
        } catch (error) {
            console.log("Logout failed", error);
            toast.error("Đăng xuất thất bại");
        }
    };

    const pathname = usePathname();

    return (
        <aside className={cn("fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white transition-all duration-300 ease-in-out", isCollapsed ? "w-[72px]" : "w-[260px]")}>
            {/* Logo Section */}
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                {!isCollapsed && (
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white shadow-lg shadow-blue-500/25">TP</div>
                        <span className="text-lg font-semibold tracking-tight">Admin Panel</span>
                    </Link>
                )}
                <Button variant="ghost" size="icon" onClick={onToggle} className="h-9 w-9 shrink-0 text-white hover:bg-white/10">
                    {isCollapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 p-3">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive ? "bg-linear-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg shadow-blue-500/10" : "text-slate-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-blue-400")} />
                            {!isCollapsed && <span className="truncate">{item.title}</span>}
                            {isActive && !isCollapsed && <div className="ml-auto h-2 w-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={cn("w-full rounded-xl hover:bg-white/5 cursor-pointer", isCollapsed ? "h-10 w-10 p-0" : "h-auto justify-start gap-3 px-3 py-2")}>
                            <Avatar className="h-8 w-8 border-2 border-blue-500/30 shrink-0">
                                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                                <AvatarFallback className="bg-black text-white">AD</AvatarFallback>
                            </Avatar>
                            {!isCollapsed && (
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-sm font-semibold text-white">Admin</span>
                                    <span className="text-xs text-slate-400">Quản trị viên</span>
                                </div>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl ">
                        <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
                        <DropdownMenuItem>Cài đặt</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </aside>
    );
}
