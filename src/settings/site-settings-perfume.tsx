export const siteSettings = {
	name: "Perfumify",
	description:
		"Premium perfume e-commerce store offering designer and niche fragrances for men, women, and unisex.",
	author: {
		name: "Perfumify",
		websiteUrl: "https://perfumify.example.com",
		address: "",
	},
	logo: {
		url: "/favicon.ico.png",
		alt: "Perfumify",
		href: "/",
		width: 120,
		height: 80,
	},
	defaultLanguage: "en",
	currencyCode: "GBP",
	site_header: {
		menu: [
			{
				id: 1,
				path: "/",
				label: "HOME",
			},
			{
				id: 2,
				path: "/brands",
				label: "PERFUME BRANDS",
				subMenu: [
					{
						id: 1,
						path: "/search?brand=azzaro",
						label: "Azzaro",
					},
					{
						id: 2,
						path: "/search?brand=carolina-herrera",
						label: "Carolina Herrera",
					},
					{
						id: 3,
						path: "/search?brand=calvin-klein",
						label: "Calvin Klein",
					},
					{
						id: 4,
						path: "/search?brand=chanel",
						label: "CHANEL",
					},
					{
						id: 5,
						path: "/search?brand=creed",
						label: "Creed",
					},
					{
						id: 6,
						path: "/search?brand=dior",
						label: "Dior",
					},
					{
						id: 7,
						path: "/search?brand=giorgio-armani",
						label: "GIORGIO ARMANI",
					},
					{
						id: 8,
						path: "/search?brand=prada",
						label: "Prada",
					},
					{
						id: 9,
						path: "/search?brand=tom-ford",
						label: "TOM FORD",
					},
					{
						id: 10,
						path: "/search?brand=valentino",
						label: "Valentino",
					},
				],
			},
			{
				id: 3,
				path: "/search?gender=men",
				label: "MEN",
			},
			{
				id: 4,
				path: "/search?gender=women",
				label: "WOMEN",
			},
			{
				id: 5,
				path: "/search",
				label: "ALL PRODUCTS",
			},
			{
				id: 6,
				path: "/about",
				label: "ABOUT",
			},
			{
				id: 7,
				path: "/contact-us",
				label: "CONTACT",
			},
		],
		mobileMenu: [
			{
				id: 1,
				path: "/",
				label: "HOME",
			},
			{
				id: 2,
				path: "/brands",
				label: "PERFUME BRANDS",
			},
			{
				id: 3,
				path: "/search?gender=men",
				label: "MEN",
			},
			{
				id: 4,
				path: "/search?gender=women",
				label: "WOMEN",
			},
			{
				id: 5,
				path: "/search",
				label: "ALL PRODUCTS",
			},
			{
				id: 6,
				path: "/about",
				label: "ABOUT",
			},
			{
				id: 7,
				path: "/contact-us",
				label: "CONTACT",
			},
		],
		languageMenu: [], // Language switcher removed - English only
		pagesMenu: [
			{
				id: 1,
				path: "/search",
				label: "menu-best-deals",
			},
			{
				id: 2,
				path: "/about",
				label: "menu-about-us",
			},
			{
				id: 3,
				path: "/contact-us",
				label: "menu-contact-us",
			},
			{
				id: 4,
				path: "/faq",
				label: "menu-faq",
			},
		],
	},
};
