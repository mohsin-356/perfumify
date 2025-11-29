import React from "react";
import { useProductDetail } from "@contexts/product-detail.context";
import { FiMinus, FiPlus } from "react-icons/fi";

const QuantitySelector: React.FC = () => {
    const { quantity, setQuantity, product } = useProductDetail();

    const handleIncrement = () => {
        if (product && quantity < product.quantity) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div className="quantity-selector flex items-center space-x-4">
            <label className="text-sm font-semibold text-heading">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-md">
                <button
                    onClick={handleDecrement}
                    disabled={quantity <= 1}
                    className="p-2 text-gray-600 hover:text-black disabled:opacity-50 transition-colors"
                >
                    <FiMinus size={16} />
                </button>
                <span className="w-12 text-center font-medium text-heading">{quantity}</span>
                <button
                    onClick={handleIncrement}
                    disabled={product ? quantity >= product.quantity : false}
                    className="p-2 text-gray-600 hover:text-black disabled:opacity-50 transition-colors"
                >
                    <FiPlus size={16} />
                </button>
            </div>
        </div>
    );
};

export default QuantitySelector;
