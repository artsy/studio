import { useRouter } from "next/router";
import TeamNav from "../index";
import { Spinner } from "@artsy/palette";
import { normalizeParam } from "../../../lib/url";
import { NoResults } from "../../../components/team/NoResults";

export { getServerSideProps } from "../index";

const Team = props => {
  const router = useRouter();

  if (router.isFallback) {
    return <Spinner />;
  }

  const team = router.query.team;
  let formattedTeam = "";

  const data = props.data.filter(member => {
    if (normalizeParam(member.team) === team) {
      formattedTeam = member.team;
      return true;
    }
    return false;
  });

  return (
    <TeamNav
      {...props}
      title={formattedTeam}
      data={data}
      NoResults={() => <NoResults page={formattedTeam} />}
    />
  );
};

export default Team;
