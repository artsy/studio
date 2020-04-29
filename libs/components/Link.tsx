import React from "react";
import NextLink, { LinkProps } from "next/link";

export const Link: React.FunctionComponent<LinkProps> = ({
  href,
  as,
  ...props
}) => {
  if (href.toString().startsWith("/")) {
    return (
      <NextLink
        {...props}
        href={`${process.env.ASSET_PREFIX || ""}${href}`}
        as={(as && `${process.env.ASSET_PREFIX || ""}${as ?? ""}`) || undefined}
      />
    );
  }
  return <NextLink {...props} href={href} as={as} />;
};
