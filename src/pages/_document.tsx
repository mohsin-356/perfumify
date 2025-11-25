import Document, {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
} from "next/document";
import { i18n } from "next-i18next";
import { getDirection } from "@utils/get-direction";

export default class CustomDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		return await Document.getInitialProps(ctx);
	}
	render() {
		const { locale } = this.props.__NEXT_DATA__;
		if (process.env.NODE_ENV !== "production") {
			if (i18n && typeof i18n.reloadResources === "function") {
				i18n.reloadResources(locale);
			}
		}
		return (
			<Html dir={getDirection(locale)}>
				<Head>
					<link rel="icon" href="/api/favicon" type="image/jpeg" />
					<meta name="theme-color" content="#7c3aed" />
					<link rel="preconnect" href="https://images.unsplash.com" />
					<link rel="preconnect" href="https://images.pexels.com" />
					<link rel="dns-prefetch" href="https://images.unsplash.com" />
					<link rel="dns-prefetch" href="https://images.pexels.com" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}
