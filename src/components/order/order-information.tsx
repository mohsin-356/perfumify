import { IoCheckmarkCircle } from "react-icons/io5";
import OrderDetails from "@components/order/order-details";
import OrderTimeline from "@components/order/order-timeline";
import { useOrderQuery } from "@framework/order/get-order";
import { useRouter } from "next/router";
import usePrice from "@framework/product/use-price";
import { useTranslation } from "next-i18next";
import { useState } from "react";

export default function OrderInformation() {
    const router = useRouter();
    const { id } = (router.query || {}) as { id?: string };
    const { t } = useTranslation("common");
    const [trackingInput, setTrackingInput] = useState("");
    const shouldFetch = typeof id === "string" && id.length > 0;
    const { data, isLoading } = useOrderQuery(shouldFetch ? id : "");
    const { price: total } = usePrice(
        data && {
            amount: data.shipping_fee ? data.total + data.shipping_fee : data.total,
            currencyCode: "GBP",
        }
    );
    if (!shouldFetch) {
        return (
            <div className="py-12 max-w-xl mx-auto">
                <h3 className="text-xl font-semibold mb-4">{t("text-order-tracking")}</h3>
                <p className="text-sm text-gray-600 mb-4">{t("text-enter-tracking") || "Enter your Tracking ID to view order status."}</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={trackingInput}
                        onChange={(e) => setTrackingInput(e.target.value)}
                        placeholder="Tracking ID"
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={() => trackingInput && router.push(`/order?id=${encodeURIComponent(trackingInput)}`)}
                        className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800"
                    >
                        {t("text-track") || "Track"}
                    </button>
                </div>
            </div>
        );
    }
    if (isLoading) return <p>Loading...</p>;
    return (
        <div className="xl:px-32 2xl:px-44 3xl:px-56 py-16 lg:py-20">
            <div className="border border-gray-300 bg-gray-50 px-4 lg:px-5 py-4 rounded-md flex items-center justify-start text-heading text-sm md:text-base mb-6 lg:mb-8">
                <span className="w-10 h-10 me-3 lg:me-4 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <IoCheckmarkCircle className="w-5 h-5 text-green-600" />
                </span>
                {t("text-order-received")}
            </div>

            <ul className="border border-gray-300 bg-gray-50 rounded-md flex flex-col md:flex-row mb-7 lg:mb-8 xl:mb-10">
                <li className="text-heading font-semibold text-base lg:text-lg border-b md:border-b-0 md:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
                    <span className="uppercase text-[11px] block text-body font-normal leading-5">
                        {t("text-order-number")}:
                    </span>
                    {data?.trackingId || (data as any)?.tracking_number || data?._id}
                </li>
                <li className="text-heading font-semibold text-base lg:text-lg border-b md:border-b-0 md:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
                    <span className="uppercase text-[11px] block text-body font-normal leading-5">
                        {t("text-date")}:
                    </span>
                    {data?.createdAt ? new Date(data.createdAt as any).toLocaleDateString() : ""}
                </li>
                <li className="text-heading font-semibold text-base lg:text-lg border-b md:border-b-0 md:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
                    <span className="uppercase text-[11px] block text-body font-normal leading-5">
                        {t("text-email")}:
                    </span>
                    {data?.customer.email}
                </li>
                <li className="text-heading font-semibold text-base lg:text-lg border-b md:border-b-0 md:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
                    <span className="uppercase text-[11px] block text-body font-normal leading-5">
                        {t("text-total")}:
                    </span>
                    {total}
                </li>
                <li className="text-heading font-semibold text-base lg:text-lg border-b md:border-b-0 md:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
                    <span className="uppercase text-[11px] block text-body font-normal leading-5">
                        {t("text-payment-method")}:
                    </span>
                    {(data as any)?.payment_gateway || (data as any)?.paymentInfo?.method}
                </li>
            </ul>

			<div className="mb-8">
				<OrderTimeline
					trackingId={(data as any)?.trackingId || (data as any)?.tracking_number || (data as any)?._id}
					currentStatus={(data as any)?.status}
					history={(data as any)?.statusHistory}
				/>
			</div>

			<p className="text-heading text-sm md:text-base mb-8">
				{t("text-pay-cash")}
			</p>

			<OrderDetails />
		</div>
	);
}
