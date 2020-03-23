import { Flex, space } from "@artsy/palette";
import { Home, Compose } from "react-bytesize-icons";
import styled from "styled-components";

const iconSize = {
  width: 28,
  height: 28
};

const Menu = styled(Flex)`
  & > * {
    margin-bottom: ${space(1)}px;
  }
`;

export const Sidebar = () => {
  return (
    <Menu flexDirection="column" alignItems="center" width="36px" mr={2}>
      <Home {...iconSize} />
      <Compose {...iconSize} />
    </Menu>
  );
};
