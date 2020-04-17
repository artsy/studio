import { Flex } from "@artsy/palette";

export const Layout = ({ children }) => (
  <Flex justifyContent="center" alignContent="center">
    {children}
  </Flex>
);
