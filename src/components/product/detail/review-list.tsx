"use client";
import React from "react";
import { FiThumbsUp, FiCheckCircle } from "react-icons/fi";

const ReviewList: React.FC = () => {

    // Mock reviews for now
    const reviews = [
        {
            id: 1,
            author: "Alice",
            rating: 5,
            date: "Aug 12, 2025",
            title: "Unapologetically Bold",
            content: "Rich leather meets subtle floral undertones—totally unexpected and absolutely unforgettable.",
            verified: true,
            helpful: 12
        },
        {
            id: 2,
            author: "Marcus",
            rating: 5,
            date: "Aug 9, 2025",
            title: "Luxury in Every Spritz",
            content: "The moment you wear it, you feel like you own the room. Deep, smoky, and sophisticated.",
            verified: true,
            helpful: 8
        }
    ];

    return (
        <div className="review-list space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-heading">Customer Reviews</h3>
                <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-500 text-sm">
                        {"★".repeat(5)}
                    </div>
                    <span className="text-sm text-gray-500">5.0 average rating ({reviews.length} reviews)</span>
                </div>
            </div>

            <div className="space-y-6">
                {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <div className="flex text-yellow-500 text-xs">
                                    {"★".repeat(review.rating)}
                                    {"☆".repeat(5 - review.rating)}
                                </div>
                                {review.verified && (
                                    <span className="flex items-center text-xs text-green-600 font-medium">
                                        <FiCheckCircle className="mr-1" /> Verified Purchase
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-gray-400">{review.date}</span>
                        </div>

                        <h4 className="font-bold text-heading text-sm mb-1">{review.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{review.author}</p>
                        <p className="text-gray-700 leading-relaxed mb-3">{review.content}</p>

                        <div className="flex items-center space-x-4">
                            <button className="flex items-center text-xs text-gray-500 hover:text-black transition-colors">
                                <FiThumbsUp className="mr-1" /> Helpful ({review.helpful})
                            </button>
                            <button className="text-xs text-gray-400 hover:text-black transition-colors">
                                Report
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
