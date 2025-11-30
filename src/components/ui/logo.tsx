import Image from "next/image";
import Link from "@components/ui/link";
import cn from "classnames";
import { siteSettings } from "@settings/site-settings-perfume";
import SiteLogo from "@/slider_images/logo.jpg";

const Logo: React.FC<React.AnchorHTMLAttributes<{}>> = ({
	className,
	...props
}) => {
	return (
		<Link
			href={siteSettings.logo.href}
			className={cn("inline-flex focus:outline-none", className)}
			{...props}
		>
			<Image
				src={SiteLogo}
				alt={siteSettings.logo.alt}
				height={siteSettings.logo.height}
				width={siteSettings.logo.width}
				loading="eager"
				style={{ height: siteSettings.logo.height, width: siteSettings.logo.width, objectFit: "contain" }}
			/>
		</Link>
	);
};

export default Logo;
