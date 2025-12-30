"use client";

import { useState, useEffect } from "react";
import { Plus, RefreshCw, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BannerApi, type Banner } from "@/api/banner.api";
import { toast } from "sonner";
import { BannerList } from "@/app/admin/banners/_components/BannerList";
import { BannerDialog } from "@/app/admin/banners/_components/BannerDialog";

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [deleteBanner, setDeleteBanner] = useState<Banner | null>(null);

    // Fetch banners
    const fetchBanners = async () => {
        try {
            setIsLoading(true);
            const bannersRes = await BannerApi.getAllBannersAdmin();
            setBanners(bannersRes.data || []);
        } catch (error) {
            console.error("Failed to fetch banners:", error);
            toast.error("Không thể tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    // Toggle active status
    const handleToggleActive = async (banner: Banner) => {
        try {
            await BannerApi.updateBanner(banner.id, { isActive: !banner.isActive });
            setBanners((prev) => prev.map((b) => (b.id === banner.id ? { ...b, isActive: !b.isActive } : b)));
            toast.success(banner.isActive ? "Đã ẩn banner" : "Đã hiển thị banner");
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    // Delete banner
    const handleDelete = async () => {
        if (!deleteBanner) return;
        try {
            await BannerApi.deleteBanner(deleteBanner.id);
            setBanners((prev) => prev.filter((b) => b.id !== deleteBanner.id));
            toast.success("Đã xóa banner");
            setDeleteBanner(null);
        } catch (error) {
            toast.error("Không thể xóa banner");
        }
    };

    // Open create dialog
    const handleCreate = () => {
        setEditingBanner(null);
        setIsDialogOpen(true);
    };

    // Open edit dialog
    const handleEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setIsDialogOpen(true);
    };

    // Handle dialog success
    const handleDialogSuccess = () => {
        fetchBanners();
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Quản lý Banner</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Thêm, sửa, xóa banner và sắp xếp thứ tự hiển thị</p>
                </div>
                <Button onClick={handleCreate} className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm banner
                </Button>
            </div>

            {/* Banners Table */}
            <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800">
                <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-700 flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Danh sách banner ({banners.length})</CardTitle>
                    <Button variant="ghost" onClick={fetchBanners} size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Làm mới
                    </Button>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : banners.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <ImageIcon className="mb-4 h-16 w-16 text-slate-300" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Chưa có banner nào</h3>
                            <p className="mb-4 text-sm text-slate-500">Bắt đầu bằng cách thêm banner đầu tiên</p>
                            <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                <Plus className="mr-2 h-4 w-4" />
                                Thêm banner
                            </Button>
                        </div>
                    ) : (
                        <BannerList banners={banners} onEdit={handleEdit} onDelete={setDeleteBanner} onToggleActive={handleToggleActive} />
                    )}
                </CardContent>
            </Card>

            {/* Banner Dialog */}
            <BannerDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} banner={editingBanner} banners={banners} onSuccess={handleDialogSuccess} />

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteBanner} onOpenChange={() => setDeleteBanner(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa banner</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn <strong className="text-red-600">xóa vĩnh viễn</strong> banner <strong>"{deleteBanner?.alt}"</strong>?
                            <br />
                            <span className="text-red-500">Hành động này không thể hoàn tác!</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-red-500 text-white hover:bg-red-600">
                            Xóa vĩnh viễn
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
