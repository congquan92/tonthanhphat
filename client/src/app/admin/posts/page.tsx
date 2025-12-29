import { FileText, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PostsPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Bài viết</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Quản lý tin tức và bài viết blog</p>
                </div>
            </div>

            {/* Coming Soon Card */}
            <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800 dark:shadow-slate-900/50">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/10 to-emerald-500/10">
                        <FileText className="h-10 w-10 text-teal-500" />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">Tính năng đang phát triển</h2>
                    <p className="mb-6 max-w-md text-sm text-slate-500 dark:text-slate-400">Trang quản lý bài viết sẽ sớm được ra mắt. Bạn sẽ có thể tạo, chỉnh sửa và xuất bản bài viết tại đây.</p>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="h-4 w-4" />
                        <span>Coming Soon</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
