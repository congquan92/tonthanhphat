"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Building2, Phone, MapPin, Globe, Plus, Trash2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactInfoApi } from "@/api/contacinfo.api";
import { toast } from "sonner";

const contactInfoSchema = z.object({
    id: z.string().optional(),
    companyName: z.string().min(1, "Tên công ty không được để trống").trim(),
    companyShortName: z.string().trim().optional(),
    companyTagline: z.string().trim().optional(),
    companySlogan: z.string().trim().optional(),
    companyDescription: z.string().trim().optional(),
    companyEmail: z.string().email("Email không hợp lệ").or(z.literal("")).optional(),
    companyPhone: z.array(z.string().trim()).min(1, "Phải có ít nhất một số điện thoại"),
    addresses: z
        .array(
            z.object({
                type: z.string().min(1, "Loại địa chỉ không được để trống").trim(),
                address: z.string().min(1, "Địa chỉ không được để trống").trim(),
            }),
        )
        .min(1, "Phải có ít nhất một địa chỉ"),
    socialLinks: z
        .array(
            z.object({
                platform: z.string().min(1, "Nền tảng không được để trống"),
                url: z.string().url("URL không hợp lệ").or(z.literal("")),
                icon: z.string(),
            }),
        )
        .optional(),
    iframeMap: z.string().trim().optional(),
});

type ContactInfoValues = z.infer<typeof contactInfoSchema>;

const PLATFORMS = [
    { value: "Facebook", icon: "facebook" },
    { value: "Zalo", icon: "zalo" },
    { value: "Youtube", icon: "youtube" },
    { value: "Tiktok", icon: "tiktok" },
    { value: "Instagram", icon: "instagram" },
];

export function ContactInfoTab() {
    const [isLoading, setIsLoading] = useState(true);
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ContactInfoValues>({
        resolver: zodResolver(contactInfoSchema),
        defaultValues: {
            companyName: "",
            companyShortName: "",
            companyTagline: "",
            companySlogan: "",
            companyDescription: "",
            companyEmail: "",
            companyPhone: [""],
            addresses: [{ type: "Trụ sở chính", address: "" }],
            socialLinks: [{ platform: "Facebook", url: "", icon: "facebook" }],
            iframeMap: "",
        },
    });

    const companyPhone = watch("companyPhone");
    const addresses = watch("addresses");
    const socialLinks = watch("socialLinks");

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            setIsLoading(true);
            const res = await ContactInfoApi.getContactInfo();
            if (res.data) {
                reset({
                    ...res.data,
                    companyPhone: res.data.companyPhone?.length ? res.data.companyPhone : [""],
                    addresses: res.data.addresses?.length ? res.data.addresses : [{ type: "Trụ sở chính", address: "" }],
                    socialLinks: res.data.socialLinks?.length ? res.data.socialLinks : [{ platform: "Facebook", url: "", icon: "facebook" }],
                });
            }
        } catch (error) {
            console.error("Failed to fetch contact info:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: ContactInfoValues) => {
        try {
            // Filter out empty values
            const cleanedData = {
                ...data,
                companyPhone: data.companyPhone.filter((phone) => phone !== ""),
                addresses: data.addresses.filter((addr) => addr.type !== "" && addr.address !== ""),
                socialLinks: data.socialLinks?.filter((link) => link.url !== ""),
            };

            await ContactInfoApi.updateContactInfo(cleanedData as any);
            toast.success("Đã lưu thông tin thành công");
        } catch (error) {
            console.error("Failed to save contact info:", error);
            toast.error("Không thể lưu thông tin");
        }
    };

    // Phone functions
    const addPhone = () => {
        setValue("companyPhone", [...companyPhone, ""]);
    };

    const removePhone = (index: number) => {
        setValue(
            "companyPhone",
            companyPhone.filter((_, i) => i !== index),
        );
    };

    const updatePhone = (index: number, value: string) => {
        const newPhones = [...companyPhone];
        newPhones[index] = value;
        setValue("companyPhone", newPhones);
    };

    // Address functions
    const addAddress = () => {
        setValue("addresses", [...addresses, { type: "", address: "" }]);
    };

    const removeAddress = (index: number) => {
        setValue(
            "addresses",
            addresses.filter((_, i) => i !== index),
        );
    };

    const updateAddress = (index: number, field: "type" | "address", value: string) => {
        const newAddresses = [...addresses];
        newAddresses[index] = { ...newAddresses[index], [field]: value };
        setValue("addresses", newAddresses);
    };

    // Social link functions
    const addSocialLink = () => {
        setValue("socialLinks", [...(socialLinks || []), { platform: "Facebook", url: "", icon: "facebook" }]);
    };

    const removeSocialLink = (index: number) => {
        setValue(
            "socialLinks",
            socialLinks?.filter((_, i) => i !== index),
        );
    };

    const updateSocialLink = (index: number, field: "platform" | "url", value: string) => {
        const newLinks = [...(socialLinks || [])];
        if (field === "platform") {
            const platform = PLATFORMS.find((p) => p.value === value);
            newLinks[index] = { ...newLinks[index], platform: value, icon: platform?.icon || value.toLowerCase() };
        } else {
            newLinks[index] = { ...newLinks[index], [field]: value };
        }
        setValue("socialLinks", newLinks);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Company Info */}
            <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800 dark:shadow-slate-900/50">
                <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-700">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Building2 className="h-5 w-5 text-blue-500" />
                        Thông tin công ty
                    </CardTitle>
                    <CardDescription>Thông tin cơ bản về công ty của bạn</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                    <div>
                        <Label htmlFor="companyName">Tên công ty</Label>
                        <Input {...register("companyName")} id="companyName" placeholder="Công ty TNHH..." className="mt-1.5" />
                        {errors.companyName && <p className="mt-1 text-sm text-red-500">{errors.companyName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="companyShortName">Tên viết tắt</Label>
                        <Input {...register("companyShortName")} id="companyShortName" placeholder="TTK" className="mt-1.5" />
                    </div>
                    <div>
                        <Label htmlFor="companyTagline">Slogan ngắn</Label>
                        <Input {...register("companyTagline")} id="companyTagline" placeholder="Uy tín - Chất lượng" className="mt-1.5" />
                    </div>
                    <div>
                        <Label htmlFor="companyEmail">Email công ty</Label>
                        <Input {...register("companyEmail")} id="companyEmail" type="email" placeholder="contact@company.com" className="mt-1.5" />
                        {errors.companyEmail && <p className="mt-1 text-sm text-red-500">{errors.companyEmail.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                        <Label htmlFor="companyDescription">Mô tả công ty</Label>
                        <textarea
                            {...register("companyDescription")}
                            id="companyDescription"
                            placeholder="Giới thiệu ngắn về công ty..."
                            className="mt-1.5 min-h-[100px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Phone Numbers */}
            <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800 dark:shadow-slate-900/50">
                <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Phone className="h-5 w-5 text-green-500" />
                                Số điện thoại
                            </CardTitle>
                            <CardDescription>Các số điện thoại liên hệ</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={addPhone} className="text-blue-600">
                            <Plus className="mr-1 h-4 w-4" />
                            Thêm
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 p-6">
                    {companyPhone?.map((phone, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex gap-3">
                                <Input placeholder="Số điện thoại (VD: 0901 234 567)" value={phone} onChange={(e) => updatePhone(index, e.target.value)} className="flex-1" />
                                {(companyPhone?.length || 0) > 1 && (
                                    <Button variant="ghost" size="icon" onClick={() => removePhone(index)} className="shrink-0 text-red-500 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                    {errors.companyPhone && <p className="text-sm text-red-500">{errors.companyPhone.message}</p>}
                </CardContent>
            </Card>

            {/* Addresses & Google Maps */}
            <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800 dark:shadow-slate-900/50">
                <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <MapPin className="h-5 w-5 text-red-500" /> Địa chỉ & Bản đồ
                            </CardTitle>
                            <CardDescription>Các địa chỉ chi nhánh và Google Maps</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={addAddress} className="text-blue-600">
                            <Plus className="mr-1 h-4 w-4" />
                            Thêm địa chỉ
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                    {/* Addresses */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Danh sách địa chỉ</Label>
                        {addresses?.map((addr, index) => (
                            <div key={index} className="space-y-1">
                                <div className="flex gap-3">
                                    <Input placeholder="Loại (VD: Nhà máy, Văn phòng)" value={addr.type} onChange={(e) => updateAddress(index, "type", e.target.value)} className="w-1/3" />
                                    <Input placeholder="Địa chỉ đầy đủ" value={addr.address} onChange={(e) => updateAddress(index, "address", e.target.value)} className="flex-1" />
                                    {(addresses?.length || 0) > 1 && (
                                        <Button variant="ghost" size="icon" onClick={() => removeAddress(index)} className="shrink-0 text-red-500 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                {errors.addresses?.[index]?.type && <p className="text-sm text-red-500">{errors.addresses[index]?.type?.message}</p>}
                                {errors.addresses?.[index]?.address && <p className="text-sm text-red-500">{errors.addresses[index]?.address?.message}</p>}
                            </div>
                        ))}
                        {errors.addresses && typeof errors.addresses.message === "string" && <p className="text-sm text-red-500">{errors.addresses.message}</p>}
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700"></div>

                    {/* Google Maps */}
                    <div className="space-y-3">
                        <Label htmlFor="iframeMap" className="text-sm font-semibold">
                            Google Maps Embed URL
                        </Label>
                        <textarea
                            {...register("iframeMap")}
                            id="iframeMap"
                            placeholder="https://www.google.com/maps/embed?pb=..."
                            className="min-h-[40px] w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800 dark:shadow-slate-900/50">
                <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <Globe className="h-5 w-5 text-purple-500" />
                                Mạng xã hội
                            </CardTitle>
                            <CardDescription>Liên kết đến các trang mạng xã hội</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={addSocialLink} className="text-blue-600">
                            <Plus className="mr-1 h-4 w-4" />
                            Thêm
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 p-6">
                    {socialLinks?.map((link, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex gap-3">
                                <select
                                    value={link.platform}
                                    onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                                    className="w-1/3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900"
                                >
                                    {PLATFORMS.map((platform) => (
                                        <option key={platform.value} value={platform.value}>
                                            {platform.value}
                                        </option>
                                    ))}
                                </select>
                                <Input placeholder="URL" value={link.url} onChange={(e) => updateSocialLink(index, "url", e.target.value)} className="flex-1" />
                                {(socialLinks?.length || 0) > 1 && (
                                    <Button variant="ghost" size="icon" onClick={() => removeSocialLink(index)} className="shrink-0 text-red-500 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            {errors.socialLinks?.[index]?.url && <p className="text-sm text-red-500">{errors.socialLinks[index]?.url?.message}</p>}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Save Button */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                        {isSubmitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Lưu thay đổi
                    </Button>
                </div>
            </form>
        </div>
    );
}
