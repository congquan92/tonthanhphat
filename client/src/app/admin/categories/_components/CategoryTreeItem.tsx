"use client";

import { Plus, Pencil, Trash2, ChevronRight, ChevronDown, FolderOpen, GripVertical, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Category } from "@/api/type";
import { cn } from "@/lib/utils";

interface CategoryTreeItemProps {
    category: Category;
    level: number;
    expandedIds: Set<string>;
    onToggleExpand: (id: string) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onAddChild: (parentId: string) => void;
}

export function CategoryTreeItem({ category, level, expandedIds, onToggleExpand, onEdit, onDelete, onAddChild }: CategoryTreeItemProps) {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);

    return (
        <div className="animate-fade-in">
            <div className={cn("group flex items-center gap-2 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800", !category.isActive && "opacity-50")} style={{ paddingLeft: `${level * 24 + 12}px` }}>
                {/* Expand/Collapse Button */}
                <button
                    onClick={() => hasChildren && onToggleExpand(category.id)}
                    className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors", hasChildren ? "hover:bg-slate-200 dark:hover:bg-slate-700" : "cursor-default")}
                >
                    {hasChildren ? isExpanded ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" /> : <div className="h-4 w-4" />}
                </button>

                {/* Drag Handle */}
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />

                {/* Icon */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                </div>

                {/* Name & Info */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="truncate font-medium text-slate-900 dark:text-white">{category.name}</span>
                        {!category.isActive && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">Ẩn</span>}
                    </div>
                    <span className="text-xs text-slate-400">{category.slug}</span>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600" onClick={() => onAddChild(category.id)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => onEdit(category)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDelete(category)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                <div className="animate-slide-down">
                    {category.children!.map((child) => (
                        <CategoryTreeItem key={child.id} category={child} level={level + 1} expandedIds={expandedIds} onToggleExpand={onToggleExpand} onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild} />
                    ))}
                </div>
            )}
        </div>
    );
}
