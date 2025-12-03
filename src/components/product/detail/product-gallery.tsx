"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Thumbs, Pagination } from "swiper/core";
import Image from "next/image";
import { useProductDetail } from "@contexts/product-detail.context";
import "swiper/swiper-bundle.css";

SwiperCore.use([Navigation, Thumbs, Pagination]);

const ProductGallery: React.FC = () => {
    const { product } = useProductDetail();
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

    if (!product) return null;

    const images = product.images && product.images.length > 0
        ? product.images
        : product.image
            ? [product.image]
            : [];

    // Fallback if no images
    if (images.length === 0) {
        return (
            <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                No Image Available
            </div>
        )
    }

    return (
        <div className="product-gallery flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails (Left on Desktop, Bottom on Mobile) */}
            {images.length > 1 && (
                <div className="w-full md:w-24 flex-shrink-0">
                    <Swiper
                        onSwiper={setThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={4}
                        direction="horizontal"
                        breakpoints={{
                            768: {
                                direction: "vertical",
                                slidesPerView: "auto"
                            }
                        }}
                        watchSlidesVisibility
                        watchSlidesProgress
                        className="h-24 md:h-[500px] w-full"
                    >
                        {images.map((img: any, idx: number) => (
                            <SwiperSlide key={idx} className="cursor-pointer border border-transparent rounded-md overflow-hidden !h-20 !w-20 md:!h-24 md:!w-24">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={img.url || img.original || img.thumbnail}
                                        alt={`Thumbnail ${idx}`}
                                        fill
                                        className="rounded-md object-cover"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}

            {/* Main Slider */}
            <div className="flex-1 w-full min-w-0">
                <Swiper
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    pagination={{ clickable: true }}
                    className="w-full rounded-lg overflow-hidden aspect-square md:aspect-auto md:h-[600px] bg-gray-50"
                >
                    {images.map((img: any, idx: number) => (
                        <SwiperSlide key={idx} className="flex items-center justify-center bg-white">
                            <div className="relative w-full h-full">
                                <Image
                                    src={img.url || img.original}
                                    alt={String(product.name)}
                                    fill
                                    priority={idx === 0}
                                    className="rounded-lg object-contain"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default ProductGallery;
