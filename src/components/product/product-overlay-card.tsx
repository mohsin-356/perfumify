import Image from "next/image";
import { useState } from "react";
import { useUI } from "@contexts/ui.context";
import usePrice from "@framework/product/use-price";
import { Product } from "@framework/types";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";

interface ProductProps {
	product: Product;
	index: number;
	imgLoading?: "eager" | "lazy";
	variant?: "left" | "center";
}

const ProductOverlayCard: React.FC<ProductProps> = ({
	product,
	index,
	variant = "left",
	imgLoading = "lazy",
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const size =
		(variant === "center" && index === 1) || (variant === "left" && index === 0)
			? 620
			: 260;
	const classes =
		(variant === "center" && index === 1) || (variant === "left" && index === 0)
			? "row-span-full lg:row-span-2 col-span-full lg:col-span-2"
			: "col-span-2 lg:col-span-1";

	const { openModal, setModalView, setModalData } = useUI();
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
	const currentImage = isHovered && product?.gallery?.[1]?.original 
		? product.gallery[1].original 
		: product?.image?.original ?? "/assets/placeholder/products/product-featured.png";

	return (
		<div
			className={`${classes} cursor-pointer group flex flex-col bg-gray-200 rounded-md relative items-center justify-between overflow-hidden`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Badge */}
			{badge && (
				<div className={`absolute top-3 md:top-5 right-3 md:right-5 ${badge.color} text-white text-xs md:text-sm font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-20 shadow-lg`}>
					{badge.text}
				</div>
			)}

			<div
				className="flex justify-center items-center p-4 h-full 3xl:min-h-[330px] relative"
				title={product?.name}
			>
				<Image
					src={currentImage}
					width={size}
					height={size}
					loading={imgLoading}
					unoptimized
					alt={product?.name || "Product Image"}
					className="transition-all duration-500 ease-in-out transform group-hover:scale-110"
				/>

				{/* Action Buttons on Hover */}
				<div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center gap-2 transition-all duration-300 ${
					isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
				}`}>
					<button
						onClick={(e) => {
							e.stopPropagation();
							// Add to cart logic
						}}
						className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg"
						title="Add to Cart"
					>
						<FiShoppingCart className="w-5 h-5" />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							handlePopupView();
						}}
						className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white text-black rounded-full hover:bg-gray-100 transition-colors shadow-lg"
						title="Quick View"
					>
						<FiEye className="w-5 h-5" />
					</button>
					<button
						onClick={(e) => {
							e.stopPropagation();
							// Add to wishlist logic
						}}
						className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white text-black rounded-full hover:bg-gray-100 transition-colors shadow-lg"
						title="Add to Wishlist"
					>
						<FiHeart className="w-5 h-5" />
					</button>
				</div>
			</div>

			<div
				className="flex flex-col md:flex-row lg:flex-col 2xl:flex-row md:justify-between md:items-center lg:items-start 2xl:items-center w-full px-4 md:px-5 3xl:px-7 pb-4 md:pb-5 3xl:pb-7"
				title={product?.name}
				onClick={handlePopupView}
			>
				<div className="md:pe-2 lg:pe-0 2xl:pe-2 overflow-hidden">
					<h2 className="text-heading font-semibold text-sm md:text-base xl:text-lg mb-1 truncate">
						{product?.name}
					</h2>
					<p className="text-body text-xs xl:text-sm leading-normal xl:leading-relaxed truncate max-w-[250px]">
						{product?.description}
					</p>
				</div>
				<div className="flex-shrink-0 flex flex-row-reverse md:flex-col lg:flex-row-reverse 2xl:flex-col items-center md:items-end lg:items-start 2xl:items-end justify-end md:text-end lg:text-start xl:text-end mt-2 md:-mt-0.5 lg:mt-2 2xl:-mt-0.5">
					{discount && (
						<del className="text-sm md:text-base lg:text-sm xl:text-base 3xl:text-lg">
							{basePrice}
						</del>
					)}
					<div className="text-heading font-segoe font-semibold text-base md:text-xl lg:text-base xl:text-xl 3xl:text-2xl 3xl:mt-0.5 pe-2 md:pe-0 lg:pe-2 2xl:pe-0">
						{price}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductOverlayCard;
