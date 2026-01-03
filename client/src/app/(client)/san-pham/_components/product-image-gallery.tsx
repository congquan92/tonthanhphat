"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="bg-gray-100">
                <div className="relative aspect-square flex items-center justify-center text-gray-400">
                    <svg className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            </div>
        );
    }

    const lightboxSlides = images.map((img) => ({ src: img }));

    return (
        <div>
            {/* Main Image */}
            <div className="bg-gray-100 mb-4 cursor-pointer hover:opacity-90 transition relative group" onClick={() => setLightboxOpen(true)}>
                <div className="relative aspect-square">
                    <Image src={images[selectedImage]} alt={productName} fill className="object-contain" priority />
                    
                    {/* Zoom hint */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 text-sm backdrop-blur-sm">
                        <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        Click để phóng to
                    </div>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            {/* Previous Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                                }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Previous image"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Next image"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 text-sm backdrop-blur-sm">
                                {selectedImage + 1} / {images.length}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.map((img: string, idx: number) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`bg-gray-100 cursor-pointer hover:opacity-75 transition border-2 ${selectedImage === idx ? "border-gray-900" : "border-transparent"}`}
                        >
                            <div className="relative aspect-square">
                                <Image src={img} alt={`${productName} - ${idx + 1}`} fill className="object-contain" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={lightboxSlides}
                index={selectedImage}
                plugins={[Zoom]}
                zoom={{
                    maxZoomPixelRatio: 3,
                    scrollToZoom: true,
                }}
                on={{
                    view: ({ index }) => setSelectedImage(index),
                }}
                styles={{
                    container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
                }}
            />
        </div>
    );
}
