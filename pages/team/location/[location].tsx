import { useRouter } from "next/router";
import TeamNav, { getPathsForRoute } from "../index";
import { Spinner } from "@artsy/palette";
import { normalizeParam } from "../../../lib/url";
import { NoResults } from "../../../components/team/NoResults";

export const getStaticPaths = getPathsForRoute({
  route: "location",
  key: "city"
});
export { getStaticProps } from "../index";

const Location = props => {
  const router = useRouter();

  if (router.isFallback) {
    return <Spinner />;
  }

  const location = router.query.location;
  let formattedLocation = "";

  const data = props.data.filter(member => {
    if (normalizeParam(member.city) === location) {
      formattedLocation = member.city;
      return true;
    }
    return false;
  });

  return (
    <TeamNav
      {...props}
      data={data}
      title={formattedLocation}
      NoResults={() => <NoResults page={formattedLocation} />}
    />
  );
};

export default Location;
