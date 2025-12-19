"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { AdminSidebar, DesktopOnlyProvider } from "@/components/admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <DesktopOnlyProvider>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                {/* Sidebar */}
                <AdminSidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

                {/* Header */}
                {/* <AdminHeader isSidebarCollapsed={isSidebarCollapsed} /> */}

                {/* Main Content */}
                <main className={cn("min-h-screen pt-16 transition-all duration-300", isSidebarCollapsed ? "pl-18" : "pl-65")}>
                    <div className="p-6 lg:p-8">{children}</div>
                </main>
            </div>
        </DesktopOnlyProvider>
    );
}
