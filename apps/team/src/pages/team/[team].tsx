import { useRouter } from "next/router";
import TeamNav, { ServerProps } from "../index";
import { Spinner } from "@artsy/palette";
import { normalizeParam } from "@artsy-studio/utils";
import { NoResults } from "components/NoResults";
import { FC } from "react";
import Error from "next/error";

export { getServerSideProps } from "../index";

const Team: FC<ServerProps> = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Spinner />;
  }

  if (!props.data) {
    return <Error statusCode={500} />;
  }

  const team = router.query.team;
  let formattedTeam = "";

  const data = props.data.filter((member) => {
    if (member.team && normalizeParam(member.team) === team) {
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
