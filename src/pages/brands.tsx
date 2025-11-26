import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import Image from "next/image";

export default function BrandsPage() {
	const router = useRouter();

	const brands = [
		{
			id: 1,
			name: "Calvin Klein",
			slug: "calvin-klein",
			image: "/assets/images/brands/images_1.jpg",
		},
		{
			id: 2,
			name: "Azzaro",
			slug: "azzaro",
			image: "/assets/images/brands/images_2.webp",
		},
		{
			id: 3,
			name: "Creed",
			slug: "creed",
			image: "/assets/images/brands/images_3.webp",
		},
		{
			id: 4,
			name: "Dior",
			slug: "dior",
			image: "/assets/images/brands/images_4.webp",
		},
		{
			id: 5,
			name: "Prada",
			slug: "prada",
			image: "/assets/images/brands/images_5.webp",
		},
		{
			id: 6,
			name: "Carolina Herrera",
			slug: "carolina-herrera",
			image: "/assets/images/brands/images_6.webp",
		},
		{
			id: 7,
			name: "CHANEL",
			slug: "chanel",
			image: "/assets/images/brands/images_7.png",
		},
		{
			id: 8,
			name: "GIORGIO ARMANI",
			slug: "giorgio-armani",
			image: "/assets/images/brands/images_8.webp",
		},
		{
			id: 9,
			name: "TOM FORD",
			slug: "tom-ford",
			image: "/assets/images/brands/images_9.webp",
		},
		{
			id: 10,
			name: "Valentino",
			slug: "valentino",
			image: "/assets/images/brands/images_10.webp",
		},
	];

	const handleBrandClick = (slug: string) => {
		router.push(`/search?brand=${slug}`);
	};

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
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
							{brands.map((brand) => (
								<div
									key={brand.id}
									onClick={() => handleBrandClick(brand.slug)}
									className="cursor-pointer group text-center"
								>
									{/* Brand Image Container */}
									<div className="relative w-32 h-32 lg:w-40 lg:h-40 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 group-hover:shadow-lg transition-all duration-300">
										<Image
											src={brand.image}
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
