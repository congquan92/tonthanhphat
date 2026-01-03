import { ContactInfoApi } from "@/api/contacinfo.api";
import { ContactInfo } from "@/components/type";
import Link from "next/link";

export default async function AboutPage() {
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
                        <span className="text-gray-900 font-medium">Giới thiệu</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative text-white py-16 md:py-24 overflow-hidden">
                <div
                    className="absolute inset-1 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/factory.png')",
                    }}
                >
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase">{contactInfo.companyName}</h1>
                        <p className="text-lg md:text-xl mb-3">{contactInfo.companyTagline}</p>
                        <p className="text-base md:text-lg italic">{contactInfo.companySlogan}</p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white border-gray-200 p-8 md:p-12 shadow-sm">
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 uppercase">Về Chúng Tôi</h2>
                        </div>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed text-justify">{contactInfo.companyDescription}</p>
                    </div>

                    {/* Social Links */}
                    {contactInfo.socialLinks && contactInfo.socialLinks.length > 0 && (
                        <div className="max-w-4xl mx-auto mt-12">
                            <div className="bg-white border border-gray-200 p-6 md:p-8">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 uppercase">Kết Nối Với Chúng Tôi</h3>
                                <div className="flex flex-wrap gap-3">
                                    {contactInfo.socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-600 transition-all text-sm font-medium"
                                        >
                                            <span>{social.icon}</span>
                                            <span>{social.platform}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
