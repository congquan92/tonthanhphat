import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { Banner } from "@/api/banner.api";

interface BannerListProps {
    banners: Banner[];
    onEdit: (banner: Banner) => void;
    onDelete: (banner: Banner) => void;
    onToggleActive: (banner: Banner) => void;
}

export function BannerList({ banners, onEdit, onDelete, onToggleActive }: BannerListProps) {
    const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Preview</th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Alt Text</th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Thứ tự</th>
                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">Trạng thái</th>
                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {sortedBanners.map((banner) => (
                        <tr key={banner.id} className={cn("transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50", !banner.isActive && "opacity-50")}>
                            {/* Image Preview */}
                            <td className="px-4 py-3">
                                <div className="relative h-16 w-32 overflow-hidden rounded-lg bg-slate-100">
                                    <Image src={banner.imageUrl} alt={banner.alt} fill className="object-cover" sizes="128px" />
                                </div>
                            </td>
                            {/* Alt Text */}
                            <td className="px-4 py-3">
                                <p className="font-medium text-slate-900 dark:text-white">{banner.alt}</p>
                            </td>
                            {/* Order */}
                            <td className="px-4 py-3 text-center">
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">{banner.order}</span>
                            </td>
                            {/* Active */}
                            <td className="px-4 py-3 text-center">
                                <button onClick={() => onToggleActive(banner)} className={cn("rounded-full p-1.5 transition-colors", banner.isActive ? "bg-emerald-100 text-emerald-500" : "bg-slate-100 text-slate-400")}>
                                    {banner.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                </button>
                            </td>
                            {/* Actions */}
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-end gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => onEdit(banner)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => onDelete(banner)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
