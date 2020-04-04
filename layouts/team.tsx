import { Box, Flex, space } from "@artsy/palette";
import { Sidebar } from "../components/team/Sidebar";
import styled from "styled-components";
import { useState, cloneElement, memo } from "react";
import { debounce } from "debounce";
import useSWR from "swr";
import fetch from "node-fetch";

const PageContainer = styled(Box)`
  overflow-y: scroll;
`;

interface TeamProps {
  mdx?: boolean;
  data?: any;
}

// const fetcher = (url: string) => fetch(url).then(res => res.json());

const fetcher = async (url: string) => {
  const cache = sessionStorage.getItem(url);
  if (cache) {
    return JSON.parse(cache);
  }
  const res = await fetch(url);
  const json = await res.json();
  sessionStorage.setItem(url, JSON.stringify(json));
  return json;
};

const Team: React.FC<TeamProps> = ({ children, ...props }) => {
  const { data = [], error } = useSWR("/api/team/all", fetcher, {
    initialData: props.data
  });
  const [searchText, setSearchText] = useState("");
  const search = debounce(setSearchText, 200);
  return (
    <Flex height="100%">
      <Sidebar
        {...props}
        data={data}
        onSearch={text => {
          search(text);
        }}
      />
      <PageContainer width="100%" height="100%" pt={space(1) + 3}>
        {cloneElement(children as any, { searchText, data, error })}
      </PageContainer>
    </Flex>
  );
};

export default memo(Team);
