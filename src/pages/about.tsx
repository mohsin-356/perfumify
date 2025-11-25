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
							<Link href="/">
								<a className="hover:text-gray-900">Home</a>
							</Link>
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
								<p><strong>Urban Vintage 786</strong> is a Trading Name of <strong>Urban Vintage 786 Ltd.</strong></p>
								<p><strong>Company Registration Number:</strong> <span className="text-blue-600">perfumify786</span></p>
							</div>

							{/* Registered Address */}
							<div>
								<p><strong>Registered Address:</strong></p>
								<p>123 Perfume Street<br />
								25 Regent Street<br />
								Fragranceville<br />
								South Yorkshire<br />
								S1 2AB<br />
								United Kingdom</p>
							</div>

							{/* Opening Hours */}
							<div>
								<p><strong>Opening Hours:</strong></p>
								<p>Monday - Sunday: 10:00 AM - 6:00 PM</p>
							</div>

							{/* Contact Info */}
							<div>
								<p><strong>Contact Us:</strong></p>
								<p>Phone: +44 20 7946 0958</p>
								<p>Email: <span className="text-blue-600">info@perfumify786.co.uk</span></p>
							</div>

							{/* Who We Are */}
							<div>
								<p><strong>Who We Are</strong></p>
								<p>At perfumify786, we are luxury fragrance specialists that have been in business for over 15 years. We are passionate about providing our customers with the finest internationally recognized and long-lasting scents.</p>
							</div>

							<p>From daily wear fragrances to luxury scents for special occasions, every bottle in our curated collection is designed to help you express your personality with confidence.</p>

							{/* Why Shop With Us */}
							<div>
								<p><strong>Why Shop With Us?</strong></p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li><strong>100% Authentic Fragrances</strong> - Guaranteed genuine products.</li>
									<li><strong>SSL Secured Checkout</strong> - Your data and payments are always protected.</li>
									<li><strong>Free UK Shipping</strong> - No hidden charges, fast delivery.</li>
									<li><strong>Satisfaction Guarantee</strong> - We guarantee products as described.</li>
								</ul>
							</div>

							{/* Delivery Schedule */}
							<div>
								<p><strong>Delivery Schedule</strong></p>
								<p>Orders are processed and dispatched within 1 business day. We use trusted delivery partners including Royal Mail, DPD, DHL, Hermes, FedEx, and UPS.</p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li><strong>Delivery Time</strong> - 1-3 business days (United Kingdom).</li>
									<li><strong>Shipping Charges</strong> - Free delivery throughout the United Kingdom.</li>
									<li><strong>Order Tracking</strong> - You will receive a tracking number when your order is dispatched.</li>
									<li><strong>Change of Address</strong> - Please contact us within 24 hours of placing your order. Delivery Address changes can be made before dispatch, but additional charges may apply.</li>
									<li><strong>Wrong Address</strong> - If the incorrect address is provided and delivery fails, the item will either be lost or additional charges will be required to reship the item.</li>
								</ul>
								<p>For full details, please see our <span className="text-blue-600">Shipping policy</span></p>
							</div>

							{/* Returns Policy */}
							<div>
								<p><strong>Returns Policy</strong></p>
								<p>We offer a 30-day return policy for both defective and non-defective products.</p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li><strong>Returns Accepted</strong> - Products must be unused and in original condition.</li>
									<li><strong>Free Return Label</strong> - Provided within the UK.</li>
									<li><strong>Refund Processing</strong> - Refunds issued within 5-7 business days of receiving your returned item.</li>
									<li><strong>Exchanges</strong> - Accepted.</li>
									<li><strong>All Cooling-Off Period</strong> - 14-day cancellation right for EU customers.</li>
								</ul>
								<p>For full details, please see our <span className="text-blue-600">Refund Policy</span></p>
							</div>

							{/* Guarantee */}
							<div>
								<p><strong>Guarantee</strong></p>
								<p>We guarantee that all products sold are <strong>100% authentic</strong> and as displayed on our website. If you're not satisfied, contact us and we'll work to resolve your concern promptly.</p>
							</div>

							{/* Privacy & Contact Policy */}
							<div>
								<p><strong>Privacy & Contact Policy</strong></p>
								<p>We are committed to safeguarding your privacy under the <strong>Data Protection Act 1998</strong> and UK GDPR.</p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li><strong>What We Collect:</strong><br />Your name, address, contact details, and payment information.</li>
									<li><strong>How We Use It:</strong><br />To process your orders, provide customer service, and with your consent inform you of updates or promotions.</li>
									<li><strong>Your Rights:</strong><br />You have the right to access, correct, or delete your personal data. You can also object to processing and request data portability.</li>
									<li><strong>Access, Correction, or Deletion:</strong><br />To exercise your rights, please contact us. We will respond within one month.</li>
									<li><strong>Email info@perfumify786.co.uk to access or update your data.</strong></li>
								</ul>
							</div>

							{/* Cookies */}
							<div>
								<p><strong>Cookies on our website</strong></p>
								<ul className="list-disc list-inside space-y-1 ml-4">
									<li>Track your cart and assist with checkout.</li>
									<li>Improve website performance and navigation.</li>
								</ul>
								<p>Cookies are our secure sensitive personal information. You can block cookies via your browser settings, but this may impact your experience.</p>
								<p>For full details, please see our <span className="text-blue-600">Privacy Policy</span></p>
							</div>

							{/* Secure Shopping */}
							<div>
								<p><strong>Secure Shopping</strong></p>
								<p>All orders placed through Urban Vintage 786 are processed via a <strong>secure, SSL-encrypted checkout</strong>. This ensures that your personal and payment information is protected throughout the entire transaction process.</p>
							</div>

							{/* See What Customers Think */}
							<div>
								<p><strong>See What Customers Think Us</strong></p>
								<p>Don't just take our word for it - discover what real customers think about Urban Vintage 786 on <span className="text-blue-600">Trustpilot</span>. We're proud of our growing community and 5-star feedback.</p>
								<p><strong>Thank You For Choosing Us</strong></p>
								<p>At Urban Vintage 786, we're passionate about helping you find the fragrance that defines you. Exceptional products, excellent service, and secure shopping - every time.</p>
								<p>We look forward to being part of our fragrance journey.</p>
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
			...(await serverSideTranslations(locale!, [
				"common",
				"forms",
				"menu",
				"footer",
			])),
		},
	};
};
