import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import ProductSingleDetails from "@components/product/product-single-details";
import Divider from "@components/ui/divider";
import Breadcrumb from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import Head from "next/head";

export default function ProductDetailsPage() {
	return (
		<>
			<Head>
				<title>Product Details | Chawkbazar Perfumes</title>
				<meta name="description" content="Discover luxury perfumes and fragrances at Chawkbazar. Shop authentic designer scents with detailed product information." />
			</Head>
			<Divider className="mb-0" />
			<Container>
				<div className="pt-8">
					<Breadcrumb />
				</div>
				<ProductSingleDetails />
				<Subscription />
			</Container>
		</>
	);
}

ProductDetailsPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
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
