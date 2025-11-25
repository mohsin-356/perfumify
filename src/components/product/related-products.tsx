import { useProductsQuery } from "@framework/product/get-all-products";
import ProductCard from "@components/product/product-card";
import SectionHeader from "@components/common/section-header";

interface RelatedProductsProps {
	sectionHeading?: string;
	category?: string;
	currentProductId?: string | number;
	limit?: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
	sectionHeading = "You Might Also Like",
	category,
	currentProductId,
	limit = 4,
}) => {
	const { data, isLoading, error } = useProductsQuery({
		limit: limit + 1, // Get one extra to exclude current product
	});

	if (isLoading) {
		return (
			<div className="py-8">
				<p className="text-center text-gray-500">Loading related products...</p>
			</div>
		);
	}

	if (error || !data?.pages?.[0]?.data) {
		return null;
	}

	// Get products and filter out current product
	let relatedProducts = data.pages[0].data
		.filter((product: any) => product.id !== currentProductId)
		.slice(0, limit);

	// If category is specified, try to filter by category
	if (category) {
		const categoryProducts = relatedProducts.filter(
			(product: any) => product.category?.slug === category
		);
		if (categoryProducts.length >= limit) {
			relatedProducts = categoryProducts.slice(0, limit);
		}
	}

	if (relatedProducts.length === 0) {
		return null;
	}

	return (
		<div className="py-8 lg:py-10 border-t border-gray-300">
			<SectionHeader
				sectionHeading={sectionHeading}
				className="mb-6 lg:mb-8"
			/>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5 xl:gap-6">
				{relatedProducts.map((product: any) => (
					<ProductCard
						key={`product--key-${product.id}`}
						product={product}
						variant="grid"
						imgWidth={340}
						imgHeight={440}
					/>
				))}
			</div>
		</div>
	);
};

export default RelatedProducts;
