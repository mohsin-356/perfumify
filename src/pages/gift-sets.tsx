import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import { ShopFilters } from "@components/shop/filters";
import StickyBox from "react-sticky-box";
import { ProductGrid } from "@components/product/product-grid";
import SearchTopBar from "@components/shop/top-bar";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import ShopDiscount from "@components/shop/discount";

export default function GiftSetsPage() {
	return (
		<>
			<ShopDiscount />
			<Container>
				<div className={`flex pt-8 pb-16 lg:pb-20`}>
					<div className="flex-shrink-0 pe-24 hidden lg:block w-96">
						<StickyBox offsetTop={50} offsetBottom={20}>
							<div className="mb-8">
								<h2 className="text-2xl font-bold text-heading mb-5">
									Gift Sets
								</h2>
								<p className="text-base text-body leading-relaxed">
									Discover our exclusive collection of premium perfume gift sets. 
									Perfect for special occasions, celebrations, or treating yourself 
									to luxury fragrances beautifully packaged.
								</p>
							</div>
							<ShopFilters />
						</StickyBox>
					</div>
					<div className="w-full lg:ps-7 lg:-ms-2">
						<div className="mb-8 text-center lg:text-left">
							<h1 className="text-3xl md:text-4xl font-bold text-heading mb-3">
								Premium Perfume Gift Sets
							</h1>
							<p className="text-base text-body max-w-2xl">
								Luxurious gift sets featuring premium fragrances from world-renowned brands. 
								Each set is thoughtfully curated and elegantly packaged.
							</p>
						</div>
						<SearchTopBar />
						<ProductGrid />
					</div>
				</div>
			</Container>
		</>
	);
}

GiftSetsPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale!, [
				"common",
				"forms",
				"menu",
				"footer",
			])),
		},
	};
};
