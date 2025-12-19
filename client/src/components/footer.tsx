import Link from "next/link";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import { footerLinks, companyInfo, contactInfo } from "./data";

export default function Footer() {
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
                        <h2 className="text-center text-lg md:text-xl font-bold uppercase tracking-wide">{companyInfo.name}</h2>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-red-500 mb-4">Địa Chỉ Nhà Máy</h3>
                            <ul className="space-y-3 text-sm text-white">
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">Địa chỉ:</p>
                                        <p>{contactInfo.address}</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Phone className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p>
                                            <span className="font-medium text-white">ĐT/Zalo: </span>
                                            <Link href={contactInfo.phoneLink} className="text-white hover:text-white transition-colors">
                                                {contactInfo.phone}
                                            </Link>
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Phone className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p>
                                            <span className="font-medium text-white">Hotline: </span>
                                            <Link href={contactInfo.phoneLink} className="text-white hover:text-white transition-colors">
                                                {contactInfo.phone}
                                            </Link>
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Mail className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p>
                                            <span className="font-medium text-white">Email: </span>
                                            <Link href={contactInfo.emailLink} className="text-white hover:text-white transition-colors">
                                                {contactInfo.email}
                                            </Link>
                                        </p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Globe className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p>
                                            <span className="font-medium text-white">Website: </span>
                                            <Link href="/" className="text-white hover:text-white transition-colors">
                                                tonthanhphat.vn
                                            </Link>
                                        </p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-red-500 mb-4">Hướng Dẫn Mua Hàng</h3>
                            <ul className="space-y-3 text-sm text-white">
                                <li className="flex items-start gap-2">
                                    <Phone className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <p>
                                        <span className="font-medium text-white">Liên hệ: </span>
                                        <Link href={contactInfo.phoneLink} className="text-white hover:text-white transition-colors">
                                            {contactInfo.phone}
                                        </Link>
                                    </p>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Phone className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <p>
                                        <span className="font-medium text-white">Hotline: </span>
                                        <Link href={contactInfo.phoneLink} className="text-white hover:text-white transition-colors">
                                            {contactInfo.phone}
                                        </Link>
                                        <span className="ml-1">- Mr.Thành</span>
                                    </p>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Mail className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <p>
                                        <span className="font-medium text-white">Email: </span>
                                        <Link href={contactInfo.emailLink} className="text-white hover:text-white transition-colors">
                                            {contactInfo.email}
                                        </Link>
                                    </p>
                                </li>
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">Địa chỉ:</p>
                                        <p>{contactInfo.address}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wide text-red-500 mb-4">Chính Sách Hoạt Động</h3>
                            <ul className="space-y-2 text-sm">
                                {footerLinks.policies.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-white hover:text-white transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                                {footerLinks.services.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="text-white hover:text-white transition-colors">
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
                        <p className="text-center text-sm text-gray-400">© 2024 {companyInfo.name.toLocaleUpperCase()}. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
