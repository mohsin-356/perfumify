import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@framework/types';

interface ProductDetailContextType {
    product: Product | null;
    selectedVariant: any | null;
    setSelectedVariant: (variant: any) => void;
    quantity: number;
    setQuantity: (quantity: number) => void;
    currentImage: string | null;
    setCurrentImage: (image: string) => void;
}

const ProductDetailContext = createContext<ProductDetailContextType | undefined>(undefined);

export const useProductDetail = () => {
    const context = useContext(ProductDetailContext);
    if (!context) {
        throw new Error('useProductDetail must be used within a ProductDetailProvider');
    }
    return context;
};

export const ProductDetailProvider: React.FC<{ product: Product; children: React.ReactNode }> = ({ product, children }) => {
    const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState<string | null>(null);

    useEffect(() => {
        if (product) {
            // Initialize with default variant if available
            if (product.variations && Object.keys(product.variations).length > 0) {
                // Logic to select default variant can go here
            }

            // Set initial image
            const initialImage = product.images?.[0]?.url || product.image?.original;
            if (initialImage) {
                setCurrentImage(initialImage);
            }

            // Save to recently viewed
            const stored = localStorage.getItem("recentlyViewed");
            let viewed: Product[] = stored ? JSON.parse(stored) : [];

            // Remove if already exists to move to top
            viewed = viewed.filter(p => p.id !== product.id);

            // Add to beginning
            viewed.unshift(product);

            // Limit to 10
            if (viewed.length > 10) viewed = viewed.slice(0, 10);

            localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
        }
    }, [product]);

    return (
        <ProductDetailContext.Provider
            value={{
                product,
                selectedVariant,
                setSelectedVariant,
                quantity,
                setQuantity,
                currentImage,
                setCurrentImage,
            }}
        >
            {children}
        </ProductDetailContext.Provider>
    );
};
