"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Mật khẩu hiện tại không được để trống"),
        newPassword: z.string().min(6, "Mật khẩu mới phải từ 6 ký tự trở lên"),
        confirmPassword: z.string().min(1, "Vui lòng xác nhận lại mật khẩu"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });
type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export function SecurityTab() {
    const [isLoading, setIsLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordValues>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ChangePasswordValues) => {
        try {
            setIsLoading(true);
            console.log("Dữ liệu sạch:", data);
            // await AuthApi.changePassword(data.currentPassword, data.newPassword);
            toast.success("Đã đổi mật khẩu thành công");
            reset(); // Xóa sạch form
        } catch (error) {
            toast.error(`Không thể đổi mật khẩu ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="rounded-none border-0 bg-white shadow-none">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-amber-500" /> Đổi mật khẩu
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
                <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
                    <div>
                        <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                        <Input {...register("currentPassword")} type="password" className="mt-1.5" />
                        {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input {...register("newPassword")} type="password" className="mt-1.5" />
                        {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>}
                    </div>

                    <div>
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                        <Input {...register("confirmPassword")} type="password" className="mt-1.5" />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                        Lưu thay đổi
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
