import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import TextArea from "@components/ui/text-area";
import { useCheckoutMutation, CreateOrderPayload } from "@framework/checkout/use-checkout";
import { CheckBox } from "@components/ui/checkbox";
import Button from "@components/ui/button";
import Router from "next/router";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
import { useCart } from "@contexts/cart/cart.context";
import { useState } from "react";

interface CheckoutInputType {
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	address: string;
	city: string;
	zipCode: string;
	save: boolean;
	note: string;
}

const CheckoutForm: React.FC = () => {
	const { t } = useTranslation();
	const { mutateAsync: createOrder, isLoading } = useCheckoutMutation();
	const { items, total, resetCart } = useCart();
	const [success, setSuccess] = useState<{ show: boolean; tracking?: string; waUrl?: string }>({ show: false });
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CheckoutInputType>();
	async function onSubmit(input: CheckoutInputType) {
		// Build order payload from form + cart
		const payload: CreateOrderPayload = {
			customer: {
				name: `${input.firstName} ${input.lastName}`.trim(),
				email: input.email,
				phone: input.phone,
				address: {
					street: input.address,
					city: input.city || "",
					state: "",
					zip: input.zipCode || "",
					country: "",
				},
			},
			items: items.map((it: any) => ({
				product: String(it.slug || it.id || ""),
				quantity: Number(it.quantity || 1),
				price: Number(it.price || 0),
				name: String(it.name || "Item"),
				image: String(it.image || ""),
			})),
			total: Number(total || 0),
			paymentInfo: {
				method: "Cash on Delivery",
				status: "Pending",
			},
		};

		try {
			const order = await createOrder(payload);
			try { resetCart(); } catch {}
			const tracking = order?.trackingId || order?._id;
			const friendlyOrderId = order?.orderId ? String(order.orderId) : undefined;

			// Compose WhatsApp message
			const fullName = `${input.firstName} ${input.lastName}`.trim();
			const addressStr = `${input.address}, ${input.city || ""} ${input.zipCode || ""}`.trim();
			const itemsLines = items.map((it: any) => `${String(it.name || "Item")} x ${Number(it.quantity || 1)} = £${Number(it.price || 0).toFixed(2)}`).join("\n");
			const msg = `New order placed\n${friendlyOrderId ? `Order ID: ${friendlyOrderId}\n` : ''}Tracking: ${tracking}\nName: ${fullName}\nEmail: ${input.email}\nPhone: ${input.phone}\nAddress: ${addressStr}\n\nItems:\n${itemsLines}\n\nTotal: £${Number(total || 0).toFixed(2)}`;
			const waUrl = `https://wa.me/447782274831?text=${encodeURIComponent(msg)}`;

			// Show success overlay (green) and attempt to open WhatsApp chat
			setSuccess({ show: true, tracking, waUrl });
			try { window.open(waUrl, "_blank"); } catch {}

			// Redirect to tracking page shortly after
			setTimeout(() => {
				Router.push(`${ROUTES.ORDER}?id=${tracking}`);
			}, 1200);
		} catch (err: any) {
			const apiMsg = err?.response?.data?.error;
			const msg = apiMsg || err?.message || "Failed to place order";
			alert(msg);
		}
	}

	return (
		<>
			<h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8">
				{t("text-shipping-address")}
			</h2>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full mx-auto flex flex-col justify-center "
				noValidate
			>
				<div className="flex flex-col space-y-4 lg:space-y-5">
					<div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
						<Input
							labelKey="forms:label-first-name"
							{...register("firstName", {
								required: "forms:first-name-required",
							})}
							errorKey={errors.firstName?.message}
							variant="solid"
							className="w-full lg:w-1/2 "
						/>
						<Input
							labelKey="forms:label-last-name"
							{...register("lastName", {
								required: "forms:last-name-required",
							})}
							errorKey={errors.lastName?.message}
							variant="solid"
							className="w-full lg:w-1/2 lg:ms-3 mt-2 md:mt-0"
						/>
					</div>
					<Input
						labelKey="forms:label-address"
						{...register("address", {
							required: "forms:address-required",
						})}
						errorKey={errors.address?.message}
						variant="solid"
					/>
					<div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
						<Input
							type="tel"
							labelKey="forms:label-phone"
							{...register("phone", {
								required: "forms:phone-required",
							})}
							errorKey={errors.phone?.message}
							variant="solid"
							className="w-full lg:w-1/2 "
						/>

						<Input
							type="email"
							labelKey="forms:label-email-star"
							{...register("email", {
								required: "forms:email-required",
								pattern: {
									value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
									message: "forms:email-error",
								},
							})}
							errorKey={errors.email?.message}
							variant="solid"
							className="w-full lg:w-1/2 lg:ms-3 mt-2 md:mt-0"
						/>
					</div>
					<div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
						<Input
							labelKey="forms:label-city"
							{...register("city")}
							variant="solid"
							className="w-full lg:w-1/2 "
						/>

						<Input
							labelKey="forms:label-postcode"
							{...register("zipCode")}
							variant="solid"
							className="w-full lg:w-1/2 lg:ms-3 mt-2 md:mt-0"
						/>
					</div>
					<div className="relative flex items-center ">
						<CheckBox labelKey="forms:label-save-information" />
					</div>
					<TextArea
						labelKey="forms:label-order-notes"
						{...register("note")}
						placeholderKey="forms:placeholder-order-notes"
						className="relative pt-3 xl:pt-6"
					/>
					<div className="flex w-full">
						<Button
							className="w-full sm:w-auto"
							loading={isLoading}
							disabled={isLoading}
						>
							{t("common:button-place-order")}
						</Button>
					</div>
				</div>
			</form>

			{success.show && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
					<div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-6 w-[90%] max-w-md shadow-lg">
						<h3 className="text-lg font-semibold mb-2">Your order has been placed!</h3>
						<p className="text-sm mb-4">Thank you for shopping with us. You will be redirected to your order tracking shortly.</p>
						<div className="flex gap-3 flex-wrap">
							<a href={success.waUrl} target="_blank" rel="noreferrer" className="px-3 py-2 bg-green-600 text-white rounded-md">Send WhatsApp Now</a>
							{success.tracking && (
								<a href={`${ROUTES.ORDER}?id=${success.tracking}`} className="px-3 py-2 bg-white border border-green-600 text-green-700 rounded-md">Track Order</a>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default CheckoutForm;
