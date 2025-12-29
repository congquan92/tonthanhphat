"use client";

import { useState, useEffect } from "react";
import { Plus, FolderOpen, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CategoryApi } from "@/api/category.api";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/api/type";
import { toast } from "sonner";
import { CategoryTreeItem, CategoryDialog } from "./_components";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [parentIdForNew, setParentIdForNew] = useState<string | null>(null);

    // Delete dialog
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await CategoryApi.getAllCategoriesAdmin();
            setCategories(data.data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Không thể tải danh mục");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Toggle expand
    const handleToggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Expand all
    const expandAll = () => {
        const getAllIds = (cats: Category[]): string[] => {
            return cats.flatMap((c) => [c.id, ...(c.children ? getAllIds(c.children) : [])]);
        };
        setExpandedIds(new Set(getAllIds(categories)));
    };

    // Collapse all
    const collapseAll = () => {
        setExpandedIds(new Set());
    };

    // Open create dialog
    const handleCreate = () => {
        setEditingCategory(null);
        setParentIdForNew(null);
        setIsDialogOpen(true);
    };

    // Open create child dialog
    const handleAddChild = (parentId: string) => {
        setEditingCategory(null);
        setParentIdForNew(parentId);
        setIsDialogOpen(true);
    };

    // Open edit dialog
    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setParentIdForNew(null);
        setIsDialogOpen(true);
    };

    // Save category
    const handleSave = async (data: CreateCategoryInput | UpdateCategoryInput) => {
        try {
            setIsSaving(true);
            if (editingCategory) {
                await CategoryApi.updateCategory(editingCategory.id, data);
                toast.success("Đã cập nhật danh mục");
            } else {
                await CategoryApi.createCategory(data as CreateCategoryInput);
                toast.success("Đã tạo danh mục mới");
            }
            setIsDialogOpen(false);
            fetchCategories();
        } catch (error) {
            console.error("Failed to save category:", error);
            toast.error("Không thể lưu danh mục");
        } finally {
            setIsSaving(false);
        }
    };

    // Delete category (hard delete)
    const handleDelete = async () => {
        if (!deleteCategory) return;
        try {
            await CategoryApi.hardDeleteCategory(deleteCategory.id);
            toast.success("Đã xóa vĩnh viễn danh mục");
            setDeleteCategory(null);
            fetchCategories();
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error("Không thể xóa danh mục");
        }
    };

    // Toggle active status (hide/show)
    const handleToggleActive = async (category: Category) => {
        try {
            await CategoryApi.updateCategory(category.id, { isActive: !category.isActive });
            toast.success(category.isActive ? "Đã ẩn danh mục" : "Đã hiển thị danh mục");
            fetchCategories();
        } catch (error) {
            console.error("Failed to toggle category:", error);
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Danh mục sản phẩm</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Quản lý cấu trúc danh mục và phân loại sản phẩm</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={expandAll} className="text-slate-600">
                        Mở rộng
                    </Button>
                    <Button variant="ghost" size="sm" onClick={collapseAll} className="text-slate-600">
                        Thu gọn
                    </Button>
                    <Button onClick={handleCreate} className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm danh mục
                    </Button>
                </div>
            </div>

            {/* Categories Tree */}
            <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800 dark:shadow-slate-900/50">
                <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-700">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                        <FolderOpen className="h-5 w-5 text-blue-500" />
                        Cây danh mục
                        <span className="ml-auto text-sm font-normal text-slate-400">{categories.filter((c) => !c.parentId).length} danh mục gốc</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FolderOpen className="mb-4 h-16 w-16 text-slate-300" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Chưa có danh mục nào</h3>
                            <p className="mb-4 text-sm text-slate-500">Bắt đầu bằng cách tạo danh mục đầu tiên</p>
                            <Button onClick={handleCreate} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                <Plus className="mr-2 h-4 w-4" />
                                Tạo danh mục
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {categories
                                .filter((cat) => !cat.parentId) // Chỉ hiển thị categories gốc (không có parent)
                                .map((category) => (
                                    <CategoryTreeItem key={category.id} category={category} level={0} expandedIds={expandedIds} onToggleExpand={handleToggleExpand} onEdit={handleEdit} onDelete={setDeleteCategory} onAddChild={handleAddChild} onToggleActive={handleToggleActive} />
                                ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Category Dialog */}
            <CategoryDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} category={editingCategory} parentId={parentIdForNew} onSave={handleSave} isLoading={isSaving} />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa vĩnh viễn danh mục</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn <strong className="text-red-600">xóa vĩnh viễn</strong> danh mục <strong>{deleteCategory?.name}</strong>?
                            <br />
                            <span className="text-red-500">Hành động này không thể hoàn tác! Tất cả danh mục con cũng sẽ bị xóa.</span>
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
