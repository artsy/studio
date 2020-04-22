import { H1 } from "libs/components";
import { useRouter } from "next/router";
import { Flex, Link } from "@artsy/palette";
import RouterLink from "next/link";

interface NoResultsProps {
  page?: string;
}
export const NoResults = ({ page }: NoResultsProps) => {
  const router = useRouter();
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mt="20%"
    >
      <H1>
        Couldn't find results for{" "}
        <i>{decodeURI(router.query.search as string)}</i> {page && `in ${page}`}
      </H1>
      {page && (
        <RouterLink href={"/team?search=" + router.query.search} passHref>
          <Link>Search the whole team</Link>
        </RouterLink>
      )}
    </Flex>
  );
};
