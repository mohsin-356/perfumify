"use client";
import React, { useState } from "react";
import Image from "next/image";
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
import CloudImage from "@components/ui/CloudImage";

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
	const [showImageModal, setShowImageModal] = useState(false);
	const [activeTab, setActiveTab] = useState<'description'|'shipping'|'refund'>('description');

	const { price, basePrice, discount } = usePrice(
		data && {
			amount: data.sale_price ? data.sale_price : data.price,
			baseAmount: data.price,
			currencyCode: "GBP",
		}
	);

	// Reviews state
	const [reviews, setReviews] = useState<any[]>([]);
	const [avgRating, setAvgRating] = useState<number>(0);
	const [reviewCount, setReviewCount] = useState<number>(0);
	const [hasMoreReviews, setHasMoreReviews] = useState<boolean>(false);
	const [pageReviews, setPageReviews] = useState<number>(1);
	const [loadingMoreReviews, setLoadingMoreReviews] = useState<boolean>(false);
	const [submittingReview, setSubmittingReview] = useState(false);
	const [reviewForm, setReviewForm] = useState({ name: "", email: "", rating: 5, comment: "" });

	React.useEffect(() => {
		const productId = (data as any)?._id || (data as any)?.id;
		if (!productId) return;
		(async () => {
			try {
				const res = await fetch(`/api/reviews?productId=${productId}&page=1&limit=4`);
				const json = await res.json();
				if (res.ok) {
					setReviews(json.reviews || []);
					setAvgRating(json.average || 0);
					setReviewCount(json.count || 0);
					setHasMoreReviews(Boolean(json.hasMore));
					setPageReviews(1);
				}
			} catch {}
		})();
	}, [data]);

	async function loadMoreReviews() {
		const productId = (data as any)?._id || (data as any)?.id;
		if (!productId || !hasMoreReviews || loadingMoreReviews) return;
		setLoadingMoreReviews(true);
		try {
			const nextPage = pageReviews + 1;
			const res = await fetch(`/api/reviews?productId=${productId}&page=${nextPage}&limit=4`);
			const json = await res.json();
			if (res.ok) {
				setReviews((prev) => [...prev, ...(json.reviews || [])]);
				setHasMoreReviews(Boolean(json.hasMore));
				setPageReviews(nextPage);
			}
		} finally {
			setLoadingMoreReviews(false);
		}
	}

	if (isLoading) return <p>Loading...</p>;

	const variations = getVariations(data?.variations);

	// Cloudinary support
	const cloudGalleryRaw = Array.isArray(data?.images) ? data.images.filter((img: any) => img && img.public_id) : [];
	// normalise cloud objects so they also have original/thumbnail for unified use
	const cloudGallery = cloudGalleryRaw.map((img: any) => ({
		...img,
		original: img.url,
		thumbnail: img.url,
	}));
	const hasCloudImages = cloudGallery.length > 0;

	// Normalize non-cloud gallery sources as well
	let gallery: any[] = [];
	if (hasCloudImages) {
		gallery = cloudGallery;
	} else if (Array.isArray((data as any)?.gallery) && (data as any).gallery.length > 0) {
		gallery = (data as any).gallery;
	} else if (typeof (data as any)?.image === 'string' && (data as any).image) {
		gallery = [{ original: (data as any).image, thumbnail: (data as any).image }];
	} else if ((data as any)?.image) {
		gallery = [(data as any).image];
	} else {
		gallery = [];
	}

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

	// --- Default tab contents (shown if product meta is missing) ---
	const DEFAULT_DESCRIPTION = `Any Perfume according to Title....\n\nAzzaro The Most Wanted Parfum 100ml is the boldest and most intense expression in the Azzaro Wanted line — a dark, seductive scent crafted for the man who thrives on standing out. Rich, spicy, and undeniably addictive, this fragrance makes a lasting impression with every spray.\n\nAt its heart is a unique caramel accord, wrapped in the deep warmth of Bourbon vanilla and glowing incandescent woods. The result is a fiery fougère ambery oriental blend that radiates confidence and power. Designed to be long-lasting and magnetic, this parfum is your signature for unforgettable nights.\n\n**Fragrance Details:**\n• **Brand:** Azzaro\n• **Range:** The Most Wanted Parfum\n• **Gender:** Male\n• **Fragrance Family:** Oriental\n• **Key Note:** Vanilla\n• **Strength:** Parfum\n• **Size:** 100ml\n• **Release Date:** 2022\n• **EAN:** 3614273638852\n\nWe only sell 100% original perfumes, always in stock and sourced from trusted suppliers.`;

	const DEFAULT_SHIPPING = `This policy is applicable to **United Kingdom** orders. This policy is designed to ensure that you are clearly aware of our shipping policies and procedures. By ordering from this store you accept the policies contained herein.\n\n**Delivery Terms**\nWe use UPS, DHL, and OSM to deliver the product.\n\n**TRANSIT, HANDLING & ORDER CUT-OFF TIME:**\n• Transit time is 0-1 Business Days (Monday–Sunday)\n• Handling time is 1 business day (Monday–Sunday)\n• All destinations: 1-2 business days\n• Order cut-off time: 05:00 PM (GMT)\n\n**Delivery Time:**\nStandard UK delivery typically takes 1 to 2 business days from the date of dispatch. Delivery times may vary depending on location, weather conditions, and the courier’s schedule.\n\n**SHIPPING COST:**\nFree shipping on all UK orders\n\n**CHANGE OF ADDRESS**\nWe cannot change the delivery address once an order is in transit. If you need to change the address, contact us within 24 hours of placing your order at support@perfumify.co.uk\n\n**Order Tracking:**\nAll parcels are sent with tracking; you will receive an email with your tracking number once your order has been shipped.\n\n**WRONG ADDRESS**\nIf an incorrect address is provided and delivery fails, the parcel will be returned to us. You will need to pay the full re-shipping cost.\n\n**Cancellations**\nYou may cancel any time before dispatch. If the order has already been dispatched, please refer to our refund policy.\n\nCustomer support: 24/7\nEmail: support@perfumify.co.uk\nAddress: 33 Richard Road, Rotherham, S60 2QP, England, United Kingdom`;

	const DEFAULT_REFUND = `This policy is applicable to **United Kingdom** orders. By ordering from this store (Perfumify) you accept the policies contained herein.\n\n**Return Eligibility:**\n• Item must be unused, unopened, and in the same condition received.\n• Must be in original packaging with protective seal intact.\n• We cannot accept returns on items that have been opened, tested, or used.\n\n**Exceptions / Non-Returnable Items**\n• Opened perfumes, beauty products, or personal-care goods (hygiene reasons).\n• Custom or personalised items.\n• Gift cards.\n• Sale / discounted items.\n\n**Return Shipping Costs**\nReturn shipping is **free** for UK customers – we provide a prepaid return label.\n\n**Steps for Returning an Item**\n1. Email us at support@perfumify.co.uk within 30 days of receiving your order.\n2. Once approved we’ll send a prepaid label and instructions.\n\n**Return Address:**\nPerfumify\n33 Richard Road\nRotherham\nS60 2QP\nEngland, United Kingdom\n\n**Refund Timing**\nRefunds are processed within 10 business days of receiving your return.\n\n**European Union 14-Day Cooling-Off Period**\nEU customers may cancel within 14 days provided items are unused and unopened.\n\nFor any questions contact support@perfumify.co.uk`; 

	// ---------------------------------------------------------

	const getFallback = (key: 'description'|'shipping'|'refund') => {
        if (key === 'description') return DEFAULT_DESCRIPTION;
        if (key === 'shipping') return DEFAULT_SHIPPING;
        return DEFAULT_REFUND;
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
						{hasCloudImages ? (
							<CloudImage
								publicId={cloudGallery[selectedImage]?.public_id}
								alt={data?.name || "Product Image"}
								width={1200}
								height={1200}
								className="w-full h-auto"
							/>
						) : (
							<img
								src={gallery[selectedImage]?.original || "/assets/placeholder/products/product-gallery.svg"}
								alt={data?.name}
								className="w-full h-auto"
							/>
						)}
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
									className={`relative bg-gray-100 rounded overflow-hidden cursor-pointer border-2 transition flex-shrink-0 ${selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
										}`}
								>
									{hasCloudImages ? (
										<CloudImage
											publicId={image.public_id}
											alt={`${data?.name} ${index + 1}`}
											width={100}
											height={100}
											className="w-full h-16 lg:h-20 object-cover"
										/>
									) : (
										<img
											src={image?.thumbnail || "/assets/placeholder/products/product-gallery.svg"}
											alt={`${data?.name} ${index + 1}`}
											className="w-full h-16 lg:h-20 object-cover"
										/>
									)}
								</div>
							))}
						</div>
					)}

					{/* Main Image */}
					<div
						className="flex-1 relative bg-gray-50 rounded overflow-hidden cursor-zoom-in max-h-[500px] lg:max-h-[600px]"
						onClick={() => setShowImageModal(true)}
					>
						{hasCloudImages ? (
							<CloudImage
								publicId={cloudGallery[selectedImage]?.public_id}
								alt={data?.name || "Product image"}
								width={800}
								height={800}
								className="w-full h-full object-contain"
							/>
						) : (
							<Image
								src={gallery[selectedImage]?.original || "/assets/placeholder/products/product-gallery.svg"}
								alt={data?.name || "Product image"}
								width={800}
								height={800}
								className="w-full h-full object-contain"
							/>
						)}
					</div>
				</div>

				{/* Right: Product Info */}
				<div className="space-y-3">
					{/* Product Name */}
					<h1 className="text-2xl lg:text-3xl font-bold text-heading leading-tight">{data?.name}</h1>

					{/* Rating */}
					<div className="flex items-center space-x-2">
						<div className="flex items-center">
							{renderStars(avgRating || 0)}
						</div>
						<span className="text-sm text-gray-600">({reviewCount} reviews)</span>
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
								<span className="text-sm font-semibold text-red-600">{discount}</span>
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
							className={`w-full ${!isSelected && "bg-gray-400 hover:bg-gray-400"
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
								{(() => {
									const catSlug = typeof data.category === 'object' ? String((data.category as any).slug) : String(data.category);
									const catName = typeof data.category === 'object' ? String((data.category as any).name) : String(data.category);
									return (
										<Link
											href={`/search?category=${encodeURIComponent(catSlug)}`}
											className="text-gray-600 hover:text-heading transition text-xs"
										>
											{catName}
										</Link>
									);
								})()}
							</div>
						)}
						{Array.isArray((data as any)?.tags) && (data as any).tags.length > 0 && (
							<div className="flex items-start">
								<span className="font-semibold text-heading min-w-[70px]">Tags:</span>
								<div className="flex flex-wrap gap-1.5">
									{((data as any).tags as any[]).map((tag: any, index: number) => {
										const slugStr = typeof tag === 'string' ? tag : String((tag && (tag.slug || tag.name)) ?? '');
										const nameStr = typeof tag === 'string' ? tag : String((tag && (tag.name || tag.slug)) ?? '');
										const keyVal = String((tag && (tag._id || tag.id || tag.slug || tag.name)) ?? slugStr);
										return (
											<Link
												key={keyVal}
												href={`/search?tag=${encodeURIComponent(slugStr)}`}
												className="text-gray-600 hover:text-heading transition text-xs"
											>
												{nameStr}
												{index < ((data as any).tags as any[]).length - 1 ? "," : ""}
											</Link>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Details Tabs (toggle) */}
			<div className="mt-8 lg:mt-10">
				<div className="border-b border-gray-200">
					<div className="flex space-x-8 overflow-x-auto">
						{[
							{ id: 'description', label: 'Product description' },
							{ id: 'shipping', label: 'Shipping policy' },
							{ id: 'refund', label: 'Refund policy' },
						].map((t) => (
							<button
								key={t.id}
								onClick={() => setActiveTab(t.id as any)}
								className={`py-3 px-1 text-sm font-medium whitespace-nowrap border-b-2 transition ${activeTab === t.id ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
							>
								{t.label}
							</button>
						))}
					</div>
				</div>
				<div className="py-6">
					{activeTab === 'description' && (
						<div className="prose max-w-none">
							{data?.description ? (
								<div className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: String(data.description) }} />
							) : (
								<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{getFallback('description')}</p>
							)}
						</div>
					)}
					{activeTab === 'shipping' && (
						<div className="prose max-w-none">
							{(data as any)?.shipping_policy ? (
								<div className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: String((data as any).shipping_policy) }} />
							) : (
								<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{getFallback('shipping')}</p>
							)}
						</div>
					)}
					{activeTab === 'refund' && (
						<div className="prose max-w-none">
							{(data as any)?.refund_policy ? (
								<div className="text-gray-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: String((data as any).refund_policy) }} />
							) : (
								<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{getFallback('refund')}</p>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Reviews Section */}
			<div className="mt-8 lg:mt-10 space-y-4">
				<h2 className="text-xl font-semibold">Customer Reviews</h2>
				<div className="flex items-center space-x-4">
					<div className="text-4xl font-bold">{avgRating}</div>
					<div>
						<div className="flex items-center mb-1">{renderStars(avgRating || 0)}</div>
						<p className="text-sm text-gray-600">Based on {reviewCount} reviews</p>
					</div>
				</div>
				<div className="space-y-3">
					{reviews.length === 0 && (
						<p className="text-sm text-gray-600">No reviews yet.</p>
					)}
					{reviews.map((r) => (
						<div key={r._id} className="border rounded p-3">
							<div className="flex items-center justify-between mb-1">
								<span className="font-semibold text-sm">{r.name}</span>
								<div className="flex items-center">{renderStars(r.rating)}</div>
							</div>
							<p className="text-sm text-gray-700 whitespace-pre-line">{r.comment}</p>
							<p className="text-[11px] text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
						</div>
					))}
				</div>

				{hasMoreReviews && (
					<div className="pt-2">
						<button
							onClick={loadMoreReviews}
							disabled={loadingMoreReviews}
							className="px-4 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
						>
							{loadingMoreReviews ? 'Loading…' : 'Load more reviews'}
						</button>
					</div>
				)}

				{/* Add Review */}
				<div className="mt-4 border-t pt-4">
					<h4 className="font-semibold mb-2">Write a review</h4>
					<form
						onSubmit={async (e) => {
							e.preventDefault();
							const productId = (data as any)?._id || (data as any)?.id;
							if (!productId) return;
							setSubmittingReview(true);
							try {
								const res = await fetch('/api/reviews', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify({ product: productId, ...reviewForm }),
								});
								const json = await res.json();
								if (res.ok) {
									toast('Review submitted for approval', { type: 'success', autoClose: 2000 });
									setReviewForm({ name: "", email: "", rating: 5, comment: "" });
								} else {
									toast(json.error || 'Failed to submit review', { type: 'error' });
								}
							} catch (err) {
								toast('Failed to submit review', { type: 'error' });
							} finally {
								setSubmittingReview(false);
							}
						}}
						className="space-y-2"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<input
								className="w-full px-3 py-2 border rounded"
								placeholder="Your name"
								value={reviewForm.name}
								onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
								required
							/>
							<input
								className="w-full px-3 py-2 border rounded"
								placeholder="Email (optional)"
								type="email"
								value={reviewForm.email}
								onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
							/>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<select
								className="w-full px-3 py-2 border rounded"
								value={reviewForm.rating}
								onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
							>
								{[5,4,3,2,1].map((r) => (
									<option key={r} value={r}>{r} Star{r>1?'s':''}</option>
								))}
							</select>
						</div>
						<textarea
							className="w-full px-3 py-2 border rounded min-h-[100px]"
							placeholder="Your review"
							value={reviewForm.comment}
							onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
							required
						/>
						<Button type="submit" variant="slim" disabled={submittingReview} loading={submittingReview}>
							Submit Review
						</Button>
						<p className="text-xs text-gray-500">Your review will appear after admin approval.</p>
					</form>
				</div>
			</div>

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
