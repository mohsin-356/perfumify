import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import { ManagedUIContext } from "@contexts/ui.context";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";
// import { ReactQueryDevtools } from "react-query/devtools";
import { appWithTranslation } from "next-i18next";
import { DefaultSeo } from "@components/common/default-seo";

const ManagedModal = dynamic(() => import("@components/common/modal/managed-modal"), { ssr: false });
const ManagedDrawer = dynamic(() => import("@components/common/drawer/managed-drawer"), { ssr: false });
const ToastContainer = dynamic(() => import("react-toastify").then(m => m.ToastContainer), { ssr: false });

// Load Open Sans and satisfy typeface font - optimized for performance
import "@fontsource/open-sans"; // Base font with font-display: swap
import "@fontsource/open-sans/600.css"; // Semibold
import "@fontsource/open-sans/700.css"; // Bold
import "@fontsource/satisfy"; // Decorative font
// external
import "react-toastify/dist/ReactToastify.css";
// base css file
import "@styles/scrollbar.css";
import "@styles/swiper-carousel.css";
import "@styles/custom-plugins.css";
import "@styles/tailwind.css";
import { getDirection } from "@utils/get-direction";

function handleExitComplete() {
	if (typeof window !== "undefined") {
		window.scrollTo({ top: 0 });
	}
}

const Noop: React.FC = ({ children }) => <>{children}</>;

const CustomApp = ({ Component, pageProps }: AppProps) => {
	const queryClientRef = useRef<any>();
	if (!queryClientRef.current) {
		queryClientRef.current = new QueryClient({
			defaultOptions: {
				queries: {
					staleTime: 1000 * 60 * 5,
					cacheTime: 1000 * 60 * 10,
					refetchOnWindowFocus: false,
					refetchOnReconnect: false,
					retry: 1,
				},
			},
		});
	}
	const router = useRouter();
	const dir = getDirection(router.locale);
	useEffect(() => {
		document.documentElement.dir = dir;
	}, [dir]);
	const Layout = (Component as any).Layout || Noop;

	return (
		<AnimatePresence exitBeforeEnter onExitComplete={handleExitComplete}>
			<QueryClientProvider client={queryClientRef.current}>
				<Hydrate state={pageProps.dehydratedState}>
					<ManagedUIContext>
						<Layout pageProps={pageProps}>
							<DefaultSeo />
							<Component {...pageProps} key={router.route} />
							<ToastContainer />
						</Layout>
						<ManagedModal />
						<ManagedDrawer />
					</ManagedUIContext>
				</Hydrate>
				{/* <ReactQueryDevtools /> */}
			</QueryClientProvider>
		</AnimatePresence>
	);
};

export default appWithTranslation(CustomApp);
