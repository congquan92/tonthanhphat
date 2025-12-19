"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AuthApi } from "@/api/auth.api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await AuthApi.login(email, password);
            toast.success(`${res.message}`);
            router.push("/admin/dashboard");
        } catch {
            toast.error("Đăng nhập thất bại");
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
                            <Input id="email" type="email" placeholder="admin123@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
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
