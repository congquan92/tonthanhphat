"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryApi } from "@/api/category.api";
import { CreateCategoryInput } from "@/api/type";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QuickCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCategoryCreated?: () => void;
}

export function QuickCategoryDialog({ isOpen, onClose, onCategoryCreated }: QuickCategoryDialogProps) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setName("");
            setSlug("");
        }
    }, [isOpen]);

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();
    };

    const handleNameChange = (value: string) => {
        setName(value);
        setSlug(generateSlug(value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !slug.trim()) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        try {
            setIsLoading(true);
            const data: CreateCategoryInput = {
                name: name.trim(),
                slug: slug.trim(),
                isActive: true,
            };
            await CategoryApi.createCategory(data);
            toast.success("Đã tạo danh mục mới");
            onCategoryCreated?.();
            onClose();
        } catch (error: any) {
            console.error("Failed to create category:", error);
            toast.error(error.response?.data?.message || "Không thể tạo danh mục");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">Tạo danh mục mới</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Tên danh mục</Label>
                        <Input id="name" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Nhập tên danh mục..." className="mt-1.5" autoFocus />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ten-danh-muc" className="mt-1.5" />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Tạo danh mục
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
