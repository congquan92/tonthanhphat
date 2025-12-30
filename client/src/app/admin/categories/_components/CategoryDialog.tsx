"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/api/type";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | null;
    parentId?: string | null;
    onSave: (data: CreateCategoryInput | UpdateCategoryInput) => Promise<void>;
    isLoading?: boolean;
}

export function CategoryDialog({ isOpen, onClose, category, parentId, onSave, isLoading }: CategoryDialogProps) {
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setSlug(category.slug);
            setIsActive(category.isActive);
        } else {
            setName("");
            setSlug("");
            setIsActive(true);
        }
    }, [category, isOpen]);

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
        if (!category) {
            setSlug(generateSlug(value));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !slug.trim()) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        const data: CreateCategoryInput | UpdateCategoryInput = {
            name: name.trim(),
            slug: slug.trim(),
            isActive,
            ...(parentId && !category ? { parentId } : {}),
        };

        await onSave(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-md animate-scale-in rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">{category ? "Chỉnh sửa danh mục" : parentId ? "Thêm danh mục con" : "Thêm danh mục mới"}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Tên danh mục</Label>
                        <Input id="name" value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Nhập tên danh mục..." className="mt-1.5" autoFocus />
                    </div>

                    <div>
                        <Label htmlFor="slug">Slug (URL)</Label>
                        <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="ten-danh-muc" className="mt-1.5" />
                    </div>

                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setIsActive(!isActive)} className={cn("flex h-6 w-11 items-center rounded-full transition-colors", isActive ? "bg-blue-500" : "bg-slate-300")}>
                            <span className={cn("h-5 w-5 transform rounded-full bg-white shadow-md transition-transform", isActive ? "translate-x-5" : "translate-x-0.5")} />
                        </button>
                        <Label>Hiển thị danh mục</Label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" disabled={isLoading} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {category ? "Lưu thay đổi" : "Tạo danh mục"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
