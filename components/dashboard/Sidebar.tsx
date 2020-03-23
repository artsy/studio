import { Flex, space, color } from "@artsy/palette";
import { Home, Compose } from "react-bytesize-icons";
import Link from "next/link";
import styled from "styled-components";

const entries = [
  {
    name: "Home",
    icon: Home,
    href: "/dashboard"
  },
  {
    name: "Blog",
    icon: Compose,
    href: "/dashboard/blog"
  }
];

const size = 32;
const iconSize = {
  width: size,
  height: size
};

const Menu = styled(Flex)`
  & > * {
    padding: ${space(1)}px;
  }
  & > *:hover {
    color: ${color("purple100")};
    background-color: ${color("black5")};
  }
`;

export const Sidebar = () => {
  return (
    <Menu flexDirection="column" alignItems="center" width="36px" mr={2}>
      {entries.map(({ name, href, icon: Icon }) => {
        return (
          <Link key={name} href={href}>
            <a title={name}>
              <Icon {...iconSize} />
            </a>
          </Link>
        );
      })}
    </Menu>
  );
};
