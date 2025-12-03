'use client';

import { NextSeo } from "next-seo";
import Head from "next/head";
import Header from "@components/layout/header/header";
import Footer from "@components/layout/footer/footer";
import dynamic from "next/dynamic";
import CookieBar from "@components/common/cookie-bar";
import { useAcceptCookies } from "@utils/use-accept-cookies";
import Button from "@components/ui/button";
import { useTranslation } from "next-i18next";

const MobileNavigation = dynamic(
    () => import("@components/layout/mobile-navigation/mobile-navigation"),
    { ssr: false }
);
const Search = dynamic(() => import("@components/common/search"), { ssr: false });

type LayoutProps = { children?: React.ReactNode };

const Layout: React.FC<LayoutProps> = ({ children }) => {
	const { acceptedCookies, onAcceptCookies } = useAcceptCookies();
	const { t } = useTranslation("common");
	return (
		<div className="flex flex-col min-h-screen">
			<NextSeo
				additionalMetaTags={[
					{
						name: "viewport",
						content: "width=device-width, initial-scale=1.0",
					},
				]}
				title="Perfumify - Premium Designer Fragrances"
				description="Discover luxury perfumes and designer fragrances for men, women and unisex. Shop authentic scents with fast delivery from Perfumify."
				canonical="https://perfumify.example.com/"
				openGraph={{
					url: "https://perfumify.example.com",
					title: "Perfumify - Premium Designer Fragrances",
					description:
						"Discover luxury perfumes and designer fragrances for men, women and unisex. Shop authentic perfumes from top brands with fast delivery.",
					images: [
						{
							url: "/favicon.ico.png",
							width: 800,
							height: 600,
							alt: "Perfumify",
						},
					],
				}}
			/>
			<Head>
				<link rel="icon" href="/favicon.ico" type="image/x-icon" />
			</Head>
			<Header />
			<main
				className="relative flex-grow"
				style={{
					minHeight: "-webkit-fill-available",
					WebkitOverflowScrolling: "touch",
				}}
			>
				{children}
			</main>
			<Footer />
			<MobileNavigation />
			<Search />
			<CookieBar
				title={t("text-cookies-title")}
				hide={acceptedCookies}
				action={
					<Button onClick={() => onAcceptCookies()} variant="slim">
						{t("text-accept-cookies")}
					</Button>
				}
			/>
		</div>
	);
};

export default Layout;
