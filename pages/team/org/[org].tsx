import { useRouter } from "next/router";
import TeamNav, { getPathsForRoute } from "../index";
import { Spinner } from "@artsy/palette";
import { normalizeParam } from "../../../lib/url";
import { NoResults } from "../../../components/team/NoResults";

export { getStaticProps } from "../index";

export const getStaticPaths = getPathsForRoute({ route: "org" });

const Organization = props => {
  const router = useRouter();

  if (router.isFallback) {
    return <Spinner />;
  }

  const org = router.query.org;
  let formattedOrg = "";

  const data = props.data.filter(member => {
    if (normalizeParam(member.org) === org) {
      formattedOrg = member.org;
      return true;
    }
    return false;
  });

  return (
    <TeamNav
      {...props}
      data={data}
      NoResults={() => <NoResults page={formattedOrg} />}
    />
  );
};

export default Organization;
