import React, { useState } from "react";
import { useProductDetail } from "@contexts/product-detail.context";
import { useCart } from "@contexts/cart/cart.context";
import { generateCartItem } from "@utils/generate-cart-item";
import { toast } from "react-toastify";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useWishlist } from "@contexts/wishlist/wishlist.context";
import cn from "classnames";

const AddToCart: React.FC<{ className?: string }> = ({ className }) => {
    const { product, selectedVariant, quantity } = useProductDetail();
    const { addItemToCart } = useCart();
    const { addItemToWishlist, isInWishlist, removeItemFromWishlist } = useWishlist();
    const [loading, setLoading] = useState(false);

    if (!product) return null;

    const handleAddToCart = () => {
        setLoading(true);
        setTimeout(() => {
            const item = generateCartItem(product, selectedVariant ? { ...selectedVariant } : {});
            addItemToCart(item, quantity);
            toast("Added to bag", {
                type: "dark",
                progressClassName: "fancy-progress-bar",
                position: "bottom-right",
                autoClose: 2000,
            });
            setLoading(false);
        }, 600);
    };

    const toggleWishlist = () => {
        if (isInWishlist(product.id)) {
            removeItemFromWishlist(product.id);
        } else {
            addItemToWishlist(product);
        }
    };

    return (
        <div className={cn("flex flex-col space-y-3", className)}>
            <div className="flex gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={loading || product.quantity <= 0}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-white transition-all transform active:scale-95",
                        {
                            "bg-black hover:bg-gray-800": product.quantity > 0,
                            "bg-gray-400 cursor-not-allowed": product.quantity <= 0,
                        }
                    )}
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <FiShoppingCart size={20} />
                            {product.quantity > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                        </>
                    )}
                </button>

                <button
                    onClick={toggleWishlist}
                    className={cn(
                        "flex items-center justify-center w-14 h-14 rounded-full border-2 transition-colors",
                        {
                            "border-red-500 text-red-500 bg-red-50": isInWishlist(product.id),
                            "border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600": !isInWishlist(product.id),
                        }
                    )}
                >
                    <FiHeart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>
            </div>

            {/* Buy Now / Payment Options */}
            <button className="w-full py-4 bg-[#5A31F4] text-white font-bold rounded-full hover:bg-[#4825c9] transition-colors">
                Buy with Shop Pay
            </button>

            <div className="text-center">
                <button className="text-sm text-gray-500 underline hover:text-black">
                    More payment options
                </button>
            </div>
        </div>
    );
};

export default AddToCart;
