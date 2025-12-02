import Container from "@components/ui/container";
import Divider from "@components/ui/divider";
import HeroSlider from "@components/common/hero-slider";
import dynamic from "next/dynamic";
import Layout from "@components/layout/layout";
import BrandCardLoader from "@components/ui/loaders/brand-card-loader";
import ProductFeedLoader from "@components/ui/loaders/product-feed-loader";
const BrandBlock = dynamic(() => import("@containers/brand-block"), {
	loading: () => (
		<div className="mt-8 md:mt-10 lg:mt-12 mb-11 md:mb-12 xl:mb-14">
			<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-5">
				{Array.from({ length: 8 }).map((_, idx) => (
					<BrandCardLoader key={idx} />
				))}
			</div>
		</div>
	),
});
const BestSellerProductFeed = dynamic(
	() => import("@components/product/feeds/best-seller-product-feed"),
	{
		loading: () => (
			<div className="mt-8">
				<ProductFeedLoader limit={10} uniqueKey="best-sellers-fallback" />
			</div>
		),
	}
);
import { GetStaticProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { fetchFlashSaleProducts } from "@framework/product/get-all-flash-sale-products";
import { fetchCategories } from "@framework/category/get-all-categories";
import { fetchBestSellerProducts } from "@framework/product/get-all-best-seller-products";
import { fetchBrands } from "@framework/brand/get-all-brands";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Home() {
  return (
    <>
      <HeroSlider />
      <Container>
        <BrandBlock sectionHeading="Shop by Brands" className="mt-8 md:mt-10 lg:mt-12 mb-11 md:mb-12 xl:mb-14" />
        <Divider />
        <BestSellerProductFeed />
      </Container>
    </>
  );
}

Home.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();

	const prefetches = [
		queryClient.prefetchQuery(
			[API_ENDPOINTS.FLASH_SALE_PRODUCTS, { limit: 10 }],
			fetchFlashSaleProducts
		),
		queryClient.prefetchQuery(
			[API_ENDPOINTS.CATEGORIES, { limit: 10 }],
			fetchCategories
		),
		queryClient.prefetchQuery(
			[API_ENDPOINTS.BEST_SELLER_PRODUCTS, { limit: 10 }],
			fetchBestSellerProducts
		),
		queryClient.prefetchQuery(
			[API_ENDPOINTS.BRANDS, { limit: 0 }],
			fetchBrands
		),
	];

	// Avoid SSR 500 if any prefetch fails
	await Promise.allSettled(prefetches);

	let i18nProps: Record<string, any> = {};
	try {
		i18nProps = await serverSideTranslations(locale ?? "en", [
			"common",
			"forms",
			"menu",
			"footer",
		]);
	} catch {}

	return {
		props: {
			dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
			...i18nProps,
		},
		revalidate: 60,
	};
};
