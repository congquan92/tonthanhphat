"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CategoryApi } from "@/api/category.api";
import { Category } from "@/api/type";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { CategoryDialog } from "./_components/CategoryDialog";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const res = await CategoryApi.getAllCategoriesAdmin();
            setCategories(res.data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Không thể tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Toggle active status
    const toggleActive = async (category: Category) => {
        try {
            await CategoryApi.updateCategory(category.id, { isActive: !category.isActive });
            setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, isActive: !c.isActive } : c)));
            toast.success(category.isActive ? "Đã ẩn danh mục" : "Đã hiển thị danh mục");
        } catch (error) {
            console.error("Failed to toggle active status:", error);
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    // Delete category (soft delete)
    const handleSoftDelete = async () => {
        if (!deleteCategory) return;
        try {
            await CategoryApi.softDeleteCategory(deleteCategory.id);
            toast.success("Đã ẩn danh mục");
            setDeleteCategory(null);
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error("Không thể xóa danh mục");
        }
    };

    // Open dialog for editing
    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsCategoryDialogOpen(true);
    };

    // Open dialog for creating
    const handleCreate = () => {
        setEditingCategory(null);
        setIsCategoryDialogOpen(true);
    };

    // Close dialog
    const handleCloseDialog = () => {
        setIsCategoryDialogOpen(false);
        setEditingCategory(null);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Quản lý Danh mục</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Thêm, sửa, xóa danh mục sản phẩm ({categories.length} danh mục)</p>
                </div>
                <Button onClick={handleCreate} className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm danh mục
                </Button>
            </div>

            {/* Categories List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800">
                    <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-700">
                        <CardTitle className="text-lg font-semibold">Danh sách danh mục</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {categories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FolderOpen className="mb-4 h-16 w-16 text-slate-300" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">Chưa có danh mục nào</h3>
                                <p className="mb-4 text-sm text-slate-500">Bắt đầu bằng cách thêm danh mục đầu tiên</p>
                                <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm danh mục
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Tên danh mục</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Slug</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Thứ tự</th>
                                            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Trạng thái</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                        {categories
                                            .sort((a, b) => a.order - b.order)
                                            .map((category) => (
                                                <tr key={category.id} className={cn("transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50", !category.isActive && "opacity-50")}>
                                                    {/* Name */}
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <p className="font-medium text-slate-900 dark:text-white">{category.name}</p>
                                                            {!category.isActive && <span className="text-xs text-slate-400 italic">(Đang ẩn)</span>}
                                                        </div>
                                                    </td>
                                                    {/* Slug */}
                                                    <td className="px-4 py-3">
                                                        <code className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-300">{category.slug}</code>
                                                    </td>
                                                    {/* Order */}
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">{category.order}</span>
                                                    </td>
                                                    {/* Active Status */}
                                                    <td className="px-4 py-3 text-center">
                                                        <button onClick={() => toggleActive(category)} className={cn("rounded-full p-1.5 transition-colors", category.isActive ? "bg-emerald-100 text-emerald-500" : "bg-slate-100 text-slate-400")}>
                                                            {category.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                        </button>
                                                    </td>
                                                    {/* Actions */}
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => handleEdit(category)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => setDeleteCategory(category)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Category Dialog */}
            <CategoryDialog isOpen={isCategoryDialogOpen} onClose={handleCloseDialog} category={editingCategory} categories={categories} onSuccess={fetchCategories} />

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Ẩn danh mục</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn ẩn danh mục <strong>{deleteCategory?.name}</strong>?
                            <br />
                            <span className="text-amber-600">Danh mục sẽ bị ẩn và không hiển thị trên website.</span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSoftDelete} className="rounded-xl bg-red-500 text-white hover:bg-red-600">
                            Ẩn danh mục
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
