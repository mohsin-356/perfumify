import cn from "classnames";
import Image from "next/image";
import type { FC } from "react";
import { useState, useEffect, useMemo } from "react";
import { useUI } from "@contexts/ui.context";
import usePrice from "@framework/product/use-price";
import { Product } from "@framework/types";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";
import { useCart } from "@contexts/cart/cart.context";
import { useWishlist } from "@contexts/wishlist/wishlist.context";
import { generateCartItem } from "@utils/generate-cart-item";
import { toast } from "react-toastify";
import { useWindowSize } from "@utils/use-window-size";
import CloudImage from "@components/ui/CloudImage";

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
	imgWidth = 360,
	imgHeight = 500,
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

	// Hooks
	const { width } = useWindowSize();
	const { addItemToCart, isInCart } = useCart();
	const { addItemToWishlist, removeItemFromWishlist, isInWishlist } = useWishlist();

	// Helpers
	const handlePopupView = () => {
		setModalData({ data: product });
		setModalView("PRODUCT_VIEW");
		openModal();
	};

	const asString = (v: any): string | undefined => (typeof v === "string" ? v : undefined);

	// Image sources
	const cloudImage = product?.images?.[0];
	const cloudHoverImage = product?.images?.[1] || cloudImage;

	const firstGallery = Array.isArray(product?.gallery) ? product.gallery[0] : undefined;
	const secondGallery = Array.isArray(product?.gallery) ? product.gallery[1] : undefined;

	const primarySrc =
		product?.images?.[0]?.url ||
		asString((product as any)?.image) ||
		(product as any)?.image?.thumbnail ||
		(product as any)?.image?.original ||
		asString(firstGallery) ||
		(firstGallery as any)?.thumbnail ||
		(firstGallery as any)?.original ||
		placeholderImage;

	const hoverSrc =
		product?.images?.[1]?.url ||
		asString(secondGallery) ||
		(secondGallery as any)?.original ||
		primarySrc;

	const [imgSrc, setImgSrc] = useState<string>(primarySrc);

  useEffect(() => {
    setImgSrc(isHovered ? hoverSrc : primarySrc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered]);

  const descriptionText = useMemo(() => {
    const html = String(product?.description || "");
    const noTags = html.replace(/<[^>]*>/g, " ");
    const decoded = noTags
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'");
    return decoded.replace(/\s+/g, " ").trim();
  }, [product?.description]);

  const descriptionSnippet = useMemo(() => {
    const MAX = 140;
    return descriptionText.length > MAX ? descriptionText.slice(0, MAX) + "…" : descriptionText;
  }, [descriptionText]);

	// Badge
	const badge = (() => {
		if (product.sale_price && product.price > product.sale_price) return { text: "Sale", color: "bg-red-500" };
		if (product.quantity && product.quantity < 10) return { text: "Limited", color: "bg-orange-500" };
		const tags = Array.isArray(product.tags) ? product.tags : [];
		if (tags.includes("hot") || tags.includes("trending")) return { text: "Hot", color: "bg-pink-500" };
		if (tags.includes("new")) return { text: "New", color: "bg-blue-500" };
		return null;
	})();

	// Handlers
	const handleAddToCart = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isInCart(product.id)) return;

		const productForCart = {
			...product,
			image: {
				thumbnail: primarySrc,
				original: primarySrc,
			}
		};

		addItemToCart(generateCartItem(productForCart as any, {}), 1);
		toast("Added to bag", {
			type: "dark",
			progressClassName: "fancy-progress-bar",
			position: width > 768 ? "bottom-right" : "top-right",
			autoClose: 2000,
		});
	};

	const toggleWishlist = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isInWishlist(product.id)) {
			removeItemFromWishlist(product.id);
		} else {
			addItemToWishlist(product);
		}
	};

	return (
		<div
			className={cn(
				"group box-border overflow-hidden flex rounded-md cursor-pointer relative",
				{
					"pe-0 pb-2 lg:pb-3 flex-col items-start bg-white transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-product":
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
			onClick={handlePopupView}
		>
			{/* Badge */}
			{badge && (
				<div className={cn("absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-10 shadow-lg", badge.color)}>
					{badge.text}
				</div>
			)}

			{/* Image */}
			<div
				className={cn(
					"flex relative",
					{
						"mb-3 md:mb-3.5 w-full": variant === "grid",
						"mb-3 md:mb-3.5 pb-0": variant === "gridSlim",
						"flex-shrink-0 w-32 sm:w-44 md:w-36 lg:w-44": variant === "listSmall",
					},
					imageContentClassName
				)}
			>
				{cloudImage ? (
					<CloudImage
						publicId={isHovered && cloudHoverImage ? cloudHoverImage.public_id : cloudImage.public_id}
						alt={product?.name || "Product Image"}
						width={Number(imgWidth) || 340}
						height={Number(imgHeight) || 440}
						className={cn("bg-gray-300 object-cover rounded-s-md transition-all duration-300", {
							"w-full rounded-md group-hover:rounded-b-none": variant === "grid",
							"rounded-md transform group-hover:scale-105": variant === "gridSlim",
							"rounded-s-md transform group-hover:scale-105": variant === "list",
						})}
					/>
				) : (
					<Image
						src={imgSrc}
						width={Number(imgWidth) || 340}
						height={Number(imgHeight) || 440}
						loading={imgLoading}
						unoptimized
						quality={70}
						sizes="(min-width: 1536px) 20vw, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
						alt={product?.name || "Product Image"}
						onError={() => setImgSrc(placeholderImage)}
						className={cn("bg-gray-300 object-cover rounded-s-md transition-all duration-300", {
							"w-full rounded-md group-hover:rounded-b-none": variant === "grid",
							"rounded-md transform group-hover:scale-105": variant === "gridSlim",
							"rounded-s-md transform group-hover:scale-105": variant === "list",
						})}
					/>
				)}

				{/* Action buttons */}
				{variant === "grid" && (
					<div
						className={cn(
							"absolute bottom-0 left-0 right-0 flex justify-center items-center gap-2 p-3 backdrop-blur-sm bg-white/30 rounded-b-md transition-all duration-300",
							{
								"opacity-100 translate-y-0": isHovered,
								"opacity-0 translate-y-full": !isHovered,
							}
						)}
					>
						{/* Cart */}
						<button
							onClick={handleAddToCart}
							className="flex items-center justify-center w-10 h-10 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
							title="Add to Cart"
						>
							<FiShoppingCart className="w-5 h-5" />
						</button>
						{/* Quick view */}
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
						{/* Wishlist */}
						<button
							onClick={toggleWishlist}
							className="flex items-center justify-center w-10 h-10 bg-white text-black rounded-full hover:bg-gray-100 transition-colors border-2 border-gray-200"
							title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
						>
							<FiHeart className="w-5 h-5" />
						</button>
					</div>
				)}
			</div>

			{/* Info */}
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
			>
				<h2
					className={cn("text-heading font-semibold truncate mb-1", {
						"text-sm md:text-base": variant === "grid",
						"md:mb-1.5 text-sm sm:text-base md:text-sm lg:text-base xl:text-lg": variant === "gridSlim",
						"text-sm sm:text-base md:mb-1.5 pb-0": variant === "listSmall",
						"text-sm sm:text-base md:text-sm lg:text-base xl:text-lg md:mb-1.5": variant === "list",
					})}
				>
					{product?.name}
				</h2>
				{product?.description && (
					<p suppressHydrationWarning className="text-body text-xs lg:text-sm leading-normal xl:leading-relaxed max-w-[250px] truncate">
						{descriptionSnippet}
					</p>
				)}
				<div
					className={cn("text-heading font-semibold mt-1.5 space-s-2", {
						"text-sm sm:text-base lg:text-lg": variant === "grid",
						"text-sm sm:text-xl lg:text-xl": variant !== "grid",
					})}
				>
					<span>{price}</span>
					{discount && <del className="sm:text-base font-normal text-gray-800">{basePrice}</del>}
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
