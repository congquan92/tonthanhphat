import { ContactInfoApi } from "@/api/contacinfo.api";
import { PricingApi, PricingItem } from "@/api/pricing.api";
import { ContactInfo } from "@/components/type";
import Link from "next/link";
import { Phone } from "lucide-react";

export default async function BangGiaPage() {
    const [contactRes, pricingRes] = await Promise.all([ContactInfoApi.getContactInfo(), PricingApi.getAllPricing()]);

    const contactInfo: ContactInfo = contactRes.data;
    const pricingData = pricingRes.data || [];
    const hasData = pricingData.length > 0;

    // Group data by category
    const pricingByCategory: Record<string, PricingItem[]> = {};
    if (hasData) {
        pricingData.forEach((item) => {
            const category = item["Danh mục"] || "Khác";
            if (!pricingByCategory[category]) {
                pricingByCategory[category] = [];
            }
            pricingByCategory[category].push(item);
        });
    }

    const categories = Object.keys(pricingByCategory);

    // Lấy tất cả headers từ data đầu tiên (để hiển thị columns động)
    let headers: string[] = [];
    if (hasData) {
        headers = Object.keys(pricingData[0]);
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="border-b bg-gray-50">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-gray-900">
                            Trang chủ
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Bảng giá</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="container mx-auto text-center text-black p-2 md:p-4">
                <div className="flex flex-col justify-center gap-1.5">
                    <h1 className="font-bold uppercase text-2xl">Bảng Giá Sản Phẩm</h1>
                    <h1 className="text-lg text-gray-600">(Bảng giá chỉ mang tính tham khảo vui lòng liên hệ để biết giá chính xác)</h1>
                </div>
            </section>

            {/* Pricing Content */}
            <section className="py-12 md:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    {!hasData ? (
                        // Empty State
                        <div className="max-w-2xl mx-auto bg-white border border-gray-200 p-12 text-center shadow-sm">
                            <p className="text-gray-500 text-lg mb-4">Bảng giá đang được cập nhật</p>
                            <p className="text-sm text-gray-600 mb-6">Vui lòng liên hệ trực tiếp để biết giá sản phẩm</p>
                            <a href={`tel:${contactInfo.companyPhone?.[0]}`} className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium">
                                <Phone className="h-5 w-5" />
                                Liên hệ ngay
                            </a>
                        </div>
                    ) : (
                        // Pricing Tables by Category
                        <div className="space-y-12">
                            {categories.map((category) => {
                                const items = pricingByCategory[category];
                                return (
                                    <div key={category} className="bg-white border border-gray-200 shadow-sm">
                                        {/* Category Header */}
                                        <div className="bg-gray-900 px-6 py-4">
                                            <h2 className="text-2xl font-bold text-white uppercase">{category}</h2>
                                        </div>

                                        {/* Scrollable Table */}
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-max">
                                                <thead>
                                                    <tr className="bg-gray-100 border-b border-gray-200">
                                                        <th className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">STT</th>
                                                        {headers.map((header) => (
                                                            <th key={header} className="px-6 py-3 text-left text-sm font-bold text-gray-900 uppercase tracking-wider">
                                                                {header}
                                                            </th>
                                                        ))}
                                                        <th className="px-6 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">Liên hệ</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {items.map((item: PricingItem, index: number) => (
                                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                                                            {headers.map((header) => {
                                                                const value = item[header];
                                                                // Format giá
                                                                if (header === "Giá" && typeof value === "number") {
                                                                    return (
                                                                        <td key={header} className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                                            {value.toLocaleString("vi-VN")} đ
                                                                        </td>
                                                                    );
                                                                }
                                                                return (
                                                                    <td key={header} className="px-6 py-4 text-sm text-gray-900">
                                                                        {value || "-"}
                                                                    </td>
                                                                );
                                                            })}
                                                            <td className="px-6 py-4 text-center">
                                                                <a href={`tel:${contactInfo.companyPhone?.[0]}`} className="inline-flex items-center gap-1 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium">
                                                                    <Phone className="h-4 w-4" />
                                                                    Gọi ngay
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Banner */}
            <section className="py-8 bg-white border-t">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl mx-auto text-center">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">Cần tư vấn chi tiết?</h3>
                        <p className="text-gray-600 mb-6">Liên hệ ngay để nhận báo giá tốt nhất</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a href={`tel:${contactInfo.companyPhone?.[0]}`} className="inline-flex items-center justify-center gap-2 p-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium">
                                <Phone className="h-5 w-5" />
                                {contactInfo.companyPhone?.[0]}
                            </a>
                            {contactInfo.companyEmail && (
                                <a href={`mailto:${contactInfo.companyEmail}`} className="inline-flex items-center justify-center gap-2 p-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors font-medium">
                                    {contactInfo.companyEmail}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
