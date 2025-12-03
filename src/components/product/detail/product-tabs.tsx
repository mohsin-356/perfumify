"use client";
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useProductDetail } from "@contexts/product-detail.context";
import "react-tabs/style/react-tabs.css";

const ProductTabs: React.FC = () => {
    const { product } = useProductDetail();

    if (!product) return null;

    return (
        <div className="product-tabs pt-10">
            <Tabs selectedTabClassName="border-b-2 border-black font-bold text-black">
                <TabList className="flex space-x-8 border-b border-gray-200 mb-8 overflow-x-auto">
                    <Tab className="pb-4 cursor-pointer text-gray-500 hover:text-black outline-none whitespace-nowrap">
                        Product Description
                    </Tab>
                    <Tab className="pb-4 cursor-pointer text-gray-500 hover:text-black outline-none whitespace-nowrap">
                        Shipping Policy
                    </Tab>
                    <Tab className="pb-4 cursor-pointer text-gray-500 hover:text-black outline-none whitespace-nowrap">
                        Refund Policy
                    </Tab>
                </TabList>

                {/* Description */}
                <TabPanel>
                    <div className="prose max-w-none text-gray-600 leading-relaxed">
                        <h3 className="text-lg font-bold text-heading mb-4">About {String(product.name)}</h3>
                        <p className="mb-4">{String((product as any).description ?? "")}</p>

                        {/* Example static content for now, can be dynamic later */}
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Brand:</strong> {typeof product.brand === 'object' ? (product.brand as any).name : String((product as any).brand ?? "")}</li>
                            <li><strong>Gender:</strong> Unisex</li>
                            <li><strong>Authenticity:</strong> 100% Original Guaranteed</li>
                        </ul>
                    </div>
                </TabPanel>

                {/* Shipping */}
                <TabPanel>
                    <div className="prose max-w-none text-gray-600 leading-relaxed">
                        <h3 className="text-lg font-bold text-heading mb-4">Shipping Information</h3>
                        <p className="mb-4">
                            We offer free standard shipping on all orders within the UK.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Processing Time:</strong> 1-2 business days</li>
                            <li><strong>Delivery Time:</strong> 2-4 business days</li>
                            <li><strong>Carrier:</strong> Royal Mail / DPD</li>
                        </ul>
                    </div>
                </TabPanel>

                {/* Refund */}
                <TabPanel>
                    <div className="prose max-w-none text-gray-600 leading-relaxed">
                        <h3 className="text-lg font-bold text-heading mb-4">Return & Refund Policy</h3>
                        <p className="mb-4">
                            We accept returns within 30 days of purchase for unused and unopened items.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Items must be in original packaging with seals intact.</li>
                            <li>Return shipping is the responsibility of the customer unless the item is defective.</li>
                            <li>Refunds are processed within 5-7 business days of receipt.</li>
                        </ul>
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default ProductTabs;
