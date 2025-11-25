import cn from "classnames";
import Image from "next/image";
import type { FC } from "react";
import { useState } from "react";
import { useUI } from "@contexts/ui.context";
import usePrice from "@framework/product/use-price";
import { Product } from "@framework/types";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";

interface ProductProps {
	product: Product;
	className?: string;
	contactClassName?: string;
	imageContentClassName?: string;
	variant?: "grid" | "gridSlim" | "list" | "listSmall";
	imgWidth?: number | string;
	imgHeight?: number | string;
	imgLoading?: "eager" | "lazy";
}

const ProductCard: FC<ProductProps> = ({
	product,
	className = "",
	contactClassName = "",
	imageContentClassName = "",
	variant = "list",
	imgWidth = 340,
	imgHeight = 440,
	imgLoading = "lazy",
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const { openModal, setModalView, setModalData } = useUI();
	const placeholderImage = `/assets/placeholder/products/product-${variant}.svg`;
	const { price, basePrice, discount } = usePrice({
		amount: product.sale_price ? product.sale_price : product.price,
		baseAmount: product.price,
		currencyCode: "GBP",
	});
	function handlePopupView() {
		setModalData({ data: product });
		setModalView("PRODUCT_VIEW");
		return openModal();
	}
	// Get badge type based on product data
	const getBadge = () => {
		if (product.sale_price && product.price > product.sale_price) {
			return { text: "Sale", color: "bg-red-500" };
		}
		if (product.quantity && product.quantity < 10) {
			return { text: "Limited", color: "bg-orange-500" };
		}
		const tags = Array.isArray(product.tags) ? product.tags : [];
		if (tags.includes("hot") || tags.includes("trending")) {
			return { text: "Hot", color: "bg-pink-500" };
		}
		if (tags.includes("new")) {
			return { text: "New", color: "bg-blue-500" };
		}
		return null;
	};

	const badge = getBadge();
	// Choose best available image for card display (handle string or object shapes)
	const asString = (v: any): string | undefined => (typeof v === 'string' ? v : undefined);
	const firstGallery = Array.isArray(product?.gallery) ? product.gallery[0] : undefined;
	const secondGallery = Array.isArray(product?.gallery) ? product.gallery[1] : undefined;
	const primarySrc =
		asString((product as any)?.image) ||
		(product as any)?.image?.thumbnail ||
		(product as any)?.image?.original ||
		asString(firstGallery) ||
		(firstGallery as any)?.thumbnail ||
		(firstGallery as any)?.original ||
		placeholderImage;
	const hoverSrc =
		asString(secondGallery) ||
		(secondGallery as any)?.original ||
		primarySrc;
	const currentImage = isHovered ? hoverSrc : primarySrc;
	const [imgSrc, setImgSrc] = useState<string>(currentImage);

	return (
		<div
			className={cn(
				"group box-border overflow-hidden flex rounded-md cursor-pointer relative",
				{
					"pe-0 pb-2 lg:pb-3 flex-col items-start bg-white transition duration-200 ease-in-out transform hover:-translate-y-1 hover:md:-translate-y-1.5 hover:shadow-product":
						variant === "grid",
					"pe-0 md:pb-1 flex-col items-start bg-white": variant === "gridSlim",
					"items-center bg-transparent border border-gray-100 transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-listProduct":
						variant === "listSmall",
					"flex-row items-center transition-transform ease-linear bg-gray-200 pe-2 lg:pe-3 2xl:pe-4":
						variant === "list",
				},
				className
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			role="button"
			title={product?.name}
		>
			{/* Badge */}
			{badge && (
				<div className={`absolute top-3 right-3 ${badge.color} text-white text-xs font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-10 shadow-lg`}>
					{badge.text}
				</div>
			)}

			<div
				className={cn(
					"flex relative",
					{
						"mb-3 md:mb-3.5": variant === "grid",
						"mb-3 md:mb-3.5 pb-0": variant === "gridSlim",
						"flex-shrink-0 w-32 sm:w-44 md:w-36 lg:w-44":
							variant === "listSmall",
					},
					imageContentClassName
				)}
			>
				<Image
					src={imgSrc}
					width={imgWidth}
					height={imgHeight}
					loading={imgLoading}
					unoptimized
					quality={70}
					sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
					alt={product?.name || "Product Image"}
					onError={() => setImgSrc(placeholderImage)}
					className={cn("bg-gray-300 object-cover rounded-s-md transition-all duration-300", {
						"w-full rounded-md group-hover:rounded-b-none":
							variant === "grid",
						"rounded-md transform group-hover:scale-105":
							variant === "gridSlim",
						"rounded-s-md transform group-hover:scale-105":
							variant === "list",
					})}
				/>
				
				{/* Action Buttons on Hover */}
				{variant === "grid" && (
					<div className={`absolute bottom-0 left-0 right-0 flex justify-center items-center gap-2 p-3 bg-white transition-all duration-300 ${
						isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
					}`}>
						<button
							onClick={(e) => {
								e.stopPropagation();
								// Add to cart logic
							}}
							className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
							title="Add to Cart"
						>
							<FiShoppingCart className="w-5 h-5" />
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								handlePopupView();
							}}
							className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-full hover:bg-gray-100 transition-colors border-2 border-gray-200"
							title="Quick View"
						>
							<FiEye className="w-5 h-5" />
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								// Add to wishlist logic
							}}
							className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-full hover:bg-gray-100 transition-colors border-2 border-gray-200"
							title="Add to Wishlist"
						>
							<FiHeart className="w-5 h-5" />
						</button>
					</div>
				)}
			</div>
			<div
				className={cn(
					"w-full overflow-hidden",
					{
						"ps-0 lg:ps-2.5 xl:ps-4 pe-2.5 xl:pe-4": variant === "grid",
						"ps-0": variant === "gridSlim",
						"px-4 lg:px-5 2xl:px-4": variant === "listSmall",
					},
					contactClassName
				)}
				onClick={handlePopupView}
			>
				<h2
					className={cn("text-heading font-semibold truncate mb-1", {
						"text-sm md:text-base": variant === "grid",
						"md:mb-1.5 text-sm sm:text-base md:text-sm lg:text-base xl:text-lg":
							variant === "gridSlim",
						"text-sm sm:text-base md:mb-1.5 pb-0": variant === "listSmall",
						"text-sm sm:text-base md:text-sm lg:text-base xl:text-lg md:mb-1.5":
							variant === "list",
					})}
				>
					{product?.name}
				</h2>
				{product?.description && (
					<p className="text-body text-xs lg:text-sm leading-normal xl:leading-relaxed max-w-[250px] truncate">
						{product?.description}
					</p>
				)}
				<div
					className={`text-heading font-semibold text-sm sm:text-base mt-1.5 space-s-2 ${
						variant === "grid"
							? "lg:text-lg lg:mt-2.5"
							: "sm:text-xl md:text-base lg:text-xl md:mt-2.5 2xl:mt-3"
					}`}
				>
					<span className="inline-block">{price}</span>
					{discount && (
						<del className="sm:text-base font-normal text-gray-800">
							{basePrice}
						</del>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
