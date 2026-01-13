"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostApi } from "@/api/post.api";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [postId, setPostId] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

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
            const result = await PostApi.uploadImageFromFile(file, "posts");
            if (result.success) {
                setFormData((prev) => ({
                    ...prev,
                    thumbnail: result.data.url,
                    imagePublicId: result.data.publicId,
                }));
                toast.success("Upload ảnh thành công");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload ảnh thất bại");
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
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/posts">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Chỉnh Sửa Bài Viết</h1>
                        <p className="text-sm text-slate-500">Cập nhật nội dung bài viết</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50">
                            <CardHeader>
                                <CardTitle>Nội Dung</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </label>
                                    <Input value={formData.title} onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))} placeholder="Nhập tiêu đề bài viết" required />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Slug</label>
                                    <Input value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} placeholder="slug-bai-viet" />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Tóm tắt</label>
                                    <textarea value={formData.excerpt} onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))} placeholder="Tóm tắt ngắn về bài viết" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Nội dung</label>
                                    <textarea value={formData.content} onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))} placeholder="Nhập nội dung bài viết (HTML)" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none" rows={15} />
                                    <p className="text-xs text-slate-500 mt-1">Hỗ trợ HTML</p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-slate-700 mb-2 block">Tác giả</label>
                                    <Input value={formData.author} onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))} placeholder="Tên tác giả" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Thumbnail */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50">
                            <CardHeader>
                                <CardTitle>Ảnh Đại Diện</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {formData.thumbnail ? (
                                    <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden">
                                        <Image src={formData.thumbnail} alt="Thumbnail" fill className="object-cover" />
                                        <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                                        <Upload className="h-8 w-8 text-slate-400 mb-2" />
                                        <span className="text-sm text-slate-500">{isUploading ? "Đang upload..." : "Click để upload ảnh"}</span>
                                    </label>
                                )}
                            </CardContent>
                        </Card>

                        {/* Settings */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50">
                            <CardHeader>
                                <CardTitle>Cài Đặt</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-medium text-slate-700">Xuất bản</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm font-medium text-slate-700">Đánh dấu nổi bật</span>
                                </label>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50">
                            <CardContent className="p-4 space-y-2">
                                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white" disabled={isLoading}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isLoading ? "Đang cập nhật..." : "Cập Nhật Bài Viết"}
                                </Button>
                                <Link href="/admin/posts" className="block">
                                    <Button type="button" variant="outline" className="w-full">
                                        Hủy
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
