import Container from "@components/ui/container";
import Layout from "@components/layout/layout";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import Link from "next/link";

export default function AboutPage() {
	return (
		<>
			<Container>
				<div className="py-8 lg:py-12">
					<div className="max-w-4xl mx-auto">
						{/* Breadcrumb */}
						<div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
							<Link href="/" className="hover:text-gray-900">Home</Link>
							<span>›</span>
							<span>About</span>
						</div>

						{/* Page Title */}
						<h1 className="text-3xl lg:text-4xl font-bold text-heading mb-12 text-center">
							About
						</h1>
						
						<div className="space-y-8 text-sm leading-relaxed">
							{/* Company Info */}
							<div>
								<p><strong>Perfumify 786</strong> is a Trading Name of <strong>Perfumify 786 Ltd.</strong></p>
								{/* Company Registration Number can be added here when available */}
							</div>

							{/* Registered Address */}
							<div>
								<p><strong>Registered Address:</strong></p>
								<p>Perfumify 786<br />
								B82TT St Agathas road 93<br />
								Birmingham<br />
								England<br />
								United Kingdom</p>
							</div>

							{/* Opening Hours */}
							<div>
								<p><strong>Opening Hours:</strong></p>
								<p>Monday – Sunday: 10:00 AM – 5:00 PM</p>
							</div>

							{/* Contact Info */}
							<div>
								<p><strong>Contact Us:</strong></p>
								<p>Phone: +447782274831</p>
								<p>Email: <span className="text-blue-600">info@perfumify786.co.uk</span></p>
							</div>

							{/* Who We Are */}
							<div>
								<p><strong>Who We Are</strong></p>
								<p>At <strong>Perfumify 786</strong>, we believe fragrance is more than a scent – it's a statement. Since 2024, we’ve specialised exclusively in premium perfumes that reflect individuality, elegance, and long-lasting luxury.</p>
							</div>

							<p>From daily wear fragrances to luxury scents for special occasions, every bottle in our curated collection is designed to help you express your personality with confidence.</p>

							{/* Why Shop With Us? */}
							<div>
								<p><strong>Why Shop With Us?</strong></p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li><strong>100% Authentic Perfumes</strong> – Guaranteed genuine products.</li>
									<li><strong>SSL-Secured Checkout</strong> – Your data and payments are always protected.</li>
									<li><strong>Free UK Shipping</strong> – No hidden charges, fast delivery.</li>
									<li><strong>Satisfaction Guarantee</strong> – We guarantee products as described.</li>
								</ul>
							</div>

							{/* Delivery Schedule */}
							<div>
								<p><strong>Delivery Schedule</strong></p>
								<p>Orders are processed and dispatched within <strong>1 business day</strong>. We use trusted delivery partners including <strong>Royal Mail, DPD, DHL, Hermes (Evri), and UPS</strong>.</p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li><strong>Delivery Time</strong>: 1–2 business days (United Kingdom).</li>
									<li><strong>Shipping Charges</strong>: Free delivery throughout the United Kingdom.</li>
									<li><strong>Order Tracking</strong>: You will receive a tracking number when your order is dispatched.</li>
									<li><strong>Change of Address</strong>: Please contact us within 24 hours of placing your order for any delivery address changes.</li>
									<li><strong>Wrong Address</strong>: If the incorrect address is provided and delivery fails, the item will return to us and reshipping will require an additional shipping fee.</li>
								</ul>
								<p>For full details, please see our <span className="text-blue-600">Shipping policy</span></p>
							</div>

							{/* Returns Policy */}
							<div>
								<p><strong>Returns Policy</strong></p>
								<p>We offer a <strong>30-day return policy</strong> for both defective and non-defective products.</p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li><strong>Returns Accepted</strong>: Products must be unused and in original condition.</li>
									<li><strong>Free Return Label</strong>: Provided within the UK.</li>
									<li><strong>Refund Processing</strong>: Refunds issued within 10 business days of receiving your returned item.</li>
									<li><strong>Exchanges</strong>: Accepted.</li>
									<li><strong>EU Cooling-Off Period</strong>: 14-day cancellation right for EU customers.</li>
								</ul>
								<p>For full details, please see our <span className="text-blue-600">Refund Policy</span></p>
							</div>

							{/* Guarantee */}
							<div>
								<p><strong>Guarantee</strong></p>
								<p>We guarantee that all products sold are <strong>100% authentic</strong> and as displayed on our website. If you’re not satisfied, contact us and we’ll work to resolve your concern promptly.</p>
							</div>

							{/* Privacy & Cookies Policy */}
							<div>
								<p><strong>Privacy & Cookies Policy</strong></p>
								<p>We are committed to safeguarding your privacy under the <strong>Data Protection Act 1998</strong> and UK GDPR.</p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li><strong>What We Collect:</strong> Your name, address, contact details, and payment information.</li>
									<li><strong>How We Use It:</strong> To process your orders, provide customer service, and (with your consent) inform you of updates or promotions.</li>
									<li><strong>Your Data Is Safe:</strong> We never share your information except where necessary for order delivery. Personal data is stored securely and processed lawfully.</li>
									<li><strong>Access, Correction, or Deletion:</strong> Email <span className="text-blue-600">info@perfumify786.co.uk</span> to access or update your data.</li>
								</ul>
							</div>

							{/* Cookies */}
							<div>
								<p><strong>Cookies</strong></p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li>Track your cart and assist with checkout.</li>
									<li>Improve website performance and navigation.</li>
								</ul>
								<p>Cookies do not collect sensitive personal information. You can block cookies via your browser settings, but this may impact your experience.</p>
								<p>For full details, please see our <span className="text-blue-600">Privacy Policy</span></p>
							</div>

							{/* Secure Shopping */}
							<div>
								<p><strong>Secure Shopping</strong></p>
								<p>All orders placed through Perfumify 786 are processed via a <strong>secure, SSL-encrypted checkout</strong>. This ensures that your personal and payment information is protected throughout the ordering process.</p>
							</div>

							{/* See Why Customers Trust Us */}
							<div>
								<p><strong>See Why Customers Trust Us</strong></p>
								<p>Don’t just take our word for it – discover what real customers think about Perfumify 786 on <span className="text-blue-600">Trustpilot</span>. We’re proud of our growing community and 5-star feedback.</p>
								<p><strong>Thank You for Choosing Us</strong></p>
								<p>At Perfumify 786, we’re passionate about helping you find the fragrance that defines you. Exceptional products, excellent service, and secure shopping — every time.</p>
								<p>We look forward to being part of your fragrance journey.</p>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</>
	);
}

AboutPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale ?? "en", [
				"common",
				"forms",
				"menu",
				"footer",
			])),
		},
		revalidate: 86400,
	};
};
