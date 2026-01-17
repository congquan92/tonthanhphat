"use client";

import React from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Partner {
    id: number;
    urlimg: string;
    linkurl: string;
}

const partners: Partner[] = [
    {
        id: 1,
        urlimg: "/partners/tonhoasen.jpg",
        linkurl: "https://hoasengroup.vn",
    },
    {
        id: 2,
        urlimg: "/partners/sssc.jpg",
        linkurl: "https://www.tonphuongnam.com.vn",
    },
    {
        id: 3,
        urlimg: "/partners/namkim.png",
        linkurl: "https://tonnamkim.com",
    },
    {
        id: 4,
        urlimg: "/partners/hoaphat.png",
        linkurl: "https://www.hoaphat.com.vn",
    },
    {
        id: 5,
        urlimg: "/partners/tondonga.png",
        linkurl: "https://www.tondonga.com.vn",
    },
    {
        id: 6,
        urlimg: "/partners/vinaone.png",
        linkurl: "https://vinaonesteel.com",
    },
];

export default function Collaborate() {
    const autoplayPlugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

    return (
        <section className="py-16 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header with decorative lines */}
                <div className="relative mb-12">
                    <div className="flex items-center justify-center">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-gray-300"></div>
                        <h2 className="px-8 text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide whitespace-nowrap">Các doanh nghiệp hợp tác</h2>
                        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gray-300 to-gray-300"></div>
                    </div>
                </div>

                {/* Partners Carousel */}
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[autoplayPlugin.current]}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {partners.map((partner) => (
                            <CarouselItem key={partner.id} className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5">
                                <a href={partner.linkurl} target="_blank" rel="noopener noreferrer" className="block">
                                    <div className="relative w-full h-24 p-4 bg-white rounded-lg border border-blue-400 shadow-lg overflow-hidden">
                                        <Image src={partner.urlimg} alt={`Partner ${partner.id}`} fill className="object-contain transition-all duration-300 hover:scale-105" />
                                    </div>
                                </a>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}
