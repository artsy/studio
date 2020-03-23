import { ArtsyMarkIcon, Input, Flex, Sans } from "@artsy/palette";

interface Link {
  text: string;
  external: boolean;
  count?: number;
  href: string;
}

interface SectionProps {
  title: string;
  links: Link[];
}
const Section = () => {
  return (
    <nav>
      <Sans size="1">Links</Sans>
    </nav>
  );
};

export const Sidebar = () => {
  <Flex flexDirection="column">
    <Flex>
      <ArtsyMarkIcon />
      <Input placeholder="Search team members" />
    </Flex>
    <hr />
  </Flex>;
};
