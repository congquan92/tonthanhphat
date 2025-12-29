"use client";

import { cn } from "@/lib/utils";

interface TabProps {
    tabs: { id: string; label: string; icon: React.ElementType }[];
    activeTab: string;
    onTabChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabProps) {
    return (
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn("flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all", activeTab === tab.id ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300")}
                >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
