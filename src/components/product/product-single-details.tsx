import React, { useState } from "react";
import Button from "@components/ui/button";
import Counter from "@components/common/counter";
import { useRouter } from "next/router";
import { useProductQuery } from "@framework/product/get-product";
import { getVariations } from "@framework/utils/get-variations";
import usePrice from "@framework/product/use-price";
import { useCart } from "@contexts/cart/cart.context";
import { generateCartItem } from "@utils/generate-cart-item";
import { ProductAttributes } from "./product-attributes";
import isEmpty from "lodash/isEmpty";
import Link from "@components/ui/link";
import { toast } from "react-toastify";
import { useWindowSize } from "@utils/use-window-size";
import RelatedProducts from "@components/product/related-products";

const ProductSingleDetails: React.FC = () => {
	const {
		query: { slug },
	} = useRouter();
	const { width } = useWindowSize();
	const { data, isLoading } = useProductQuery(slug as string);
	const { addItemToCart } = useCart();
	const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
	const [quantity, setQuantity] = useState(1);
	const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
	const [selectedImage, setSelectedImage] = useState(0);
	const [activeTab, setActiveTab] = useState("description");
	const [showImageModal, setShowImageModal] = useState(false);

	const { price, basePrice, discount } = usePrice(
		data && {
			amount: data.sale_price ? data.sale_price : data.price,
			baseAmount: data.price,
			currencyCode: "GBP",
		}
	);

	if (isLoading) return <p>Loading...</p>;
	
	const variations = getVariations(data?.variations);
	const gallery = data?.gallery && data.gallery.length > 0 ? data.gallery : [data?.image];

	const isSelected = !isEmpty(variations)
		? !isEmpty(attributes) &&
		  Object.keys(variations).every((variation) =>
				attributes.hasOwnProperty(variation)
		  )
		: true;

	function addToCart() {
		if (!isSelected) return;
		setAddToCartLoader(true);
		setTimeout(() => {
			setAddToCartLoader(false);
		}, 600);

		const item = generateCartItem(data!, attributes);
		addItemToCart(item, quantity);
		toast("Added to the bag", {
			type: "dark",
			progressClassName: "fancy-progress-bar",
			position: width > 768 ? "bottom-right" : "top-right",
			autoClose: 2000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
		});
	}

	function handleAttribute(attribute: any) {
		setAttributes((prev) => ({
			...prev,
			...attribute,
		}));
	}

	const renderStars = (rating: number = 4.9) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				<svg
					key={i}
					className={`w-5 h-5 ${i <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
					fill="currentColor"
					viewBox="0 0 20 20"
				>
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			);
		}
		return stars;
	};

	const tabs = [
		{ id: "description", label: "Product description" },
		{ id: "shipping", label: "Shipping policy" },
		{ id: "refund", label: "Refund policy" },
		{ id: "reviews", label: "Customer Review" },
	];

	const getMetaContent = (title: string) => {
		const meta = data?.meta?.find((m: any) => m.title === title);
		return meta?.content || "";
	};

	return (
		<div className="pt-4 pb-6 lg:pb-8">
			{/* Image Modal */}
			{showImageModal && (
				<div 
					className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
					onClick={() => setShowImageModal(false)}
				>
					<div className="relative max-w-4xl max-h-screen">
						<button
							onClick={() => setShowImageModal(false)}
							className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
						>
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
						<img
							src={gallery[selectedImage]?.original || "/assets/placeholder/products/product-gallery.svg"}
							alt={data?.name}
							className="w-full h-auto"
						/>
					</div>
				</div>
			)}

			{/* Main Product Section */}
			<div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
				{/* Left: Product Gallery */}
				<div className="flex gap-3">
					{/* Vertical Thumbnail Gallery */}
					{gallery.length > 1 && (
						<div className="flex flex-col gap-2 w-16 lg:w-20 max-h-[500px] lg:max-h-[600px] overflow-y-auto">
							{gallery.slice(0, 5).map((image: any, index: number) => (
								<div
									key={index}
									onClick={() => setSelectedImage(index)}
									className={`relative bg-gray-100 rounded overflow-hidden cursor-pointer border-2 transition flex-shrink-0 ${
										selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
									}`}
								>
									<img
										src={image?.thumbnail || "/assets/placeholder/products/product-gallery.svg"}
										alt={`${data?.name} ${index + 1}`}
										className="w-full h-16 lg:h-20 object-cover"
									/>
								</div>
							))}
						</div>
					)}

					{/* Main Image */}
					<div 
						className="flex-1 relative bg-gray-50 rounded overflow-hidden cursor-zoom-in max-h-[500px] lg:max-h-[600px]"
						onClick={() => setShowImageModal(true)}
					>
						<img
							src={gallery[selectedImage]?.original || "/assets/placeholder/products/product-gallery.svg"}
							alt={data?.name}
							className="w-full h-full object-contain"
						/>
					</div>
				</div>

				{/* Right: Product Info */}
				<div className="space-y-3">
					{/* Product Name */}
					<h1 className="text-2xl lg:text-3xl font-bold text-heading leading-tight">{data?.name}</h1>

					{/* Rating */}
					<div className="flex items-center space-x-2">
						<div className="flex items-center">
							{renderStars(4.9)}
						</div>
						<span className="text-sm text-gray-600">(156 reviews)</span>
					</div>

					{/* Price */}
					<div className="flex items-center space-x-2 py-2">
						<div className="text-2xl lg:text-3xl font-bold text-heading">
							{price}
						</div>
						{discount && (
							<>
								<span className="text-lg text-gray-400 line-through">
									{basePrice}
								</span>
							</>
						)}
					</div>

					{/* Tax Info */}
					<p className="text-sm text-gray-600">Tax included.</p>

					{/* Variations/Attributes */}
					<div className="space-y-2 pt-2">
						{Object.keys(variations).map((variation) => {
							return (
								<ProductAttributes
									key={variation}
									title={variation}
									attributes={variations[variation]}
									active={attributes[variation]}
									onClick={handleAttribute}
									className="mb-3"
								/>
							);
						})}
					</div>

					{/* Quantity */}
					<div className="pt-2">
						<label className="text-sm font-semibold text-heading mb-2 block">Quantity</label>
						<Counter
							quantity={quantity}
							onIncrement={() => setQuantity((prev) => prev + 1)}
							onDecrement={() =>
								setQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
							}
							disableDecrement={quantity === 1}
						/>
					</div>

					{/* Add to Cart & Buy It Now */}
					<div className="space-y-2 pt-3">
						<Button
							onClick={addToCart}
							variant="slim"
							className={`w-full ${
								!isSelected && "bg-gray-400 hover:bg-gray-400"
							}`}
							disabled={!isSelected}
							loading={addToCartLoader}
						>
							<span className="py-2.5 text-sm font-semibold uppercase">Add to Cart</span>
						</Button>
						<Button
							variant="slim"
							className="w-full bg-black hover:bg-gray-800"
						>
							<span className="py-2.5 text-sm font-semibold uppercase">Buy It Now</span>
						</Button>
					</div>

					{/* Returns & Delivery Info */}
					<div className="border-t border-gray-200 pt-4 space-y-2">
						<div className="flex items-start gap-2">
							<span className="font-semibold text-sm">Returns:</span>
							<div>
								<p className="text-sm text-green-600 font-medium">Free Returns</p>
								<p className="text-xs text-gray-600">30 Day | Free Return</p>
							</div>
						</div>
						<div className="flex items-start gap-2">
							<span className="font-semibold text-sm">Postage:</span>
							<div>
								<p className="text-sm text-green-600 font-medium">Free delivery in 1-2 business days</p>
								<p className="text-xs text-gray-600">Estimated between Mon, 10 Nov and Tue, 11 Nov</p>
							</div>
						</div>
					</div>

					{/* Product Meta */}
					<div className="border-t border-gray-200 pt-3 space-y-1.5 text-sm">
						{data?.sku && (
							<div className="flex items-start">
								<span className="font-semibold text-heading min-w-[70px]">SKU:</span>
								<span className="text-gray-600 text-xs">{data.sku}</span>
							</div>
						)}
						{data?.category && (
							<div className="flex items-start">
								<span className="font-semibold text-heading min-w-[70px]">Category:</span>
								<Link
									href={`/search?category=${data.category.slug}`}
									className="text-gray-600 hover:text-heading transition text-xs"
								>
									{data.category.name || data.category}
								</Link>
							</div>
						)}
						{data?.tags && Array.isArray(data.tags) && data.tags.length > 0 && (
							<div className="flex items-start">
								<span className="font-semibold text-heading min-w-[70px]">Tags:</span>
								<div className="flex flex-wrap gap-1.5">
									{(data.tags as any[]).map((tag: any, index: number) => (
										<Link
											key={tag.id || tag}
											href={`/search?tag=${tag.slug || tag}`}
											className="text-gray-600 hover:text-heading transition text-xs"
										>
											{tag.name || tag}
											{index < (data.tags as any[]).length - 1 && ","}
										</Link>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Tabs Section */}
			{data?.meta && data.meta.length > 0 && (
				<div className="mt-8 lg:mt-10">
					{/* Tab Headers */}
					<div className="border-b border-gray-200">
						<div className="flex space-x-6 overflow-x-auto">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`py-3 px-1 font-medium text-sm whitespace-nowrap transition border-b-2 ${
										activeTab === tab.id
											? 'border-black text-black'
											: 'border-transparent text-gray-500 hover:text-gray-700'
									}`}
								>
									{tab.label}
								</button>
							))}
						</div>
					</div>

					{/* Tab Content */}
					<div className="py-6">
						{activeTab === "description" && (
							<div className="prose max-w-none">
								<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
									{getMetaContent("Description")}
								</p>
							</div>
						)}
						{activeTab === "shipping" && (
							<div className="prose max-w-none">
								<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
									{getMetaContent("Shipping & Return")}
								</p>
							</div>
						)}
						{activeTab === "refund" && (
							<div className="prose max-w-none">
								<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
									{getMetaContent("Refund Policy") || getMetaContent("Shipping & Return")}
								</p>
							</div>
						)}
						{activeTab === "reviews" && (
							<div className="space-y-4">
								<div className="flex items-center space-x-4">
									<div className="text-4xl font-bold">4.9</div>
									<div>
										<div className="flex items-center mb-1">
											{renderStars(4.9)}
										</div>
										<p className="text-sm text-gray-600">Based on 156 reviews</p>
									</div>
								</div>
								<div className="prose max-w-none">
									<p className="text-gray-700 text-sm leading-relaxed">
										{getMetaContent("Customer Reviews")}
									</p>
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Related Products Section */}
			<div className="mt-8 lg:mt-10">
				<RelatedProducts 
					sectionHeading="You Might Also Like"
					category={(typeof data?.category === 'object' ? data?.category?.slug : data?.category) as string}
					currentProductId={data?.id}
					limit={4}
				/>
			</div>

			{/* Recently Viewed Products */}
			<div className="mt-8 lg:mt-10">
				<h2 className="text-xl font-bold text-heading mb-4">Recently Viewed Products</h2>
				<RelatedProducts 
					sectionHeading=""
					category={(typeof data?.category === 'object' ? data?.category?.slug : data?.category) as string}
					currentProductId={data?.id}
					limit={4}
				/>
			</div>
		</div>
	);
};

export default ProductSingleDetails;
