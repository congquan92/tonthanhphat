import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Service {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    slug: string;
}

interface ServiceFetProps {
    services?: Service[];
    slogan: string;
    className?: string;
}

export default function ServiceFet({ services = [], slogan, className }: ServiceFetProps) {
    const defaultServices: Service[] = [
        {
            id: "1",
            title: "01. GIA CÔNG CÂN TÔN",
            description: "Chuyên ren xuất, gia công Xà Gồ, Tôn, Tôn Nhôm lợp mái , Tôn cơn sóng, tấm 5 Sống Xương, 9 Sống Vương, Sóng Thoi sóng Lá Phong sóng KIPLOCK...",
            thumbnail: "/anime.jpg",
            slug: "gia-cong-can-ton",
        },
        {
            id: "2",
            title: "02. CHÂN TÔN CÁC LOẠI",
            description:
                "Gia công cắp tôn hay rông hộm là gia công chân, bổi làm loại là phương pháp phổ biến từ thuật đã đưa vào khuôn mẫu có sẵ, tự động theo các quy trình chuyên môn của ngành thương thương phẩm hoặc yêu cầu riêng của từng doanh nghiệm hiện nay thường phẩm phôi nhựng theo yêu cầu tạo thành ba sản phẩm cao, đảm bảo chất lượng tốt không gây ôn ố mốc càng có thế làm được.",
            thumbnail: "/anime.jpg",
            slug: "chan-ton-cac-loai",
        },
    ];

    const displayServices = services.length > 0 ? services : defaultServices;

    return (
        <section className={cn("py-12 bg-gray-50", className)}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <div className="pl-4 mb-4">
                        <h2 className="text-2xl font-bold text-blue-500 tracking-wide">DỊCH VỤ</h2>
                        <p className="text-sm text-gray-600 italic">{slogan}</p>
                    </div>

                    <div className="flex items-center justify-between mb-6 pl-4">
                        <h3 className="text-xl md:text-2xl font-bold text-orange-500 uppercase">MỘT SỐ DỊCH VỤ TIÊU BIỂU CỦA CHÚNG TÔI</h3>
                    </div>
                </div>

                {/* Services List */}
                {displayServices.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Không có dịch vụ nào</p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {displayServices.map((service, index) => {
                            const isEven = index % 2 === 0;

                            return (
                                <div key={service.id} className="relative">
                                    <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-0")}>
                                        <div className={cn("relative h-[450px] lg:h-[500px] lg:col-span-7 z-0", isEven ? "lg:order-1" : "lg:order-2")}>
                                            <Image src={service.thumbnail} alt={service.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 58vw" priority={index === 0} />
                                        </div>

                                        <div className={cn("lg:col-span-5 relative flex items-center z-10", isEven ? "lg:order-2" : "lg:order-1")}>
                                            <div className={cn("bg-white p-8 md:p-10 w-full", "lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:shadow-xl lg:w-[110%]", isEven ? "lg:-left-[10%]" : "lg:-right-[10%]")}>
                                                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-blue-700 mb-4 uppercase tracking-wide">{service.title}</h3>
                                                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">{service.description}</p>
                                                <div>
                                                    <Link href={`/dich-vu/${service.slug}`}>
                                                        <Button className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-2.5 rounded-none text-sm font-bold uppercase tracking-wide transition-colors">Xem chi tiết</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
