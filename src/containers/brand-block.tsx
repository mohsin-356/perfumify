import Card from "@components/common/card";
import SectionHeader from "@components/common/section-header";
import Carousel from "@components/ui/carousel/carousel";
import CardRoundedLoader from "@components/ui/loaders/card-rounded-loader";
import { useBrandsQuery } from "@framework/brand/get-all-brands";
import { ROUTES } from "@utils/routes";
import Alert from "@components/ui/alert";

interface BrandProps {
	sectionHeading: string;
	className?: string;
}

const breakpoints = {
	"1720": {
		slidesPerView: 8,
		spaceBetween: 28,
	},
	"1400": {
		slidesPerView: 7,
		spaceBetween: 28,
	},
	"1025": {
		slidesPerView: 6,
		spaceBetween: 28,
	},
	"768": {
		slidesPerView: 5,
		spaceBetween: 20,
	},
	"500 ": {
		slidesPerView: 4,
		spaceBetween: 20,
	},
	"0": {
		slidesPerView: 3,
		spaceBetween: 12,
	},
};

const BrandBlock: React.FC<BrandProps> = ({
	className = "mb-11 md:mb-11 lg:mb-12 xl:mb-14 lg:pb-1 xl:pb-0",
	sectionHeading,
}) => {
	const { data, isLoading, error } = useBrandsQuery({
		limit: 8,
	});
	// Dedupe brands by ID to prevent duplicates
	const uniqueBrands = data?.brands?.filter((brand, index, self) =>
		index === self.findIndex((t) => (
			t.id === brand.id || t._id === brand._id
		))
	);
	const brands = uniqueBrands;
	return (
		<div className={className}>
			<SectionHeader sectionHeading={sectionHeading} />

			{error ? (
				<Alert message={error?.message} />
			) : (
				<Carousel breakpoints={breakpoints} buttonClassName="-mt-8 md:-mt-12">
					{isLoading && !data
						? Array.from({ length: 10 }).map((_, idx) => (
							<div key={idx}>
								<CardRoundedLoader uniqueKey={`category-${idx}`} />
							</div>
						))
						: brands?.map((brand) => (
							<div key={`brand--key${brand.id}`}>
								<Card
									item={brand}
									variant="rounded"
									size="medium"
									href={{
										pathname: ROUTES.SEARCH,
										query: { brand: brand.slug },
									}}
								/>
							</div>
						))}
				</Carousel>
			)}
		</div>
	);
};

export default BrandBlock;
