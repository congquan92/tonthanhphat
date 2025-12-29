"use client";

import { useState, useEffect } from "react";
import { Save, Building2, Phone, MapPin, Globe, Plus, Trash2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContactInfoApi } from "@/api/contacinfo.api";
import { toast } from "sonner";

interface ContactInfo {
    id?: string;
    companyName?: string;
    companyShortName?: string;
    companyTagline?: string;
    companySlogan?: string;
    companyDescription?: string;
    companyEmail?: string;
    companyPhone?: { label: string; number: string }[];
    addresses?: { label: string; address: string }[];
    socialLinks?: { platform: string; url: string }[];
}

export function ContactInfoTab() {
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        companyName: "",
        companyShortName: "",
        companyTagline: "",
        companySlogan: "",
        companyDescription: "",
        companyEmail: "",
        companyPhone: [{ label: "Hotline", number: "" }],
        addresses: [{ label: "Trụ sở chính", address: "" }],
        socialLinks: [{ platform: "facebook", url: "" }],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            setIsLoading(true);
            const res = await ContactInfoApi.getContactInfo();
            if (res.data) {
                setContactInfo({
                    ...res.data,
                    companyPhone: res.data.companyPhone?.length ? res.data.companyPhone : [{ label: "Hotline", number: "" }],
                    addresses: res.data.addresses?.length ? res.data.addresses : [{ label: "Trụ sở chính", address: "" }],
                    socialLinks: res.data.socialLinks?.length ? res.data.socialLinks : [{ platform: "facebook", url: "" }],
                });
            }
        } catch (error) {
            console.error("Failed to fetch contact info:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await ContactInfoApi.updateContactInfo(contactInfo as any);
            toast.success("Đã lưu thông tin thành công");
        } catch (error) {
            console.error("Failed to save contact info:", error);
            toast.error("Không thể lưu thông tin");
        } finally {
            setIsSaving(false);
        }
    };

    const addPhone = () => {
        setContactInfo((prev) => ({
            ...prev,
            companyPhone: [...(prev.companyPhone || []), { label: "", number: "" }],
        }));
    };

    const removePhone = (index: number) => {
        setContactInfo((prev) => ({
            ...prev,
            companyPhone: prev.companyPhone?.filter((_, i) => i !== index),
        }));
    };

    const updatePhone = (index: number, field: "label" | "number", value: string) => {
        setContactInfo((prev) => ({
            ...prev,
            companyPhone: prev.companyPhone?.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
        }));
    };

    const addAddress = () => {
        setContactInfo((prev) => ({
            ...prev,
            addresses: [...(prev.addresses || []), { label: "", address: "" }],
        }));
    };

    const removeAddress = (index: number) => {
        setContactInfo((prev) => ({
            ...prev,
            addresses: prev.addresses?.filter((_, i) => i !== index),
        }));
    };

    const updateAddress = (index: number, field: "label" | "address", value: string) => {
        setContactInfo((prev) => ({
            ...prev,
            addresses: prev.addresses?.map((a, i) => (i === index ? { ...a, [field]: value } : a)),
        }));
    };

    const addSocialLink = () => {
        setContactInfo((prev) => ({
            ...prev,
            socialLinks: [...(prev.socialLinks || []), { platform: "facebook", url: "" }],
        }));
    };

    const removeSocialLink = (index: number) => {
        setContactInfo((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks?.filter((_, i) => i !== index),
        }));
    };

    const updateSocialLink = (index: number, field: "platform" | "url", value: string) => {
        setContactInfo((prev) => ({
            ...prev,
            socialLinks: prev.socialLinks?.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
        }));
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
                        <Input id="companyName" value={contactInfo.companyName || ""} onChange={(e) => setContactInfo((prev) => ({ ...prev, companyName: e.target.value }))} placeholder="Công ty TNHH..." className="mt-1.5" />
                    </div>
                    <div>
                        <Label htmlFor="companyShortName">Tên viết tắt</Label>
                        <Input id="companyShortName" value={contactInfo.companyShortName || ""} onChange={(e) => setContactInfo((prev) => ({ ...prev, companyShortName: e.target.value }))} placeholder="TTK" className="mt-1.5" />
                    </div>
                    <div>
                        <Label htmlFor="companyTagline">Slogan ngắn</Label>
                        <Input id="companyTagline" value={contactInfo.companyTagline || ""} onChange={(e) => setContactInfo((prev) => ({ ...prev, companyTagline: e.target.value }))} placeholder="Uy tín - Chất lượng" className="mt-1.5" />
                    </div>
                    <div>
                        <Label htmlFor="companyEmail">Email công ty</Label>
                        <Input id="companyEmail" type="email" value={contactInfo.companyEmail || ""} onChange={(e) => setContactInfo((prev) => ({ ...prev, companyEmail: e.target.value }))} placeholder="contact@company.com" className="mt-1.5" />
                    </div>
                    <div className="sm:col-span-2">
                        <Label htmlFor="companyDescription">Mô tả công ty</Label>
                        <textarea
                            id="companyDescription"
                            value={contactInfo.companyDescription || ""}
                            onChange={(e) => setContactInfo((prev) => ({ ...prev, companyDescription: e.target.value }))}
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
                    {contactInfo.companyPhone?.map((phone, index) => (
                        <div key={index} className="flex gap-3">
                            <Input placeholder="Nhãn (VD: Hotline)" value={phone.label} onChange={(e) => updatePhone(index, "label", e.target.value)} className="w-1/3" />
                            <Input placeholder="Số điện thoại" value={phone.number} onChange={(e) => updatePhone(index, "number", e.target.value)} className="flex-1" />
                            {(contactInfo.companyPhone?.length || 0) > 1 && (
                                <Button variant="ghost" size="icon" onClick={() => removePhone(index)} className="shrink-0 text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Addresses */}
            <Card className="rounded-2xl border-0 bg-white shadow-lg shadow-slate-200/50 dark:bg-slate-800 dark:shadow-slate-900/50">
                <CardHeader className="border-b border-slate-100 pb-4 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                <MapPin className="h-5 w-5 text-red-500" />
                                Địa chỉ
                            </CardTitle>
                            <CardDescription>Các địa chỉ chi nhánh</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={addAddress} className="text-blue-600">
                            <Plus className="mr-1 h-4 w-4" />
                            Thêm
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3 p-6">
                    {contactInfo.addresses?.map((addr, index) => (
                        <div key={index} className="flex gap-3">
                            <Input placeholder="Nhãn (VD: Trụ sở chính)" value={addr.label} onChange={(e) => updateAddress(index, "label", e.target.value)} className="w-1/3" />
                            <Input placeholder="Địa chỉ đầy đủ" value={addr.address} onChange={(e) => updateAddress(index, "address", e.target.value)} className="flex-1" />
                            {(contactInfo.addresses?.length || 0) > 1 && (
                                <Button variant="ghost" size="icon" onClick={() => removeAddress(index)} className="shrink-0 text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
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
                    {contactInfo.socialLinks?.map((link, index) => (
                        <div key={index} className="flex gap-3">
                            <select value={link.platform} onChange={(e) => updateSocialLink(index, "platform", e.target.value)} className="w-1/3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900">
                                <option value="facebook">Facebook</option>
                                <option value="zalo">Zalo</option>
                                <option value="youtube">YouTube</option>
                                <option value="tiktok">TikTok</option>
                                <option value="instagram">Instagram</option>
                            </select>
                            <Input placeholder="URL" value={link.url} onChange={(e) => updateSocialLink(index, "url", e.target.value)} className="flex-1" />
                            {(contactInfo.socialLinks?.length || 0) > 1 && (
                                <Button variant="ghost" size="icon" onClick={() => removeSocialLink(index)} className="shrink-0 text-red-500 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-8 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
                    {isSaving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Lưu thay đổi
                </Button>
            </div>
        </div>
    );
}
