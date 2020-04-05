import { H1 } from "../Typography";
import { useRouter } from "next/router";
import { Flex, Link } from "@artsy/palette";
import RouterLink from "next/link";

export const NoResults = () => {
  const router = useRouter();
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mt="20%"
    >
      <H1>
        Couldn't find results for <i>{router.query.search}</i>
      </H1>
      {router.pathname !== "/team" && (
        <RouterLink href={"/team?search=" + router.query.search} passHref>
          <Link>Search the whole team</Link>
        </RouterLink>
      )}
    </Flex>
  );
};
