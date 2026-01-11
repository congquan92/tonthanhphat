"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ProductPreviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    productData: {
        name: string;
        shortDesc?: string;
        description?: string;
        thumbnail?: string;
        images?: string[];
        specs?: { key: string; value: string }[];
        category?: {
            name: string;
        };
    };
}

export function ProductPreviewDialog({ isOpen, onClose, productData }: ProductPreviewDialogProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const displayImages = productData.images && productData.images.length > 0 
        ? productData.images 
        : productData.thumbnail 
        ? [productData.thumbnail]
        : [];

    // Handle ESC key to close
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Xem trước sản phẩm</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Preview Content */}
                <div className="space-y-6">
                    {/* Main Product Section */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Left - Images */}
                        <div>
                            {displayImages.length > 0 ? (
                                <div className="space-y-4">
                                    {/* Main image */}
                                    <div className="aspect-square overflow-hidden rounded-xl border bg-gray-50">
                                        <img
                                            src={displayImages[currentImageIndex]}
                                            alt={productData.name}
                                            className="h-full w-full object-contain"
                                        />
                                    </div>
                                    {/* Thumbnails */}
                                    {displayImages.length > 1 && (
                                        <div className="grid grid-cols-5 gap-2">
                                            {displayImages.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`aspect-square overflow-hidden rounded-lg border-2 ${
                                                        idx === currentImageIndex
                                                            ? "border-blue-500"
                                                            : "border-transparent hover:border-gray-300"
                                                    }`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`${productData.name} ${idx + 1}`}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex aspect-square items-center justify-center rounded-xl border bg-gray-50">
                                    <p className="text-gray-400">Chưa có hình ảnh</p>
                                </div>
                            )}
                        </div>

                        {/* Right - Info */}
                        <div>
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{productData.name || "Tên sản phẩm"}</h1>

                            {productData.category && (
                                <div className="mb-4">
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                        {productData.category.name}
                                    </span>
                                </div>
                            )}

                            {productData.shortDesc && (
                                <p className="mb-6 leading-relaxed text-gray-600 dark:text-gray-300">{productData.shortDesc}</p>
                            )}

                            {/* Specifications */}
                            {productData.specs && productData.specs.length > 0 && (
                                <div className="mb-6 border">
                                    <div className="border-b bg-gray-50 px-4 py-3 dark:bg-slate-800">
                                        <h2 className="font-bold text-gray-900 dark:text-white">Thông số sản phẩm</h2>
                                    </div>
                                    <div className="divide-y">
                                        {productData.specs.map((spec, idx) => (
                                            <div key={idx} className="grid grid-cols-2 gap-4 px-4 py-3">
                                                <span className="text-gray-700 dark:text-gray-300">{spec.key}:</span>
                                                <span className="text-right font-medium text-gray-900 dark:text-white">
                                                    {spec.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description Tab */}
                    {productData.description && (
                        <div className="border">
                            <div className="flex border-b">
                                <div className="bg-gray-900 px-6 py-3 font-medium text-white">Thông tin sản phẩm</div>
                            </div>
                            <div className="p-6">
                                <div
                                    className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 
                                    dark:prose-headings:text-white dark:prose-p:text-gray-300"
                                    dangerouslySetInnerHTML={{ __html: productData.description }}
                                />
                            </div>
                        </div>
                    )}

                    {!productData.description && (
                        <div className="rounded-xl border p-6 text-center">
                        <p className="text-gray-500">Chưa có mô tả chi tiết</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
