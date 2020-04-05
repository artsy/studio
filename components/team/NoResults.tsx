import { H1 } from "../Typography";
import { useRouter } from "next/router";
import { Flex, Link } from "@artsy/palette";
import RouterLink from "next/link";

export const NoResults = () => {
  const router = useRouter();
  const includeGroup = ["[location]", "[org]", "[team]"].some(g =>
    router.pathname.endsWith(g)
  );
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      mt="20%"
    >
      <H1>
        Couldn't find results for <i>{router.query.search}</i>{" "}
        {includeGroup &&
          `in ${decodeURI(
            router.asPath
              .split("?")[0]
              .split("/")
              .pop()
          )}`}
      </H1>
      {router.pathname !== "/team" && (
        <RouterLink href={"/team?search=" + router.query.search} passHref>
          <Link>Search the whole team</Link>
        </RouterLink>
      )}
    </Flex>
  );
};
