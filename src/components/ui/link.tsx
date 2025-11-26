import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { ReactNode } from "react";

export interface InternalLinkProps extends NextLinkProps {
  className?: string;
  children?: ReactNode;
}

const Link: React.FC<InternalLinkProps> = ({
  href,
  children,
  ...props
}) => {
  return (
    <NextLink href={href} {...props}>
      {children}
    </NextLink>
  );
};

export default Link;
