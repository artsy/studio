import RouteLink from "next/link";
import { Flex, Sans, Serif, Link, color } from "@artsy/palette";
import { External } from "react-bytesize-icons";
import { useRouter } from "next/router";

export interface LinkConfig {
  text: string;
  external?: boolean;
  count?: number;
  href: string;
  as?: string;
}

interface LinkSectionProps {
  title: string;
  links: LinkConfig[];
}
export const LinkSection = ({ title, links }: LinkSectionProps) => {
  const router = useRouter();
  return (
    <Flex flexDirection="column" mb={3}>
      <Sans size="3t" weight="medium">
        {title}
      </Sans>
      {links.map((link) => {
        return (
          <Flex key={link.as ?? link.href} alignItems="center">
            {link.external ? (
              <>
                <Link underlineBehavior="hover" mr={0.5} href={link.href}>
                  <Serif size="4">{link.text}</Serif>
                </Link>
                <External width={10} height={10} color={color("black60")} />
              </>
            ) : (
              <RouteLink href={link.href} as={link.as} passHref>
                <Link
                  color={
                    router.asPath.split("?")[0] === encodeURI(link.href)
                      ? "purple100"
                      : undefined
                  }
                  underlineBehavior="hover"
                  mr={0.5}
                >
                  <Serif size="4">{link.text}</Serif>
                </Link>
              </RouteLink>
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
