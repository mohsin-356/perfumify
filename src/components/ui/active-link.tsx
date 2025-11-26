import { useRouter } from "next/router";
import Link from "next/link";
import React, { Children } from "react";

const ActiveLink = ({ children, activeClassName, href, ...props }: any) => {
	const { pathname } = useRouter();
	const child = Children.only(children) as any;
	const childClassName = (child && child.props && child.props.className) || "";

	const className =
		pathname === href
			? `${childClassName} ${activeClassName}`.trim()
			: childClassName;

	const content = child?.props?.children ?? child;
	return (
		<Link href={href} className={className || undefined} {...props}>
			{content}
		</Link>
	);
};

export default ActiveLink;
