"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import type { Post } from "@/api/post.api";

interface PostFetProps {
    posts?: Post[];
    slogan: string;
    className?: string;
    // Số lượng posts hiển thị trên mỗi breakpoint
    postsPerView?: {
        mobile?: number;      // < 640px (mặc định: 2)
        sm?: number;          // >= 640px (mặc định: 3)
        md?: number;          // >= 768px (mặc định: 4)
        lg?: number;          // >= 1024px (mặc định: 5)
    };
    // Tự động chuyển slide
    enableAutoplay?: boolean; // mặc định: true
    autoplayDelay?: number;   // thời gian delay (ms), mặc định: 4000
}

export default function PostFet({ 
    posts = [], 
    slogan, 
    className,
    postsPerView = {},
    enableAutoplay = true,
    autoplayDelay = 4000
}: PostFetProps) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    // Giá trị mặc định cho số lượng posts hiển thị
    const {
        mobile = 2,
        sm = 3,
        md = 4,
        lg = 5
    } = postsPerView;

    const autoplayPlugin = React.useRef(Autoplay({ delay: autoplayDelay, stopOnInteraction: true }));

    React.useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const scrollPrev = React.useCallback(() => {
        api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
        api?.scrollNext();
    }, [api]);

    return (
        <section className={cn("py-12 bg-white", className)}>
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <div className="pl-4 mb-4">
                        <h2 className="text-2xl font-bold text-blue-500 tracking-wide">TIN TỨC</h2>
                        <p className="text-sm text-gray-600 italic">{slogan}</p>
                    </div>

                    <div className="flex items-center justify-between mb-6 pl-4">
                        <h3 className="text-xl md:text-2xl font-bold text-orange-500 uppercase">MỘT SỐ TIN TỨC NỔI BẬT CHO BẠN THAM KHẢO</h3>
                        <Link href="/tin-tuc" className="flex items-center gap-1 text-blue-500 hover:underline transition-colors text-sm font-medium">
                            Xem thêm
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {posts.length === 0 ? (
                    // Empty state
                    <div className="text-center py-12">
                        <p className="text-gray-500">Không có tin tức nào</p>
                    </div>
                ) : (
                    // Post Carousel
                    <div className="relative group">
                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            plugins={enableAutoplay ? [autoplayPlugin.current] : []}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {posts.map((post) => (
                                    <CarouselItem 
                                        key={post.id} 
                                        className={cn(
                                            "pl-2 md:pl-4",
                                            `basis-1/${mobile}`,
                                            `sm:basis-1/${sm}`,
                                            `md:basis-1/${md}`,
                                            `lg:basis-1/${lg}`
                                        )}
                                    >
                                        <Link href={`/tin-tuc/${post.slug}`} className="block group/card border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg bg-white h-full">
                                            {/* Post Image */}
                                            <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                                                <Image
                                                    src={post.thumbnail || "/anime.jpg"}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover group-hover/card:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                                />
                                            </div>

                                            {/* Post Info */}
                                            <div className="p-3">
                                                <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 group-hover/card:text-blue-600 transition-colors">{post.title}</h4>
                                                <p className="text-xs text-gray-500">{post.excerpt || post.author || "Đọc thêm"}</p>
                                            </div>
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>

                        {/* Navigation Arrows */}
                        <Button
                            onClick={scrollPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="h-6 w-6 text-gray-700" />
                        </Button>
                        <Button
                            onClick={scrollNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                            aria-label="Next"
                        >
                            <ChevronRight className="h-6 w-6 text-gray-700" />
                        </Button>

                        {/* Dots Navigation */}
                        {count > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-6">
                                {Array.from({ length: count }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => api?.scrollTo(index)}
                                        className={cn("w-2 h-2 rounded-full transition-all duration-300", current === index ? "bg-blue-500 scale-110" : "bg-gray-300 hover:bg-gray-400")}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
