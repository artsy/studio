import RouteLink from "next/link";
import { Flex, Sans, Serif, Link, color } from "@artsy/palette";
import { External } from "react-bytesize-icons";

export interface LinkConfig {
  text: string;
  external?: boolean;
  count?: number;
  href: string;
}

interface LinkSectionProps {
  title: string;
  links: LinkConfig[];
}
export const LinkSection = ({ title, links }: LinkSectionProps) => {
  return (
    <Flex flexDirection="column" mb={3}>
      <Sans size="3t" weight="medium">
        {title}
      </Sans>
      {links.map(link => {
        return (
          <Flex key={link.href} alignItems="center">
            <RouteLink href={link.href} passHref>
              <Link underlineBehavior="hover" mr={0.5}>
                <Serif size="4">{link.text}</Serif>
              </Link>
            </RouteLink>
            {link.external && (
              <External width="10" height="10" color={color("black60")} />
            )}
            {link.count && (
              <Serif size="4" color="black30">
                ({link.count})
              </Serif>
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};
