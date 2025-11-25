import Container from "@components/ui/container";
import Divider from "@components/ui/divider";
import HeroSlider from "@components/common/hero-slider";
import dynamic from "next/dynamic";
import Layout from "@components/layout/layout";
const BrandBlock = dynamic(() => import("@containers/brand-block"));
const BestSellerProductFeed = dynamic(() => import("@components/product/feeds/best-seller-product-feed"));
const NewArrivalsProductFeed = dynamic(() => import("@components/product/feeds/new-arrivals-product-feed"));
import { GetStaticProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import { API_ENDPOINTS } from "@framework/utils/api-endpoints";
import { fetchFlashSaleProducts } from "@framework/product/get-all-flash-sale-products";
import { fetchCategories } from "@framework/category/get-all-categories";
import { fetchBestSellerProducts } from "@framework/product/get-all-best-seller-products";
import { fetchNewArrivalProducts } from "@framework/product/get-all-new-arrival-products";
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
        <NewArrivalsProductFeed />
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
			[API_ENDPOINTS.NEW_ARRIVAL_PRODUCTS, { limit: 10 }],
			fetchNewArrivalProducts
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
