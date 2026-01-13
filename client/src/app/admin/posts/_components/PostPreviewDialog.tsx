"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface PostPreviewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    postData: {
        title: string;
        excerpt?: string;
        content?: string;
        thumbnail?: string;
        author?: string;
    };
}

export function PostPreviewDialog({ isOpen, onClose, postData }: PostPreviewDialogProps) {
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
            <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Xem trước bài viết</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Preview Content */}
                <article className="space-y-6">
                    {/* Thumbnail */}
                    {postData.thumbnail && (
                        <div className="aspect-video overflow-hidden rounded-xl border bg-gray-50">
                            <img
                                src={postData.thumbnail}
                                alt={postData.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {postData.title || "Tiêu đề bài viết"}
                    </h1>

                    {/* Author & Meta */}
                    {postData.author && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>Tác giả: {postData.author}</span>
                        </div>
                    )}

                    {/* Excerpt */}
                    {postData.excerpt && (
                        <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 italic border-l-4 border-blue-500 pl-4">
                            {postData.excerpt}
                        </p>
                    )}

                    {/* Content */}
                    {postData.content ? (
                        <div className="border-t pt-6">
                            <div
                                className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 
                                dark:prose-headings:text-white dark:prose-p:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: postData.content }}
                            />
                        </div>
                    ) : (
                        <div className="rounded-xl border p-6 text-center">
                            <p className="text-gray-500">Chưa có nội dung</p>
                        </div>
                    )}
                </article>
            </div>
        </div>
    );
}
