import { useState, useEffect } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
import { CategoryApi, type Category, type CreateCategoryInput } from "@/api/category.api";
import { toast } from "sonner";

interface CategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    category: Category | null;
    categories: Category[];
    onSuccess: () => void;
}

export function CategoryDialog({ isOpen, onClose, category, categories, onSuccess }: CategoryDialogProps) {
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState<CreateCategoryInput>({
        name: "",
        slug: "",
        order: 0,
        isActive: true,
    });

    // Set initial data when dialog opens
    useEffect(() => {
        if (isOpen) {
            if (category) {
                // Editing existing category
                setFormData({
                    name: category.name,
                    slug: category.slug,
                    order: category.order,
                    isActive: category.isActive,
                });
            } else {
                // Creating new category
                const nextOrder = getNextOrder();
                setFormData({
                    name: "",
                    slug: "",
                    order: nextOrder,
                    isActive: true,
                });
            }
        }
    }, [isOpen, category]);

    const getNextOrder = () => {
        if (categories.length === 0) return 1;
        const maxOrder = Math.max(...categories.map((c) => c.order));
        return maxOrder + 1;
    };

    // Auto-generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-");
    };

    const handleNameChange = (name: string) => {
        setFormData({ ...formData, name, slug: generateSlug(name) });
    };

    const handleSubmit = async () => {
        if (isSaving) return;
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên danh mục");
            return;
        }
        if (!formData.slug.trim()) {
            toast.error("Vui lòng nhập slug");
            return;
        }

        const toastId = toast.loading(category ? "Đang cập nhật danh mục..." : "Đang tạo danh mục...");

        try {
            setIsSaving(true);

            if (category) {
                await CategoryApi.updateCategory(category.id, formData);
                toast.success("Cập nhật danh mục thành công!", { id: toastId });
            } else {
                await CategoryApi.createCategory(formData);
                toast.success("Tạo danh mục mới thành công!", { id: toastId });
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || (category ? "Không thể cập nhật danh mục" : "Không thể tạo danh mục");
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="rounded-2xl max-w-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>{category ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</AlertDialogTitle>
                    <AlertDialogDescription>Nhập thông tin danh mục. Slug sẽ tự động tạo từ tên.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Tên danh mục*</Label>
                        <Input id="name" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Ví dụ: Tôn 5 Sóng" disabled={isSaving} />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL)*</Label>
                        <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="ton-5-song" disabled={isSaving} />
                        <p className="text-xs text-slate-500">Tự động tạo từ tên, có thể chỉnh sửa thủ công</p>
                    </div>

                    {/* Order */}
                    <div className="space-y-2">
                        <Label htmlFor="order">Thứ tự hiển thị</Label>
                        <Input id="order" type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} placeholder="0" disabled={isSaving} />
                        <p className="text-xs text-slate-500">Số càng nhỏ, hiển thị càng trước</p>
                    </div>

                    {/* Active */}
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="active" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4" disabled={isSaving} />
                        <Label htmlFor="active" className="cursor-pointer">
                            Hiển thị danh mục
                        </Label>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSaving} className="rounded-xl">
                        Hủy
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleSubmit} disabled={isSaving} className="rounded-xl bg-blue-500 text-white hover:bg-blue-600">
                        {isSaving ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                {category ? "Đang cập nhật..." : "Đang tạo..."}
                            </>
                        ) : (
                            <>{category ? "Cập nhật" : "Tạo danh mục"}</>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
