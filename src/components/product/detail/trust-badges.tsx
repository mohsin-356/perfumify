import React from "react";
import { FiTruck, FiShield, FiRefreshCw } from "react-icons/fi";

const TrustBadges: React.FC = () => {
    return (
        <div className="trust-badges border-t border-gray-200 pt-6 mt-6 space-y-6">
            {/* Payment Icons */}
            <div className="flex flex-col space-y-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Guaranteed Safe Checkout</span>
                <div className="flex flex-wrap gap-2">
                    {/* Placeholder for payment icons - using text/divs for now or simple SVGs */}
                    {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay'].map(method => (
                        <div key={method} className="px-2 py-1 border border-gray-200 rounded text-xs font-medium text-gray-600 bg-gray-50">
                            {method}
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Guarantees */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <FiTruck className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-heading">Free Shipping</span>
                        <span className="text-xs text-gray-500">On all UK orders</span>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <FiRefreshCw className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-heading">Free Returns</span>
                        <span className="text-xs text-gray-500">30 days return policy</span>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                        <FiShield className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-heading">Secure Payment</span>
                        <span className="text-xs text-gray-500">100% secure checkout</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrustBadges;
