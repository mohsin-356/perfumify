import Image from "next/image";
import Link from "@components/ui/link";
import cn from "classnames";
import { siteSettings } from "@settings/site-settings-perfume";
import SiteLogo from "@/slider_images/logo.png";

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
                className="h-8 w-auto object-contain sm:h-9 md:h-10 lg:h-11 xl:h-12"
                sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 144px"
                priority
            />
		</Link>
	);
};

export default Logo;
