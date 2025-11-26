import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import Subscription from "@components/common/subscription";
import ProductSingleDetails from "@components/product/product-single-details";
import Divider from "@components/ui/divider";
import Breadcrumb from "@components/common/breadcrumb";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { connectDB } from "@/lib/db";
import { Product } from "@/models/Product";
import { generateProductOgImageUrl } from "@/lib/cloudinary-client";

interface ProductDetailsPageProps {
	ogImageUrl?: string;
	productTitle?: string;
	productDescription?: string;
}

export default function ProductDetailsPage({ ogImageUrl, productTitle, productDescription }: ProductDetailsPageProps) {
	return (
		<>
			<Head>
				<title>{productTitle ? `${productTitle} | Chawkbazar Perfumes` : 'Product Details | Chawkbazar Perfumes'}</title>
				<meta name="description" content={productDescription || "Discover luxury perfumes and fragrances at Chawkbazar. Shop authentic designer scents with detailed product information."} />
				{ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
				{ogImageUrl && <meta property="twitter:image" content={ogImageUrl} />}
				<meta property="og:title" content={productTitle || 'Product Details'} />
				<meta property="og:description" content={productDescription || ''} />
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

export const getServerSideProps: GetServerSideProps = async ({ locale, params }) => {
	const slug = params?.slug as string;
	let ogImageUrl = null;
	let productTitle = null;
	let productDescription = null;

	try {
		await connectDB();
		const product = await Product.findOne({ slug }).lean();

		if (product) {
			productTitle = product.name;
			productDescription = product.description;
			const mainImage = product.images?.[0];
			if (mainImage) {
				ogImageUrl = generateProductOgImageUrl({
					productTitle: product.name,
					price: product.price,
					productImagePublicId: mainImage.public_id,
				});
			}
		}
	} catch (error) {
		console.error("Error fetching product for SEO:", error);
	}

	return {
		props: {
			ogImageUrl,
			productTitle,
			productDescription,
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"forms",
				"menu",
				"footer",
			])),
		},
	};
};
