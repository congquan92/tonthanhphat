"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, RefreshCw, Search, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PostApi, Post } from "@/api/post.api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const POSTS_PER_PAGE = 20;
export default function PostsAdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [deletePost, setDeletePost] = useState<Post | null>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    // Fetch data
    const fetchPosts = async () => {
        try {
            setIsLoading(true);
            const response = await PostApi.getAllPostsAdmin(currentPage, POSTS_PER_PAGE, searchTerm || undefined, filterStatus || undefined);
            setPosts(response.data || []);
            if (response.pagination) {
                setTotalPages(response.pagination.totalPages);
                setTotal(response.pagination.total);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
            toast.error("Không thể tải dữ liệu");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [currentPage, searchTerm, filterStatus]);

    // Toggle published status
    const togglePublished = async (post: Post) => {
        try {
            await PostApi.updatePost(post.id, { isPublished: !post.isPublished });
            setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, isPublished: !p.isPublished } : p)));
            toast.success(post.isPublished ? "Đã ẩn bài viết" : "Đã xuất bản bài viết");
        } catch (error) {
            console.error("Failed to toggle published status:", error);
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    // Toggle featured status
    const toggleFeatured = async (post: Post) => {
        try {
            await PostApi.updatePost(post.id, { isFeatured: !post.isFeatured });
            setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, isFeatured: !p.isFeatured } : p)));
            toast.success(post.isFeatured ? "Đã bỏ nổi bật" : "Đã đánh dấu nổi bật");
        } catch (error) {
            console.error("Failed to toggle featured status:", error);
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    // Delete post
    const handleDelete = async () => {
        if (!deletePost) return;
        try {
            await PostApi.hardDeletePost(deletePost.id);
            toast.success("Đã xóa vĩnh viễn bài viết");
            setDeletePost(null);
            fetchPosts();
        } catch (error) {
            console.error("Failed to delete post:", error);
            toast.error("Không thể xóa bài viết");
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
    };

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Quản lý Bài viết</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Thêm, sửa, xóa bài viết và quản lý tin tức ({total} bài viết)</p>
                </div>
                <Link href="/admin/posts/new">
                    <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm bài viết
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <>
                    <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800">
                        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Tìm kiếm bài viết..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="published">Đã xuất bản</option>
                                <option value="draft">Bản nháp</option>
                            </select>
                            <Button variant="ghost" onClick={fetchPosts} className="shrink-0">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Làm mới
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800">
                        <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-700">
                            <CardTitle className="text-lg font-semibold">
                                Danh sách bài viết (Trang {currentPage}/{totalPages})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {posts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <FileText className="mb-4 h-16 w-16 text-slate-300" />
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">Chưa có bài viết nào</h3>
                                    <p className="mb-4 text-sm text-slate-500">Bắt đầu bằng cách thêm bài viết đầu tiên</p>
                                    <Link href="/admin/posts/new">
                                        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Thêm bài viết
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Bài viết</th>
                                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Tác giả</th>
                                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Nổi bật</th>
                                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Trạng thái</th>
                                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                                {posts.map((post) => (
                                                    <tr key={post.id} className={cn("transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50", !post.isPublished && "opacity-50")}>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                                                    {post.thumbnail ? (
                                                                        <Image src={post.thumbnail} alt={post.title} fill className="object-cover" />
                                                                    ) : (
                                                                        <div className="flex h-full w-full items-center justify-center">
                                                                            <FileText className="h-6 w-6 text-slate-400" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="max-w-md">
                                                                    <p className="font-medium text-slate-900 dark:text-white line-clamp-2">{post.title}</p>
                                                                    <p className="text-xs text-slate-400 mt-1">{post.publishedAt ? formatDate(post.publishedAt) : "Chưa xuất bản"}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-sm text-slate-600">{post.author || "—"}</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <button onClick={() => toggleFeatured(post)} className={cn("rounded-full p-1.5 transition-colors", post.isFeatured ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-400 hover:text-amber-500")}>
                                                                <Star className={cn("h-4 w-4", post.isFeatured && "fill-current")} />
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <button onClick={() => togglePublished(post)} className={cn("rounded-full p-1.5 transition-colors", post.isPublished ? "bg-emerald-100 text-emerald-500" : "bg-slate-100 text-slate-400")}>
                                                                {post.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                            </button>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center justify-end gap-1">
                                                                <Link href={`/admin/posts/${post.id}`}>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => setDeletePost(post)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex justify-center items-center gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-700">
                                            {canGoPrevious ? (
                                                <button onClick={() => setCurrentPage((p) => p - 1)} className="flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-700 font-medium">
                                                    <ChevronLeft size={18} />
                                                    Trước
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1 px-4 py-2 border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed">
                                                    <ChevronLeft size={18} />
                                                    Trước
                                                </div>
                                            )}

                                            <div className="flex gap-2">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                    <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 border font-medium transition-colors ${page === currentPage ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}>
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            {canGoNext ? (
                                                <button onClick={() => setCurrentPage((p) => p + 1)} className="flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-700 font-medium">
                                                    Sau
                                                    <ChevronRight size={18} />
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-1 px-4 py-2 border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed">
                                                    Sau
                                                    <ChevronRight size={18} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xóa vĩnh viễn bài viết</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn <strong className="text-red-600">xóa vĩnh viễn</strong> bài viết <strong>{deletePost?.title}</strong>?
                            <br />
                            <span className="text-red-500">Hành động này không thể hoàn tác!</span>
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
