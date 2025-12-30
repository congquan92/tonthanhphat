"use client";

import { useState } from "react";
import { Lock, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function SecurityTab() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        // Trim all password fields
        const trimmedCurrentPassword = currentPassword.trim();
        const trimmedNewPassword = newPassword.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        if (!trimmedCurrentPassword || !trimmedNewPassword || !trimmedConfirmPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (trimmedNewPassword !== trimmedConfirmPassword) {
            toast.error("Mật khẩu mới không khớp");
            return;
        }

        if (trimmedNewPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }

        try {
            setIsLoading(true);
            // Note: Need to implement changePassword in AuthApi
            // await AuthApi.changePassword(trimmedCurrentPassword, trimmedNewPassword);
            toast.success("Đã đổi mật khẩu thành công");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Failed to change password:", error);
            toast.error("Không thể đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800 dark:shadow-slate-900/50">
            <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Lock className="h-5 w-5 text-amber-500" />
                    Đổi mật khẩu
                </CardTitle>
                <CardDescription>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                    <div>
                        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                        <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Nhập mật khẩu hiện tại" className="mt-1.5" />
                    </div>
                    <div>
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nhập mật khẩu mới" className="mt-1.5" />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu mới" className="mt-1.5" />
                    </div>
                    <Button type="submit" disabled={isLoading} className="mt-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                        {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                        Đổi mật khẩu
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
