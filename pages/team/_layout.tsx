import { Box, Flex, space, Serif, Link, color, Spacer } from "@artsy/palette";
import { Sidebar } from "../../components/team/Sidebar";
import styled from "styled-components";
import { cloneElement } from "react";
import useSWR from "swr";
import fetch from "isomorphic-unfetch";
import { External } from "react-bytesize-icons";
import Error from "next/error";

const PageContainer = styled(Box)`
  overflow-y: scroll;
`;

interface TeamProps {
  mdx?: boolean;
  data?: any;
  errorCode?: number;
  errorMessage?: string;
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

export const Layout: React.FC<TeamProps> = ({ children, ...props }) => {
  if (props.errorCode) {
    return (
      <Error statusCode={props.errorCode} title={props.errorMessage}></Error>
    );
  }
  const { data = [], error } = useSWR("/api/team/all", fetcher, {
    initialData: props.data,
  });
  return (
    <Flex height="100%">
      <Sidebar {...props} data={data} />
      <PageContainer
        width="100%"
        height="100%"
        position="relative"
        pt={space(1) + 3}
      >
        <Flex
          position="fixed"
          bottom={0}
          pr={2}
          pb={0.5}
          style={{ right: 0 }}
          background="white"
        >
          <Serif size="2" color="black60">
            Something missing or incorrect?&nbsp;
          </Serif>
          <Link href="https://dashboard.managedbyq.com/tasks/artsy/catalog?initialItemId=IfRG9X35cn">
            <Flex alignItems="center">
              <Serif size="2" color="black60">
                Request an update
              </Serif>
              <Spacer mr={0.5} />
              <External width="10" height="10" color={color("black60")} />
            </Flex>
          </Link>
        </Flex>
        {cloneElement(children as any, { data, error })}
      </PageContainer>
    </Flex>
  );
};
