import { useRouter } from "next/router";
import TeamNav, { ServerProps } from "../index";
import { Spinner } from "@artsy/palette";
import { normalizeParam } from "@artsy-studio/utils";
import { NoResults } from "components/NoResults";
import { FC } from "react";
import Error from "next/error";

// export const getStaticPaths = getPathsForRoute({
//   route: "location",
//   key: "city"
// });

export { getServerSideProps } from "../index";

const Location: FC<ServerProps> = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Spinner />;
  }

  if (!props.data) {
    return <Error statusCode={500} />;
  }

  const location = router.query.location;
  let formattedLocation = "";

  const data = props.data.filter((member) => {
    if (member.city && normalizeParam(member.city) === location) {
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
