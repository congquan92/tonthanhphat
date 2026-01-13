import { PostApi } from "@/api/post.api";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Calendar, User } from "lucide-react";

const POSTS_PER_PAGE = 12;

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const postsRes = await PostApi.getAllPosts(currentPage, POSTS_PER_PAGE);

    const posts = postsRes.data || [];
    const pagination = postsRes.pagination || { page: 1, pageSize: 12, total: 0, totalPages: 0 };

    // Format date helper
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="border-b bg-gray-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-gray-900">
                            Trang chủ
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Tin tức</span>
                    </div>
                </div>
            </div>

            {/* Page Title */}
            <div className="border-b">
                <div className="container mx-auto p-4">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 uppercase">Tin Tức & Kiến Thức</h1>
                    <p className="text-sm text-gray-600 mt-1">Cập nhật tin tức mới nhất về sản phẩm và công ty</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 md:py-12">
                {/* Posts Grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">Chưa có bài viết nào</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post: any) => (
                                <Link key={post.id} href={`/tin-tuc/${post.slug}`} className="group">
                                    <div className="bg-white border border-gray-200 hover:shadow-lg transition-shadow h-full flex flex-col">
                                        {/* Post Image */}
                                        <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                            {post.thumbnail ? (
                                                <Image src={post.thumbnail} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    <span className="text-4xl">📰</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Post Info */}
                                        <div className="p-4 flex flex-col flex-1">
                                            {/* Meta */}
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                                {post.publishedAt && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        <span>{formatDate(post.publishedAt)}</span>
                                                    </div>
                                                )}
                                                {post.author && (
                                                    <div className="flex items-center gap-1">
                                                        <User size={14} />
                                                        <span>{post.author}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">{post.title}</h3>

                                            {/* Excerpt */}
                                            {post.excerpt && <p className="text-sm text-gray-600 line-clamp-3 mb-3 flex-1">{post.excerpt}</p>}

                                            {/* Read More */}
                                            <div className="text-gray-900 font-medium text-sm group-hover:underline mt-auto">Đọc thêm →</div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-12 flex justify-center items-center gap-2">
                                {currentPage > 1 ? (
                                    <Link href={`/tin-tuc?page=${currentPage - 1}`} className="flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-700 font-medium">
                                        <ChevronLeft size={18} />
                                        Trước
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-1 px-4 py-2 border border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed">
                                        <ChevronLeft size={18} />
                                        Trước
                                    </div>
                                )}

                                {/* Page Numbers */}
                                <div className="flex gap-2">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={`/tin-tuc?page=${page}`}
                                            className={`px-4 py-2 border font-medium transition-colors ${page === currentPage ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </div>

                                {currentPage < pagination.totalPages ? (
                                    <Link href={`/tin-tuc?page=${currentPage + 1}`} className="flex items-center gap-1 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-700 font-medium">
                                        Sau
                                        <ChevronRight size={18} />
                                    </Link>
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
            </div>
        </div>
    );
}
