"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
    id: string;
    name: string;
    slug: string;
    thumbnail?: string;
    shortDesc?: string;
    category?: {
        slug: string;
    };
}

interface ProductCarouselProps {
    title: string;
    products: Product[];
    itemsPerPage?: number;
    categorySlug?: string; // Optional for backwards compatibility
}

export default function ProductCarousel({ title, products, itemsPerPage = 4, categorySlug }: ProductCarouselProps) {
    const [currentPage, setCurrentPage] = useState(0);

    if (!products || products.length === 0) {
        return null;
    }

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const visibleProducts = products.slice(startIndex, startIndex + itemsPerPage);

    const goToNext = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const goToPrev = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <div className="mt-12">
            {/* Header with navigation */}
            <div className="flex items-center justify-between border-b pb-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                {totalPages > 1 && (
                    <div className="flex gap-2">
                        <button onClick={goToPrev} className="p-2 border hover:bg-gray-100 transition" aria-label="Previous">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button onClick={goToNext} className="p-2 border hover:bg-gray-100 transition" aria-label="Next">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>

            {/* Products Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {visibleProducts.map((product) => (
                    <Link key={product.id} href={`/san-pham/${categorySlug || product.category?.slug || 'uncategorized'}/${product.slug}`} className="group border hover:shadow-lg transition">
                        <div className="relative aspect-square bg-gray-100">
                            {product.thumbnail ? (
                                <Image src={product.thumbnail} alt={product.name} fill className="object-contain group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400">
                                    <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="p-4 bg-white">
                            <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition">{product.name}</h3>
                            {product.shortDesc && <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.shortDesc}</p>}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Page indicators */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button key={index} onClick={() => setCurrentPage(index)} className={`h-2 w-2 transition ${currentPage === index ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400"}`} aria-label={`Go to page ${index + 1}`} />
                    ))}
                </div>
            )}
        </div>
    );
}
