import { useState } from "react";
import { Collapse } from "@components/common/accordion";
import ReviewForm from "@components/common/form/review-form";

interface Props {
	data: any;
}

const ProductMetaReview: React.FC<Props> = ({ data }) => {
	const [expanded, setExpanded] = useState<number>(0);

	// Description Section Content
	const descriptionContent = (
		<div className="space-y-4">
			<p className="text-sm text-gray-700 leading-relaxed">
				{data?.description || "Experience the luxurious blend of notes in this exquisite perfume. Crafted with premium ingredients for a lasting and memorable fragrance that suits any occasion."}
			</p>
			
			<div className="mt-6">
				<h3 className="text-base font-semibold text-heading mb-3">Outstanding Features</h3>
				<ul className="space-y-2 text-sm text-gray-700">
					<li className="flex items-start">
						<span className="text-green-500 mr-2 mt-1">✓</span>
						<span><strong>Long-lasting formula:</strong> Enjoy fragrance that lasts all day</span>
					</li>
					<li className="flex items-start">
						<span className="text-green-500 mr-2 mt-1">✓</span>
						<span><strong>Premium quality:</strong> Made with finest ingredients</span>
					</li>
					<li className="flex items-start">
						<span className="text-green-500 mr-2 mt-1">✓</span>
						<span><strong>Authentic fragrance:</strong> 100% original product guaranteed</span>
					</li>
					<li className="flex items-start">
						<span className="text-green-500 mr-2 mt-1">✓</span>
						<span><strong>Elegant packaging:</strong> Perfect for gifting</span>
					</li>
					<li className="flex items-start">
						<span className="text-green-500 mr-2 mt-1">✓</span>
						<span><strong>Versatile scent:</strong> Suitable for day and evening wear</span>
					</li>
				</ul>
			</div>

			<div className="mt-6">
				<h3 className="text-base font-semibold text-heading mb-3">Product Supreme Quality</h3>
				<p className="text-sm text-gray-700 leading-relaxed">
					Each fragrance is carefully crafted using traditional perfumery techniques combined with modern innovation. 
					Our commitment to excellence ensures every bottle delivers the perfect balance of top, middle, and base notes 
					for an unforgettable scent experience.
				</p>
			</div>
		</div>
	);

	// Shipping & Return Content
	const shippingContent = (
		<div className="space-y-4">
			<div>
				<h3 className="text-base font-semibold text-heading mb-3">Shipping Information</h3>
				<ul className="space-y-2 text-sm text-gray-700">
					<li className="flex items-start">
						<span className="text-blue-500 mr-2 mt-1">📦</span>
						<span><strong>Free Shipping:</strong> For all orders exceeding $100 USD</span>
					</li>
					<li className="flex items-start">
						<span className="text-blue-500 mr-2 mt-1">🚚</span>
						<span><strong>Delivery Time:</strong> 12-26 days (International), 3-6 days (United States)</span>
					</li>
					<li className="flex items-start">
						<span className="text-blue-500 mr-2 mt-1">📍</span>
						<span><strong>Tracking:</strong> Full tracking number provided for all orders</span>
					</li>
					<li className="flex items-start">
						<span className="text-blue-500 mr-2 mt-1">💰</span>
						<span><strong>Standard Shipping:</strong> Charges apply for orders under $100 USD</span>
					</li>
				</ul>
			</div>

			<div className="mt-6 pt-6 border-t border-gray-200">
				<h3 className="text-base font-semibold text-heading mb-3">Return Policy</h3>
				<ul className="space-y-2 text-sm text-gray-700">
					<li className="flex items-start">
						<span className="text-orange-500 mr-2 mt-1">🔄</span>
						<span><strong>45 Days Return:</strong> Returns accepted within 45 days of receipt</span>
					</li>
					<li className="flex items-start">
						<span className="text-orange-500 mr-2 mt-1">✉️</span>
						<span><strong>Contact Required:</strong> Email us before returning unworn items</span>
					</li>
					<li className="flex items-start">
						<span className="text-orange-500 mr-2 mt-1">📋</span>
						<span><strong>Condition:</strong> Items must be unused, unopened, and in original packaging</span>
					</li>
					<li className="flex items-start">
						<span className="text-orange-500 mr-2 mt-1">💵</span>
						<span><strong>Refund:</strong> Full refund issued within 7-10 business days</span>
					</li>
				</ul>
				<p className="mt-4 text-sm text-gray-600 italic">
					Note: Check out our detailed Terms & Conditions for complete shipping and return policy information.
				</p>
			</div>
		</div>
	);

	// Customer Reviews Content
	const reviewsContent = (
		<div className="space-y-6">
			<div className="flex items-center justify-between pb-4 border-b border-gray-200">
				<div>
					<h3 className="text-base font-semibold text-heading">Customer Reviews</h3>
					<div className="flex items-center mt-2">
						<div className="flex text-yellow-400">
							<span>⭐⭐⭐⭐⭐</span>
						</div>
						<span className="ml-2 text-sm text-gray-600">Based on 1 review</span>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<p className="text-sm text-gray-600 italic">
					Be the first to write a review for this product!
				</p>
			</div>

			<div className="mt-6 pt-6 border-t border-gray-200">
				<h3 className="text-base font-semibold text-heading mb-4">Write a Review</h3>
				<ReviewForm />
			</div>
		</div>
	);

	// Static sections array
	const sections = [
		{
			id: 1,
			title: "Description",
			content: descriptionContent,
		},
		{
			id: 2,
			title: "Shipping & Return",
			content: shippingContent,
		},
		{
			id: 3,
			title: "Customer Reviews",
			content: reviewsContent,
		},
	];

	return (
		<div className="mt-8">
			{sections.map((item, index) => (
				<Collapse
					i={index}
					key={item.title}
					title={item.title}
					translatorNS="review"
					content={item.content}
					expanded={expanded}
					setExpanded={setExpanded}
					variant="transparent"
				/>
			))}
		</div>
	);
};

export default ProductMetaReview;
