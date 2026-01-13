"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Save, Loader2, Eye, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PostApi } from "@/api/post.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { PostPreviewDialog } from "../_components";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [postId, setPostId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        thumbnail: "",
        imagePublicId: "",
        author: "",
        isPublished: false,
        isFeatured: false,
    });

    useEffect(() => {
        const loadPost = async () => {
            const { id } = await params;
            setPostId(id);

            try {
                setIsFetching(true);
                const response = await PostApi.getPostById(id);
                if (response.success && response.data) {
                    const post = response.data;
                    setFormData({
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt || "",
                        content: post.content || "",
                        thumbnail: post.thumbnail || "",
                        imagePublicId: post.imagePublicId || "",
                        author: post.author || "",
                        isPublished: post.isPublished,
                        isFeatured: post.isFeatured,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch post:", error);
                toast.error("Không thể tải bài viết");
            } finally {
                setIsFetching(false);
            }
        };

        loadPost();
    }, [params]);

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Delete old image if exists
        if (formData.imagePublicId) {
            try {
                await PostApi.deleteImage(formData.imagePublicId);
            } catch (error) {
                console.error("Delete old image error:", error);
            }
        }

        try {
            setIsUploading(true);
            toast.loading("Đang upload ảnh...", { id: "upload" });
            const result = await PostApi.uploadImageFromFile(file, "posts");
            if (result.success) {
                setFormData((prev) => ({
                    ...prev,
                    thumbnail: result.data.url,
                    imagePublicId: result.data.publicId,
                }));
                toast.success("Upload ảnh thành công", { id: "upload" });
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload ảnh thất bại", { id: "upload" });
        } finally {
            setIsUploading(false);
        }
    };

    // Remove image
    const handleRemoveImage = async () => {
        if (formData.imagePublicId) {
            try {
                await PostApi.deleteImage(formData.imagePublicId);
            } catch (error) {
                console.error("Delete image error:", error);
            }
        }
        setFormData((prev) => ({
            ...prev,
            thumbnail: "",
            imagePublicId: "",
        }));
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.slug) {
            toast.error("Vui lòng nhập tiêu đề");
            return;
        }

        try {
            setIsLoading(true);
            await PostApi.updatePost(postId, formData);
            toast.success("Cập nhật bài viết thành công");
            router.push("/admin/posts");
        } catch (error) {
            console.error("Update post error:", error);
            toast.error("Cập nhật bài viết thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/posts">
                    <Button variant="ghost" size="icon" className="rounded-xl">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chỉnh sửa bài viết</h1>
                    <p className="text-sm text-slate-500">Cập nhật nội dung bài viết với editor chuyên nghiệp</p>
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
                                    <Label htmlFor="title">Tiêu đề *</Label>
                                    <Input id="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Nhập tiêu đề bài viết..." className="mt-1.5" />
                                </div>
                                <div>
                                    <Label htmlFor="slug">Slug (URL) *</Label>
                                    <Input id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="slug-bai-viet" className="mt-1.5" />
                                </div>
                                <div>
                                    <Label htmlFor="excerpt">Tóm tắt</Label>
                                    <Input id="excerpt" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Tóm tắt ngắn gọn cho listing..." className="mt-1.5" />
                                </div>
                                <div>
                                    <Label htmlFor="author">Tác giả</Label>
                                    <Input id="author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder="Tên tác giả" className="mt-1.5" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rich Text Editor */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg dark:bg-slate-800">
                            <CardHeader>
                                <CardTitle>Nội dung bài viết</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RichTextEditor
                                    value={formData.content}
                                    onChange={(html) => setFormData({ ...formData, content: html })}
                                    placeholder="Bắt đầu viết nội dung của bạn... Sử dụng toolbar để định dạng văn bản, thêm ảnh, link và nhiều hơn nữa!"
                                />
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
                                    <Label>Xuất bản</Label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                                        className={cn("flex h-6 w-11 items-center rounded-full transition-colors", formData.isPublished ? "bg-emerald-500" : "bg-slate-300")}
                                    >
                                        <span className={cn("h-5 w-5 transform rounded-full bg-white shadow-md transition-transform", formData.isPublished ? "translate-x-5" : "translate-x-0.5")} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Bài viết nổi bật</Label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                                        className={cn("flex h-6 w-11 items-center rounded-full transition-colors", formData.isFeatured ? "bg-amber-500" : "bg-slate-300")}
                                    >
                                        <span className={cn("h-5 w-5 transform rounded-full bg-white shadow-md transition-transform", formData.isFeatured ? "translate-x-5" : "translate-x-0.5")} />
                                    </button>
                                </div>
                                <Button type="button" onClick={() => setIsPreviewOpen(true)} variant="outline" className="w-full rounded-xl mb-3">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Xem trước
                                </Button>
                                <Button type="submit" disabled={isLoading} className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Cập nhật bài viết
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Thumbnail */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg dark:bg-slate-800">
                            <CardHeader>
                                <CardTitle>Ảnh đại diện</CardTitle>
                                <CardDescription>Upload ảnh đại diện cho bài viết.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                                {formData.thumbnail ? (
                                    <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-transparent">
                                        <Image src={formData.thumbnail} alt="Thumbnail" fill className="object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                                            <Button type="button" variant="ghost" size="icon" onClick={handleRemoveImage} className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-red-500">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition-colors hover:border-blue-500 hover:text-blue-500"
                                        disabled={isUploading}
                                    >
                                        <Upload className="h-8 w-8" />
                                        <span className="text-sm">{isUploading ? "Đang upload..." : "Upload ảnh"}</span>
                                    </button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>

            {/* Preview Dialog */}
            <PostPreviewDialog
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                postData={{
                    title: formData.title || "Tiêu đề bài viết",
                    excerpt: formData.excerpt,
                    content: formData.content,
                    thumbnail: formData.thumbnail,
                    author: formData.author,
                }}
            />
        </div>
    );
}
