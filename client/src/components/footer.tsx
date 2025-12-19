import Link from "next/link";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import { footerLinks } from "./data";
import { ContactInfoApi } from "@/api/contacinfo.api";
import { ContactInfo } from "@/components/type";

export default async function Footer() {
    const { data }: { data: ContactInfo } = await ContactInfoApi.getContactInfo();

    return (
        <footer className="relative">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/bg-foot.png')",
                }}
            >
                {/*overlay */}
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-white">
                {/* Company Name */}
                <div className="border-b border-white/20 py-4">
                    <div className="container mx-auto px-4">
                        <h2 className="text-center text-lg md:text-xl font-bold uppercase tracking-wide">{data.companyName}</h2>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Column 1: Địa chỉ nhà máy */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-red-500 mb-4">Địa Chỉ Nhà Máy</h3>
                            <ul className="space-y-3 text-sm text-white">
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">Địa chỉ:</p>
                                        {data.addresses.map((addr) => (
                                            <p key={addr.type}>{addr.address}</p>
                                        ))}
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Phone className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">ĐT/Zalo:</p>
                                        {data.companyPhone.map((phone) => (
                                            <Link href={`tel:${phone.replace(/\s/g, "")}`} key={phone} className="block hover:text-red-300 transition-colors">
                                                {phone}
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Mail className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">Email:</p>
                                        <Link href={`mailto:${data.companyEmail}`} className="hover:text-red-300 transition-colors">
                                            {data.companyEmail}
                                        </Link>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Globe className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">Website:</p>
                                        <Link href="/" className="text-blue-300 hover:text-blue-200 transition-colors">
                                            tonthanhphat.vn
                                        </Link>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Column 2: Hướng dẫn mua hàng */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-red-500 mb-4">Hướng Dẫn Mua Hàng</h3>
                            <ul className="space-y-3 text-sm text-white">
                                <li className="flex items-start gap-2">
                                    <Phone className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">Liên hệ:</p>
                                        {data.companyPhone.map((phone) => (
                                            <Link href={`tel:${phone.replace(/\s/g, "")}`} key={phone} className="block hover:text-red-300 transition-colors">
                                                {phone}
                                            </Link>
                                        ))}
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Mail className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">Email:</p>
                                        <Link href={`mailto:${data.companyEmail}`} className="hover:text-red-300 transition-colors">
                                            {data.companyEmail}
                                        </Link>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">Địa chỉ:</p>
                                        {data.addresses.map((addr) => (
                                            <p key={addr.type}>{addr.address}</p>
                                        ))}
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Chính sách hoạt động */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-red-500 mb-4">Chính Sách Hoạt Động</h3>
                            <ul className="space-y-2 text-sm">
                                {footerLinks.policies.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-white hover:text-red-300 transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                                {footerLinks.services.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-white hover:text-red-300 transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/20 py-4">
                    <div className="container mx-auto px-4">
                        <p className="text-center text-sm text-gray-400">
                            © {new Date().getFullYear()} {data.companyName.toUpperCase()}. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
