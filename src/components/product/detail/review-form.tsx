import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiStar } from "react-icons/fi";
import cn from "classnames";

const ReviewForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const onSubmit = (data: any) => {
        console.log({ ...data, rating });
        // TODO: Submit to API
        alert("Review submitted successfully!");
    };

    return (
        <div className="review-form border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-lg font-bold text-heading mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Rating */}
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-semibold text-gray-600">Rating</label>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="focus:outline-none"
                            >
                                <FiStar
                                    className={cn("w-6 h-6 transition-colors", {
                                        "text-yellow-500 fill-current": star <= (hoverRating || rating),
                                        "text-gray-300": star > (hoverRating || rating),
                                    })}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Title */}
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-semibold text-gray-600">Review Title</label>
                    <input
                        {...register("title", { required: true })}
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-black"
                        placeholder="Give your review a title"
                    />
                    {errors.title && <span className="text-xs text-red-500">Title is required</span>}
                </div>

                {/* Content */}
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-semibold text-gray-600">Review</label>
                    <textarea
                        {...register("content", { required: true })}
                        rows={4}
                        className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-black"
                        placeholder="Write your comments here"
                    />
                    {errors.content && <span className="text-xs text-red-500">Content is required</span>}
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Name</label>
                        <input
                            {...register("name", { required: true })}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-black"
                            placeholder="Your Name"
                        />
                        {errors.name && <span className="text-xs text-red-500">Name is required</span>}
                    </div>
                    <div className="flex flex-col space-y-1">
                        <label className="text-sm font-semibold text-gray-600">Email</label>
                        <input
                            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-black"
                            placeholder="your@email.com"
                        />
                        {errors.email && <span className="text-xs text-red-500">Valid email is required</span>}
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-black text-white px-8 py-3 rounded-md font-bold hover:bg-gray-800 transition-colors"
                >
                    Submit Review
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
