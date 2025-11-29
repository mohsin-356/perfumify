import React, { useEffect, useState } from "react";
import ProductCard from "@components/product/product-card";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import "swiper/swiper-bundle.css";
import { Product } from "@framework/types";

SwiperCore.use([Navigation]);

const RecentlyViewed: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("recentlyViewed");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setProducts(parsed);
                }
            } catch (e) {
                console.error("Failed to parse recently viewed products", e);
            }
        }
    }, []);

    if (products.length === 0) return null;

    return (
        <div className="recently-viewed pt-10 pb-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-heading mb-8">Recently Viewed Products</h2>

            <Swiper
                spaceBetween={20}
                slidesPerView={2}
                navigation
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                className="recently-viewed-carousel"
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product} variant="grid" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default RecentlyViewed;
