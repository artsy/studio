import { Box, Flex, space } from "@artsy/palette";
import { Sidebar } from "../components/team/Sidebar";
import styled from "styled-components";

const PageContainer = styled(Box)`
  overflow-y: scroll;
`;

const Team = (page: JSX.Element, pageProps) => {
  return (
    <Flex height="100%">
      <Sidebar />
      <PageContainer
        width="100%"
        height="100%"
        mt={pageProps.mdx ? space(4) + 3 : 1}
      >
        {page}
      </PageContainer>
    </Flex>
  );
};

export default Team;
