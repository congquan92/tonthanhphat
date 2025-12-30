"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AuthApi } from "@/api/auth.api";
import { AxiosError } from "axios";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await AuthApi.login(formData.email, formData.password);
            toast.success(`${res.message}`);
            router.push("/admin/");
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            const err = axiosError.response?.data?.message || "Đăng nhập thất bại";
            toast.error(err);
            console.log("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-slate-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
                    <CardDescription className="text-center">Trang Admin Nhà Máy Tôn Thành Phát</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="admin123@gmail.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Đang xử lý..." : "Đăng nhập"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
