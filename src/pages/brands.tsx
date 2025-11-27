import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";

import { useBrandsQuery } from "@framework/brand/get-all-brands";
import BrandCardLoader from "@components/ui/loaders/brand-card-loader";

export default function BrandsPage() {
	const router = useRouter();
	const { data, isLoading, error } = useBrandsQuery({ limit: 100 });

	const handleBrandClick = (slug: string) => {
		router.push(`/search?brand=${slug}`);
	};

	if (error) return <p>{error.message}</p>;

	return (
		<>
			<Container>
				<div className="py-8 lg:py-12">
					<div className="max-w-6xl mx-auto">
						{/* Page Title */}
						<h1 className="text-3xl lg:text-4xl font-bold text-heading mb-16 text-center">
							Perfume Brands
						</h1>

						{/* Brands Grid */}
						{isLoading ? (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
								{Array.from({ length: 8 }).map((_, idx) => (
									<BrandCardLoader key={idx} />
								))}
							</div>
						) : (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
								{data?.brands?.map((brand) => (
									<div
										key={brand.id || brand._id}
										onClick={() => handleBrandClick(brand.slug)}
										className="cursor-pointer group text-center"
									>
										{/* Brand Image Container */}
										<div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 group-hover:shadow-lg transition-all duration-300">
											<Image
												src={brand.image?.url || brand.image || "/assets/placeholder/brand.svg"}
												alt={brand.name}
												fill
												className="group-hover:scale-105 transition-transform duration-300 object-cover"
											/>
										</div>

										{/* Brand Name */}
										<h3 className="text-lg font-semibold text-heading group-hover:text-accent transition-colors duration-300">
											{brand.name}
										</h3>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</Container>
		</>
	);
}

BrandsPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"forms",
				"menu",
				"footer",
			])),
		},
		revalidate: 86400,
	};
};
