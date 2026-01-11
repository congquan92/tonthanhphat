"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Upload, Trash2, RefreshCw, Image as ImageIcon, Plus, FolderPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductApi, Product, UpdateProductInput } from "@/api/product.api";
import { CategoryApi } from "@/api/category.api";
import { Category } from "@/api/type";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { QuickCategoryDialog } from "../_components";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<UpdateProductInput>({
        name: "",
        slug: "",
        shortDesc: "",
        description: "",
        thumbnail: "",
        images: [],
        imagePublicIds: [], // Track Cloudinary public IDs
        specs: [],
        categoryId: "",
        order: 0,
        isActive: true,
        isFeatured: false,
    });

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await CategoryApi.getAllCategoriesAdmin();
            setCategories(res.data || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    // Fetch product and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [productRes, categoriesRes] = await Promise.all([ProductApi.getProductById(productId), CategoryApi.getAllCategoriesAdmin()]);

                if (productRes.data) {
                    setProduct(productRes.data);
                    setFormData({
                        name: productRes.data.name,
                        slug: productRes.data.slug,
                        shortDesc: productRes.data.shortDesc || "",
                        description: productRes.data.description || "",
                        thumbnail: productRes.data.thumbnail || "",
                        images: productRes.data.images || [],
                        imagePublicIds: productRes.data.imagePublicIds || [], // Load existing publicIds
                        specs: productRes.data.specs || [],
                        categoryId: productRes.data.categoryId || "",
                        order: productRes.data.order || 0,
                        isActive: productRes.data.isActive,
                        isFeatured: productRes.data.isFeatured,
                    });
                }
                setCategories(categoriesRes.data || []);
            } catch (error) {
                console.error("Failed to fetch product:", error);
                toast.error("Không tìm thấy sản phẩm");
                router.push("/admin/products");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [productId, router]);

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            try {
                toast.loading("Đang upload ảnh...", { id: "upload" });
                const res = await ProductApi.uploadImageFromFile(file);
                if (res.success) {
                    setFormData((prev) => ({
                        ...prev,
                        images: [...(prev.images || []), res.data.url],
                        imagePublicIds: [...(prev.imagePublicIds || []), res.data.publicId],
                        thumbnail: prev.thumbnail || res.data.url,
                    }));
                    toast.success("Upload thành công", { id: "upload" });
                }
            } catch (error) {
                console.error("Upload error:", error);
                toast.error("Upload thất bại", { id: "upload" });
            }
        }
    };

    // Remove image
    const removeImage = (url: string) => {
        setFormData((prev) => {
            const index = prev.images?.indexOf(url) ?? -1;
            const newImages = prev.images?.filter((img) => img !== url);
            const newPublicIds = index >= 0 ? prev.imagePublicIds?.filter((_, i) => i !== index) : prev.imagePublicIds;
            return {
                ...prev,
                images: newImages,
                imagePublicIds: newPublicIds,
                thumbnail: prev.thumbnail === url ? newImages?.find((img) => img !== url) || "" : prev.thumbnail,
            };
        });
    };

    // Set as thumbnail
    const setAsThumbnail = (url: string) => {
        setFormData((prev) => ({ ...prev, thumbnail: url }));
    };

    // Add spec
    const addSpec = () => {
        setFormData((prev) => ({
            ...prev,
            specs: [...(prev.specs || []), { key: "", value: "" }],
        }));
    };

    // Update spec
    const updateSpec = (index: number, field: "key" | "value", value: string) => {
        setFormData((prev) => ({
            ...prev,
            specs: prev.specs?.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
        }));
    };

    // Remove spec
    const removeSpec = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            specs: prev.specs?.filter((_, i) => i !== index),
        }));
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name?.trim() || !formData.slug?.trim()) {
            toast.error("Vui lòng nhập tên và slug sản phẩm");
            return;
        }

        // Track newly uploaded images (compare with original product)
        const originalPublicIds = product?.imagePublicIds || [];
        const newlyUploadedPublicIds = formData.imagePublicIds?.filter(
            (id) => !originalPublicIds.includes(id)
        ) || [];

        try {
            setIsSaving(true);
            await ProductApi.updateProduct(productId, {
                ...formData,
                categoryId: formData.categoryId || null,
                specs: formData.specs?.filter((s) => s.key && s.value),
            });
            toast.success("Cập nhật sản phẩm thành công");
            router.push("/admin/products");
        } catch (error: any) {
            // Cleanup newly uploaded images on error
            if (newlyUploadedPublicIds.length > 0) {
                console.log("Cleaning up newly uploaded images due to error...");
                for (const publicId of newlyUploadedPublicIds) {
                    try {
                        await ProductApi.deleteImage(publicId);
                        console.log("Deleted image:", publicId);
                    } catch (cleanupError) {
                        console.error("Failed to cleanup image:", publicId, cleanupError);
                    }
                }
            }
            toast.error(error.response?.data?.message || "Không thể cập nhật sản phẩm");
        } finally {
            setIsSaving(false);
        }
    };



    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon" className="rounded-xl">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chỉnh sửa sản phẩm</h1>
                    <p className="text-sm text-slate-500">{product?.name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Info */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg dark:bg-slate-800">
                            <CardHeader>
                                <CardTitle>Thông tin cơ bản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Tên sản phẩm *</Label>
                                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nhập tên sản phẩm..." className="mt-1.5" />
                                </div>
                                <div>
                                    <Label htmlFor="slug">Slug (URL) *</Label>
                                    <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="ten-san-pham" className="mt-1.5" />
                                </div>
                                <div>
                                    <Label htmlFor="shortDesc">Mô tả ngắn</Label>
                                    <Input id="shortDesc" value={formData.shortDesc} onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })} placeholder="Mô tả ngắn gọn cho listing..." className="mt-1.5" />
                                </div>
                                <div>
                                    <Label htmlFor="description">Mô tả chi tiết</Label>
                                    <textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Mô tả chi tiết sản phẩm (hỗ trợ HTML)..."
                                        rows={6}
                                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Images */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg dark:bg-slate-800">
                            <CardHeader>
                                <CardTitle>Hình ảnh sản phẩm</CardTitle>
                                <CardDescription>Click vào ảnh để đặt làm ảnh đại diện.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                    {formData.images?.map((url, index) => (
                                        <div key={index} className={cn("group relative aspect-square overflow-hidden rounded-xl border-2", url === formData.thumbnail ? "border-blue-500" : "border-transparent")}>
                                            <img src={url} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                                <Button type="button" variant="ghost" size="icon" onClick={() => setAsThumbnail(url)} className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/40">
                                                    <ImageIcon className="h-4 w-4" />
                                                </Button>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(url)} className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-red-500">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            {url === formData.thumbnail && <div className="absolute left-2 top-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">Ảnh đại diện</div>}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-blue-500 hover:text-blue-500">
                                        <Upload className="h-8 w-8" />
                                        <span className="text-sm">Upload ảnh</span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specs */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg dark:bg-slate-800">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Thông số kỹ thuật</CardTitle>
                                    <Button type="button" variant="ghost" size="sm" onClick={addSpec} className="text-blue-600">
                                        <Plus className="mr-1 h-4 w-4" />
                                        Thêm
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {formData.specs?.length === 0 && <p className="text-center text-sm text-slate-400 py-4">Chưa có thông số.</p>}
                                {formData.specs?.map((spec, index) => (
                                    <div key={index} className="flex gap-3">
                                        <Input placeholder="Tên thông số" value={spec.key} onChange={(e) => updateSpec(index, "key", e.target.value)} className="w-1/3" />
                                        <Input placeholder="Giá trị" value={spec.value} onChange={(e) => updateSpec(index, "value", e.target.value)} className="flex-1" />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(index)} className="shrink-0 text-red-500">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg dark:bg-slate-800">
                            <CardHeader>
                                <CardTitle>Xuất bản</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Hiển thị sản phẩm</Label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                        className={cn("flex h-6 w-11 items-center rounded-full transition-colors", formData.isActive ? "bg-emerald-500" : "bg-slate-300")}
                                    >
                                        <span className={cn("h-5 w-5 transform rounded-full bg-white shadow-md transition-transform", formData.isActive ? "translate-x-5" : "translate-x-0.5")} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Sản phẩm nổi bật</Label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                                        className={cn("flex h-6 w-11 items-center rounded-full transition-colors", formData.isFeatured ? "bg-amber-500" : "bg-slate-300")}
                                    >
                                        <span className={cn("h-5 w-5 transform rounded-full bg-white shadow-md transition-transform", formData.isFeatured ? "translate-x-5" : "translate-x-0.5")} />
                                    </button>
                                </div>
                                <Button type="submit" disabled={isSaving} className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Lưu thay đổi
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Category */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg dark:bg-slate-800">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Danh mục</CardTitle>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsCategoryDialogOpen(true)}
                                        className="text-blue-600 hover:text-blue-700"
                                    >
                                        <FolderPlus className="mr-1 h-4 w-4" />
                                        Tạo mới
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <select
                                    value={formData.categoryId || ""}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {categories
                                        .filter((cat) => cat.isActive)
                                        .sort((a, b) => a.name.localeCompare(b.name, "vi"))
                                        .map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                </select>
                            </CardContent>
                        </Card>

                        {/* Order */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg dark:bg-slate-800">
                            <CardHeader>
                                <CardTitle>Thứ tự hiển thị</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} min={0} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>

            {/* Quick Category Dialog */}
            <QuickCategoryDialog
                isOpen={isCategoryDialogOpen}
                onClose={() => setIsCategoryDialogOpen(false)}
                onCategoryCreated={fetchCategories}
            />
        </div>
    );
}
