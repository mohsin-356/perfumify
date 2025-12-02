export const footer = {
	widgets: [
    // Main menu
    {
      id: 2,
      widgetTitle: "Main Menu",
      lists: [
        { id: 1, title: "Home", path: "/" },
        { id: 2, title: "Perfume Brands", path: "/brands" },
        { id: 3, title: "Men", path: "/category/men" },
        { id: 4, title: "Women", path: "/category/women" },
        { id: 5, title: "All Products", path: "/products" },
        { id: 6, title: "About", path: "/about" },
        { id: 7, title: "Contact", path: "/contact-us" },
      ],
    },
    // Our Policies
    {
      id: 3,
      widgetTitle: "Our Policies",
      lists: [
        { id: 1, title: "Privacy Policy", path: "/privacy" },
        { id: 2, title: "Terms of Service", path: "/terms" },
        { id: 3, title: "Refund Policy", path: "/refund-policy" },
        { id: 4, title: "Shipping Policy", path: "/shipping-policy" },
        { id: 5, title: "Contact Information", path: "/contact-us" },
      ],
    },
    // About
    {
      id: 4,
      widgetTitle: "About",
      lists: [
        { id: 1, title: "About", path: "/about" },
        { id: 2, title: "Contact", path: "/contact-us" },
        { id: 3, title: "FAQ's", path: "/faq" },
        { id: 4, title: "Authenticity Guarantee", path: "/authenticity" },
        { id: 5, title: "Secure Checkout", path: "/secure-checkout" },
        { id: 6, title: "Billing Terms & Conditions", path: "/billing-terms" },
      ],
    },
    // Contact Information
    {
      id: 5,
      widgetTitle: "Contact Info",
      lists: [
        { id: 1, title: "Perfumify 786", path: "/" },
        { id: 2, title: "Address: B82TT St Agathas road 93, Birmingham, England, United Kingdom", path: "/" },
        { id: 3, title: "Company Number: 15735984", path: "/" },
        { id: 4, title: "Email: info@perfumify786.co.uk", path: "mailto:info@perfumify786.co.uk" },
        { id: 5, title: "TEL: +447782274831", path: "tel:+447782274831" },
      ],
    },
	],
	payment: [
		{
			id: 1,
			path: "/",
			image: "/assets/images/payment/mastercard.svg",
			name: "payment-master-card",
			width: 34,
			height: 20,
		},
		{
			id: 2,
			path: "/",
			image: "/assets/images/payment/visa.svg",
			name: "payment-visa",
			width: 50,
			height: 20,
		},
		{
			id: 3,
			path: "/",
			image: "/assets/images/payment/paypal.svg",
			name: "payment-paypal",
			width: 76,
			height: 20,
		},
		{
			id: 4,
			path: "/",
			image: "/assets/images/payment/jcb.svg",
			name: "payment-jcb",
			width: 26,
			height: 20,
		},
		{
			id: 5,
			path: "/",
			image: "/assets/images/payment/skrill.svg",
			name: "payment-skrill",
			width: 39,
			height: 20,
		},
	],
};
