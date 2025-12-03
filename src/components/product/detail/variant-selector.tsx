"use client";
import React from "react";
import { useProductDetail } from "@contexts/product-detail.context";
import cn from "classnames";

const VariantSelector: React.FC = () => {
    const { product, selectedVariant, setSelectedVariant } = useProductDetail();

    if (!product || !product.variations || Object.keys(product.variations).length === 0) {
        return null;
    }

    // Example structure handling - assuming variations is an object like { size: [{name: '100ml', price: 100}, ...] }
    // Adjust based on actual data structure
    const variations = product.variations as any;

    return (
        <div className="variant-selector space-y-4 pt-4">
            {Object.keys(variations).map((variantType) => (
                <div key={variantType} className="space-y-2">
                    <label className="text-sm font-semibold text-heading capitalize">
                        {variantType}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {variations[variantType].map((variant: any) => (
                            <button
                                key={variant.id || variant.name}
                                onClick={() => setSelectedVariant(variant)}
                                className={cn(
                                    "px-4 py-2 text-sm border rounded-md transition-all duration-200",
                                    {
                                        "border-black bg-black text-white": selectedVariant?.name === variant.name,
                                        "border-gray-200 bg-white text-gray-700 hover:border-gray-400": selectedVariant?.name !== variant.name,
                                    }
                                )}
                            >
                                {variant.name}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VariantSelector;
