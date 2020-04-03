import {
  ArtsyMarkIcon,
  Input,
  Flex,
  Separator,
  color,
  Box,
  Spacer,
  Sans
} from "@artsy/palette";
import { LinkConfig, LinkSection } from "./LinkSection";
import styled from "styled-components";
import { debounce } from "debounce";

const helpfulLinks: LinkConfig[] = [
  {
    text: "Atlas",
    external: true,
    href: "https://sites.google.com/a/artsymail.com/intranet/"
  },
  {
    text: "NYC OfficeSpace",
    external: true,
    href: "https://artsy.officespacesoftware.com/visual-directory/floors/12"
  },
  {
    text: "LDN OfficeSpace",
    external: true,
    href: "https://artsy.officespacesoftware.com/visual-directory/floors/11"
  },
  {
    text: "Who is New?",
    href: "/team/who-is-new"
  },
  {
    text: "Did you know?",
    href: "/team/did-you-know"
  }
];

const SidebarContainer = styled(Flex)`
  border-right: 1px solid ${color("black10")};
  overflow-y: scroll;
`;

export const Sidebar = ({ onSearch }) => {
  return (
    <SidebarContainer
      flexDirection="column"
      flexShrink="0"
      width="450px"
      height="100%"
      px={3}
      mr={3}
    >
      <Box position="fixed" bg="white" width="390px">
        <Sans size="3" weight="medium" my={1}>
          Team Navigator
        </Sans>
        <Flex alignItems="center">
          <ArtsyMarkIcon width="48" height="48" mr={1} />
          <Input
            placeholder="Search team members"
            onChange={e => onSearch((e.target as any).value)}
          />
        </Flex>
        <Separator mt={3} />
      </Box>
      {/* This spacer should have an mb of the height above + 30px */}
      <Spacer mb="140px" />
      <LinkSection title="Links" links={helpfulLinks} />
    </SidebarContainer>
  );
};
