import React from "react";
import { FaFacebookF } from "react-icons/fa";

const TopBanner: React.FC = () => {
	return (
		<div className="bg-gray-100 border-b border-gray-200">
			<div className="flex items-center justify-between max-w-[1920px] mx-auto px-4 lg:px-6 py-2">
				<div className="flex-1"></div>
				<div className="text-center">
					<p className="text-sm text-gray-600 font-medium tracking-wide">
						FREE UK DELIVERY ON ALL ORDERS
					</p>
				</div>
				<div className="flex-1 flex justify-end">
					<a
						href="#"
						className="text-gray-600 hover:text-gray-800 transition-colors"
						aria-label="Facebook"
					>
						<FaFacebookF className="w-4 h-4" />
					</a>
				</div>
			</div>
		</div>
	);
};

export default TopBanner;
