import React from "react";
import { useProductDetail } from "@contexts/product-detail.context";
import usePrice from "@framework/product/use-price";

const ProductInfo: React.FC = () => {
    const { product } = useProductDetail();

    const { price, basePrice, discount } = usePrice({
        amount: product?.sale_price ? Number(product.sale_price) : Number(product?.price ?? 0),
        baseAmount: Number(product?.price ?? 0),
        currencyCode: "GBP",
    });

    if (!product) return null;

    return (
        <div className="product-info space-y-4">
            {/* Brand & Category */}
            <div className="flex items-center text-sm text-gray-500 space-x-2">
                {Boolean((product as any).brand) ? (
                    <span className="uppercase tracking-wider font-medium text-gray-900">
                        {typeof product.brand === 'object' ? (product.brand as any).name : String(product.brand)}
                    </span>
                ) : null}
                {Boolean((product as any).category) ? (
                    <>
                        <span>/</span>
                        <span className="cursor-pointer hover:text-black transition-colors">
                            {typeof product.category === 'object' ? (product.category as any).name : String(product.category)}
                        </span>
                    </>
                ) : null}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-heading">{product.name}</h1>

            {/* Reviews (Placeholder) */}
            <div className="flex items-center space-x-2">
                <div className="flex text-yellow-500 text-sm">
                    {"★".repeat(5)}
                </div>
                <span className="text-sm text-gray-500">(2 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 text-2xl md:text-3xl font-semibold text-heading">
                <span>{price}</span>
                {discount && (
                    <del className="text-lg md:text-xl font-normal text-gray-400">
                        {basePrice}
                    </del>
                )}
                {discount && (
                    <span className="text-sm font-bold bg-red-500 text-white px-2 py-1 rounded-md">
                        SAVE {discount}
                    </span>
                )}
            </div>

            {/* SKU & Stock */}
            <div className="flex flex-col space-y-1 text-sm text-gray-600">
                {product.sku && <p>SKU: <span className="font-medium text-heading">{product.sku}</span></p>}
                <p>Availability:
                    <span className={product.quantity > 0 ? "text-green-600 font-medium ml-1" : "text-red-600 font-medium ml-1"}>
                        {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                </p>
            </div>

            {/* Short Description */}
            {product.description && (
                <p className="text-body text-sm leading-7 pt-2 border-t border-gray-200">
                    {product.description}
                </p>
            )}
        </div>
    );
};

export default ProductInfo;
