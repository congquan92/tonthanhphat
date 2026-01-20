"use client";

import { useState } from "react";
import { Building2, Lock } from "lucide-react";
import { ContactInfoTab } from "./_components/ContactInfoTab";
import { SecurityTab } from "./_components/SecurityTab";
import { Tabs } from "./_components/Tabs";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("contact");

    const tabs = [
        { id: "contact", label: "Thông tin liên hệ", icon: Building2 },
        { id: "security", label: "Bảo mật", icon: Lock },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">Cài đặt</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Quản lý thông tin công ty và cài đặt tài khoản</p>
            </div>

            {/* Tabs */}
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            {activeTab === "contact" && <ContactInfoTab />}
            {activeTab === "security" && <SecurityTab />}
        </div>
    );
}
