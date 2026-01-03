import { ContactInfoApi } from "@/api/contacinfo.api";
import { ContactInfo } from "@/components/type";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default async function ContactPage() {
    const contactRes = await ContactInfoApi.getContactInfo();
    const contactInfo: ContactInfo = contactRes.data;

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
                        <span className="text-gray-900 font-medium">Liên hệ</span>
                    </div>
                </div>
            </div>

            {/* Google Maps */}
            {contactInfo.iframeMap && (
                <section className="bg-gray-100">
                    <div className="w-full h-[400px] md:h-[500px]">
                        <iframe src={contactInfo.iframeMap} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Bản đồ vị trí công ty"></iframe>
                    </div>
                </section>
            )}

            {/* Contact Form & Info Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                        {/* Left: Contact Form */}
                        <div className="bg-white border border-gray-200 p-6 md:p-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase">Gửi Thắc Mắc Cho Chúng Tôi</h2>
                            <p className="text-sm text-gray-600 mb-6">Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và chúng tôi sẽ liên lạc lại bạn sớm nhất có thể.</p>

                            <form className="space-y-4">
                                <div>
                                    <input type="text" placeholder="Tên của bạn" className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors text-sm" required />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="email" placeholder="Email của bạn" className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors text-sm" required />
                                    <input type="tel" placeholder="Số điện thoại của bạn" className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors text-sm" required />
                                </div>

                                <div>
                                    <textarea placeholder="Nội dung" rows={6} className="w-full px-4 py-3 border border-gray-300 focus:border-gray-900 focus:outline-none transition-colors text-sm resize-none" required></textarea>
                                </div>

                                <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 transition-colors uppercase text-sm">
                                    Gửi Thông Tin
                                </button>
                            </form>
                        </div>

                        {/* Right: Contact Information */}
                        <div className="bg-white border border-gray-200 p-6 md:p-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase">Thông Tin Liên Hệ</h2>

                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-gray-900 flex items-center justify-center shrink-0">
                                        <MapPin size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase">Địa Chỉ</h3>
                                        <ul className="space-y-2">
                                            {contactInfo.addresses.map((addr, index) => (
                                                <li key={index} className="text-sm text-gray-700 leading-relaxed">
                                                    - <strong>{addr.type}</strong>: {addr.address}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-gray-900 flex items-center justify-center shrink-0">
                                        <Phone size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase">Điện Thoại</h3>
                                        <div className="space-y-1">
                                            {contactInfo.companyPhone.map((phone, index) => (
                                                <a key={index} href={`tel:${phone.replace(/\s/g, "")}`} className="block text-sm text-gray-700 hover:text-black transition-colors ">
                                                    - {phone}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Working Hours */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-gray-900 flex items-center justify-center shrink-0">
                                        <Clock size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase">Thời Gian Làm Việc</h3>
                                        <div className="space-y-1 text-sm text-gray-700">
                                            <p>- Thứ 2 - Thứ 6: 08:00 - 18:00</p>
                                            <p>- Thứ 7 - Chủ nhật: 08:00 - 12:00</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-gray-900 flex items-center justify-center shrink-0">
                                        <Mail size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase">Email</h3>
                                        <a href={`mailto:${contactInfo.companyEmail}`} className="block text-sm text-gray-700 hover:text-black transition-colors font-medium break-words">
                                            - {contactInfo.companyEmail}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            {contactInfo.socialLinks && contactInfo.socialLinks.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase">Kết Nối Với Chúng Tôi</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {contactInfo.socialLinks.map((social, index) => (
                                            <a
                                                key={index}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-3 py-2 border border-gray-300 hover:border-gray-900 hover:bg-gray-100 hover:text-gray-900 transition-all text-xs font-medium"
                                            >
                                                <span>{social.icon}</span>
                                                <span>{social.platform}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
