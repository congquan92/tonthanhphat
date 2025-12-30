import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactInfo } from "@/components/type";
import Link from "next/link";
import Image from "next/image";

interface IntroduceProps {
    data: ContactInfo;
}

export default function Introduce({ data }: IntroduceProps) {
    return (
        <section className="relative py-20 bg-gray-100 overflow-hidden rounded-none">
            {/* Content Container */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center bg-white rounded-none p-8 md:p-12 lg:p-16">
                    {/* Left Column - Text Content */}
                    <div className="flex flex-col gap-6">
                        {/* Header */}
                        <div className="pl-4">
                            <h2 className="text-2xl font-bold text-blue-500 mb-2 tracking-wide">GIỚI THIỆU</h2>
                            <p className="text-sm text-gray-600 italic">{data.companySlogan}</p>
                        </div>

                        {/* Company Name */}
                        <h1 className="text-3xl md:text-4xl font-extrabold uppercase leading-tight text-orange-600">{data.companyName}</h1>

                        {/* Description */}
                        <div className="text-gray-700 leading-relaxed text-justify text-sm md:text-base">
                            <p>{data.companyDescription}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-3">
                            <Link href="/gioi-thieu">
                                <Button variant={"link"} size={"lg"} className="bg-blue-600 hover:bg-blue-700 text-white rounded-none transition-all duration-300 cursor-pointer ">
                                    TÌM HIỂU THÊM
                                </Button>
                            </Link>
                            <Link href={`tel:${data.companyPhone?.[0]}`} className="flex items-center gap-3 cursor-pointer">
                                <div className="size-10 rounded-full bg-orange-600 flex items-center justify-center">
                                    <Phone className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-xs text-gray-600">Liên Hệ Ngay</p>
                                    <p className="text-lg font-bold text-orange-600">{data.companyPhone?.[0]}</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Image */}
                    <div className="relative h-full min-h-[300px] lg:min-h-[400px]">
                        <Image src="/factory.png" alt={data.companyName} fill className="object-cover rounded-none" />
                    </div>
                </div>
            </div>
        </section>
    );
}
