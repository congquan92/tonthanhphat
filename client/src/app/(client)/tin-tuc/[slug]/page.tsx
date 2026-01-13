import { PostApi } from "@/api/post.api";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch post data
    const postRes = await PostApi.getPostBySlug(slug);
    if (!postRes.success || !postRes.data) {
        notFound();
    }

    const post = postRes.data;

    // Fetch featured posts for recommendations
    const featuredRes = await PostApi.getFeaturedPosts(3);
    const featuredPosts = featuredRes.data || [];

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
                        <Link href="/tin-tuc" className="hover:text-gray-900">
                            Tin tức
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium line-clamp-1">{post.title}</span>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="container mx-auto px-4 py-4">
                <Link href="/tin-tuc" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={16} />
                    <span>Quay lại trang tin tức</span>
                </Link>
            </div>

            {/* Post Content */}
            <div className="container mx-auto px-4 pb-12">
                <div className="max-w-4xl mx-auto">
                    {/* Title */}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
                        {post.publishedAt && (
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{formatDate(post.publishedAt)}</span>
                            </div>
                        )}
                        {post.author && (
                            <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>{post.author}</span>
                            </div>
                        )}
                    </div>

                    {/* Featured Image */}
                    {post.thumbnail && (
                        <div className="relative aspect-video bg-gray-100 mb-8 overflow-hidden">
                            <Image src={post.thumbnail} alt={post.title} fill className="object-cover" priority />
                        </div>
                    )}

                    {/* Excerpt */}
                    {post.excerpt && <div className="text-lg text-gray-700 mb-6 font-medium italic border-l-4 border-gray-900 pl-4">{post.excerpt}</div>}

                    {/* Content */}
                    {post.content && (
                        <div
                            className="prose prose-gray max-w-none
                                prose-headings:font-bold prose-headings:text-gray-900
                                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                                prose-li:text-gray-700 prose-li:mb-2
                                prose-strong:text-gray-900 prose-strong:font-bold
                                prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    )}
                </div>

                {/* Recommended Posts */}
                {featuredPosts.length > 0 && (
                    <div className="max-w-4xl mx-auto mt-16 pt-8 border-t">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 uppercase">Bài Viết Liên Quan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredPosts.slice(0, 3).map((relatedPost: any) => (
                                <Link key={relatedPost.id} href={`/tin-tuc/${relatedPost.slug}`} className="group">
                                    <div className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
                                        {/* Image */}
                                        <div className="relative aspect-video bg-gray-100 overflow-hidden">
                                            {relatedPost.thumbnail ? (
                                                <Image src={relatedPost.thumbnail} alt={relatedPost.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    <span className="text-2xl">📰</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-gray-700 transition-colors">{relatedPost.title}</h3>
                                            {relatedPost.publishedAt && <p className="text-xs text-gray-500 mt-2">{formatDate(relatedPost.publishedAt)}</p>}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
