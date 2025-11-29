import React from "react";
import { useProductDetail } from "@contexts/product-detail.context";
import { useProductsQuery } from "@framework/product/get-all-products";
import ProductCard from "@components/product/product-card";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper/core";
import "swiper/swiper-bundle.css";

SwiperCore.use([Navigation]);

const RelatedProducts: React.FC = () => {
    const { product } = useProductDetail();

    // Fetch related products based on category
    const categorySlug = typeof product?.category === 'object' ? (product.category as any).slug : product?.category;

    const { data: productsData, isLoading } = useProductsQuery({
        limit: 10,
        category: categorySlug,
    });

    if (isLoading || !productsData?.pages?.[0]?.data?.length) return null;

    // Flatten pages to get all products
    const allProducts = productsData.pages.flatMap(page => page.data);

    // Filter out current product
    const relatedProducts = allProducts.filter((p) => p.id !== product?.id);

    if (relatedProducts.length === 0) return null;

    return (
        <div className="related-products pt-16 pb-10 border-t border-gray-200 mt-16">
            <h2 className="text-2xl font-bold text-heading mb-8">You Might Also Like</h2>

            <Swiper
                spaceBetween={20}
                slidesPerView={2}
                navigation
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                className="related-products-carousel"
            >
                {relatedProducts.map((product) => (
                    <SwiperSlide key={product.id}>
                        <ProductCard product={product} variant="grid" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default RelatedProducts;
