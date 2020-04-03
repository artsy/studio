import { Box, Flex, space } from "@artsy/palette";
import { Sidebar } from "../components/team/Sidebar";
import styled from "styled-components";
import { useState, cloneElement } from "react";
import { debounce } from "debounce";

const PageContainer = styled(Box)`
  overflow-y: scroll;
`;

interface TeamProps {
  mdx?: boolean;
}

const Team: React.FC<TeamProps> = ({ children, ...props }) => {
  const [searchText, setSearchText] = useState("");
  const search = debounce(setSearchText, 200);
  return (
    <Flex height="100%">
      <Sidebar
        onSearch={text => {
          search(text);
        }}
      />
      <PageContainer
        width="100%"
        height="100%"
        mt={props.mdx ? space(4) + 3 : 1}
      >
        {cloneElement(children as any, { searchText })}
      </PageContainer>
    </Flex>
  );
};

export default Team;
