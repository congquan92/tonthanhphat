import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/api/product.api";

interface ProductCarouselProps {
    products?: Product[];
    slogan: string;
    className?: string;
}

export default function ProductCarousel({ products = [], slogan, className }: ProductCarouselProps) {
    return (
        <section className={cn("py-12 bg-white", className)}>
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <div className="pl-4 mb-4">
                        <h2 className="text-2xl font-bold text-blue-500 tracking-wide">SẢN PHẨM</h2>
                        <p className="text-sm text-gray-600 italic">{slogan}</p>
                    </div>

                    <div className="flex items-center justify-between mb-6 pl-4">
                        <h3 className="text-xl md:text-2xl font-bold text-orange-500 uppercase">MỘT SỐ SẢN PHẨM TIÊU BIỂU CHO BẠN THAM KHẢO</h3>
                        <Link href="/san-pham" className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors text-sm font-medium">
                            Xem thêm
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.length === 0 ? (
                        // Empty state
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">Không có sản phẩm nào</p>
                        </div>
                    ) : (
                        // Product cards
                        products.map((product) => (
                            <Link key={product.id} href={`/san-pham/${product.slug}`} className="group border border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg bg-white">
                                {/* Product Image */}
                                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                                    <Image
                                        src={product.thumbnail || "/anime.jpg"}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-3">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{product.name}</h4>
                                    <p className="text-xs text-gray-500">{product.shortDesc || product.category?.name || "Liên hệ"}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
