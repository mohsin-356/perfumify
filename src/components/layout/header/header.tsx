import React, { useRef } from "react";
import Link from "next/link";
import SearchIcon from "@components/icons/search-icon";
import { siteSettings } from "@settings/site-settings-perfume";
import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import { useActiveScroll } from "@utils/add-active-scroll";
import dynamic from "next/dynamic";
import TopBanner from "./top-banner";

const CartButton = dynamic(() => import("@components/cart/cart-button"), {
	ssr: false,
});

type DivElementRef = React.MutableRefObject<HTMLDivElement>;
const { site_header } = siteSettings;

const Header: React.FC = () => {
	const {
		openSidebar,
		setDrawerView,
		openSearch,
	} = useUI();
	const siteHeaderRef = useRef() as DivElementRef;
	useActiveScroll(siteHeaderRef);

	function handleMobileMenu() {
		setDrawerView("MOBILE_MENU");
		return openSidebar();
	}

	return (
		<>
			{/* Top Banner */}
			<TopBanner />
			
			{/* Main Header */}
			<header
				id="siteHeader"
				ref={siteHeaderRef}
				className="w-full h-16 sm:h-20 lg:h-24 relative z-20 bg-white border-b border-gray-200"
			>
				<div className="flex items-center justify-between mx-auto max-w-[1920px] h-full px-4 lg:px-6">
					{/* Logo */}
					<div className="flex items-center">
						<Logo />
					</div>

					{/* Navigation Menu - Desktop */}
					<nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
						{site_header.menu.map((item) => (
							<div key={item.id} className="relative group">
								<Link href={item.path} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 uppercase tracking-wide">
									{item.label}
									{item.subMenu && (
										<span className="ml-1">▼</span>
									)}
								</Link>
								
								{/* Dropdown Menu */}
								{item.subMenu && (
									<div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
										<div className="py-2">
											{item.subMenu.map((subItem) => (
												<Link key={subItem.id} href={subItem.path} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
													{subItem.label}
												</Link>
											))}
										</div>
									</div>
								)}
							</div>
						))}
					</nav>

					{/* Right Side Actions */}
					<div className="flex items-center space-x-4">
						{/* Search Icon */}
						<button
							className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
							onClick={openSearch}
							aria-label="Search"
						>
							<SearchIcon className="w-5 h-5" />
						</button>

						{/* Cart Icon */}
						<CartButton />

						{/* Mobile Menu Button */}
						<button
							aria-label="Menu"
							className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
							onClick={handleMobileMenu}
						>
							<div className="w-6 h-6 flex flex-col justify-center items-center">
								<span className="block w-5 h-0.5 bg-current mb-1"></span>
								<span className="block w-5 h-0.5 bg-current mb-1"></span>
								<span className="block w-5 h-0.5 bg-current"></span>
							</div>
						</button>
					</div>
				</div>
			</header>
		</>
	);
};

export default Header;
