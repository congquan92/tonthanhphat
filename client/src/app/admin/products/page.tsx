"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, RefreshCw, Search, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ProductApi, Product } from "@/api/product.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

    // Fetch data
    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const productsRes = await ProductApi.getAllProductsAdmin();
            setProducts(productsRes.data || []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            toast.error("Không thể tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Toggle active status
    const toggleActive = async (product: Product) => {
        try {
            await ProductApi.updateProduct(product.id, { isActive: !product.isActive });
            setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, isActive: !p.isActive } : p)));
            toast.success(product.isActive ? "Đã ẩn sản phẩm" : "Đã hiển thị sản phẩm");
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    // Toggle featured status
    const toggleFeatured = async (product: Product) => {
        try {
            await ProductApi.updateProduct(product.id, { isFeatured: !product.isFeatured });
            setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p)));
            toast.success(product.isFeatured ? "Đã bỏ nổi bật" : "Đã đánh dấu nổi bật");
        } catch (error) {
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    // Delete product
    const handleDelete = async () => {
        if (!deleteProduct) return;
        try {
            await ProductApi.deleteProduct(deleteProduct.id);
            setProducts((prev) => prev.filter((p) => p.id !== deleteProduct.id));
            toast.success("Đã xóa sản phẩm");
            setDeleteProduct(null);
        } catch (error) {
            toast.error("Không thể xóa sản phẩm");
        }
    };

    // Get unique category names from products
    const uniqueCategoryNames = Array.from(
        new Set(products.filter((p) => p.category?.name).map((p) => p.category!.name))
    ).sort();

    // Filter products
    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.slug.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || product.category?.name === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Quản lý Sản phẩm</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Thêm, sửa, xóa sản phẩm và quản lý hình ảnh</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm sản phẩm
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input placeholder="Tìm kiếm sản phẩm..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                    >
                        <option value="">Tất cả danh mục</option>
                        {uniqueCategoryNames.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                    <Button variant="ghost" onClick={fetchProducts} className="shrink-0">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Làm mới
                    </Button>
                </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800">
                <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-700">
                    <CardTitle className="text-lg font-semibold">Danh sách sản phẩm ({filteredProducts.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <ImageIcon className="mb-4 h-16 w-16 text-slate-300" />
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Chưa có sản phẩm nào</h3>
                            <p className="mb-4 text-sm text-slate-500">Bắt đầu bằng cách thêm sản phẩm đầu tiên</p>
                            <Link href="/admin/products/new">
                                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Thêm sản phẩm
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Sản phẩm</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Danh mục</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Nổi bật</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Trạng thái</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className={cn("transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50", !product.isActive && "opacity-50")}>
                                            {/* San pham */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                        {product.thumbnail ? (
                                                            <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <ImageIcon className="h-6 w-6 text-slate-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">{product.name}</p>
                                                        <p className="text-xs text-slate-400">{product.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Category */}
                                            <td className="px-4 py-3">
                                                {product.category ? <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{product.category.name}</span> : <span className="text-slate-400">—</span>}
                                            </td>
                                            {/* Featured */}
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => toggleFeatured(product)}
                                                    className={cn("rounded-full p-1.5 transition-colors", product.isFeatured ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-400 hover:text-amber-500")}
                                                >
                                                    <Star className={cn("h-4 w-4", product.isFeatured && "fill-current")} />
                                                </button>
                                            </td>
                                            {/* Active */}
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => toggleActive(product)} className={cn("rounded-full p-1.5 transition-colors", product.isActive ? "bg-emerald-100 text-emerald-500" : "bg-slate-100 text-slate-400")}>
                                                    {product.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                </button>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`/admin/products/${product.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => setDeleteProduct(product)}>
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

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa sản phẩm <strong>"{deleteProduct?.name}"</strong>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-red-500 text-white hover:bg-red-600">
                            Xóa sản phẩm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
