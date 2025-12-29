"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, X, Plus, Trash2, RefreshCw, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductApi, CreateProductInput } from "@/api/product.api";
import { CategoryApi } from "@/api/category.api";
import { Category } from "@/api/type";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<CreateProductInput>({
        name: "",
        slug: "",
        shortDesc: "",
        description: "",
        thumbnail: "",
        images: [],
        specs: [],
        categoryId: "",
        order: 0,
        isActive: true,
        isFeatured: false,
    });

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await CategoryApi.getAllCategoriesAdmin();
                setCategories(res.data || []);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleNameChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            name: value,
            slug: generateSlug(value),
        }));
    };

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64 = reader.result as string;
                try {
                    toast.loading("Đang upload ảnh...", { id: "upload" });
                    const res = await ProductApi.uploadImage(base64);
                    if (res.success) {
                        setFormData((prev) => ({
                            ...prev,
                            images: [...(prev.images || []), res.data.url],
                            thumbnail: prev.thumbnail || res.data.url,
                        }));
                        toast.success("Upload thành công", { id: "upload" });
                    }
                } catch (error) {
                    toast.error("Upload thất bại", { id: "upload" });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image
    const removeImage = (url: string) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images?.filter((img) => img !== url),
            thumbnail: prev.thumbnail === url ? prev.images?.find((img) => img !== url) || "" : prev.thumbnail,
        }));
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
        if (!formData.name.trim() || !formData.slug.trim()) {
            toast.error("Vui lòng nhập tên và slug sản phẩm");
            return;
        }

        try {
            setIsLoading(true);
            await ProductApi.createProduct({
                ...formData,
                categoryId: formData.categoryId || undefined,
                specs: formData.specs?.filter((s) => s.key && s.value),
            });
            toast.success("Tạo sản phẩm thành công");
            router.push("/admin/products");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể tạo sản phẩm");
        } finally {
            setIsLoading(false);
        }
    };

    // Get product categories - only categories that have a parentId (are children/product categories)
    const productCategories = categories
        .filter((cat) => cat.parentId) // Chỉ lấy categories con (có parentId)
        .map((cat) => ({ id: cat.id, name: cat.name }))
        .sort((a, b) => a.name.localeCompare(b.name, "vi"));

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
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Thêm sản phẩm mới</h1>
                    <p className="text-sm text-slate-500">Nhập thông tin sản phẩm và upload hình ảnh</p>
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
                                    <Input id="name" value={formData.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Nhập tên sản phẩm..." className="mt-1.5" />
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
                                <CardDescription>Upload ảnh sản phẩm. Click vào ảnh để đặt làm ảnh đại diện.</CardDescription>
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
                                {formData.specs?.length === 0 && <p className="text-center text-sm text-slate-400 py-4">Chưa có thông số. Click "Thêm" để bắt đầu.</p>}
                                {formData.specs?.map((spec, index) => (
                                    <div key={index} className="flex gap-3">
                                        <Input placeholder="Tên thông số (VD: Độ dày)" value={spec.key} onChange={(e) => updateSpec(index, "key", e.target.value)} className="w-1/3" />
                                        <Input placeholder="Giá trị (VD: 0.5mm)" value={spec.value} onChange={(e) => updateSpec(index, "value", e.target.value)} className="flex-1" />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeSpec(index)} className="shrink-0 text-red-500 hover:text-red-600">
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
                                <Button type="submit" disabled={isLoading} className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Tạo sản phẩm
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Category */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg dark:bg-slate-800">
                            <CardHeader>
                                <CardTitle>Danh mục</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                                >
                                    <option value="">Chọn danh mục</option>
                                    {productCategories.map((cat) => (
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
        </div>
    );
}
