"use client";

import Image from "next/image";
import { FileText, Calendar, User } from "lucide-react";

interface PostPreviewProps {
    title: string;
    excerpt?: string;
    content: string;
    thumbnail?: string;
    author?: string;
}

export default function PostPreview({ title, excerpt, content, thumbnail, author }: PostPreviewProps) {
    const formatDate = () => {
        return new Date().toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <p className="text-white/80 text-sm font-medium mb-1">Xem trước bài viết</p>
                <h2 className="text-2xl font-bold text-white">Live Preview</h2>
            </div>

            {/* Content */}
            <div className="p-8 max-w-4xl mx-auto">
                {/* Thumbnail */}
                {thumbnail && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
                        <Image src={thumbnail} alt={title} fill className="object-cover" />
                    </div>
                )}

                {/* Title */}
                <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">{title || "Tiêu đề bài viết"}</h1>

                {/* Meta */}
                <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-slate-200">
                    {author && (
                        <div className="flex items-center gap-2 text-slate-600">
                            <User className="h-4 w-4" />
                            <span className="text-sm font-medium">{author}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{formatDate()}</span>
                    </div>
                </div>

                {/* Excerpt */}
                {excerpt && (
                    <div className="bg-slate-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8">
                        <p className="text-lg text-slate-700 italic leading-relaxed">{excerpt}</p>
                    </div>
                )}

                {/* Content */}
                {content ? (
                    <div
                        className="prose prose-slate prose-lg max-w-none
                            prose-headings:font-bold prose-headings:text-slate-900
                            prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8
                            prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6
                            prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
                            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
                            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-slate-900 prose-strong:font-bold
                            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
                            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
                            prose-li:text-slate-700 prose-li:mb-2
                            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600
                            prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:text-slate-800
                            prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                            prose-img:rounded-lg prose-img:shadow-md prose-img:my-6"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FileText className="h-16 w-16 text-slate-300 mb-4" />
                        <p className="text-lg font-medium text-slate-500">Chưa có nội dung</p>
                        <p className="text-sm text-slate-400 mt-1">Bắt đầu viết để xem preview</p>
                    </div>
                )}
            </div>
        </div>
    );
}
