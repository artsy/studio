import { useRouter } from "next/router";
import TeamNav, { ServerProps } from "../index";
import { Spinner } from "@artsy/palette";
import { normalizeParam } from "lib/utils";
import { NoResults } from "components/NoResults";
import { FC } from "react";
import Error from "next/error";

export { getServerSideProps } from "../index";

const Organization: FC<ServerProps> = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Spinner />;
  }

  if (!props.data) {
    return <Error statusCode={500} />;
  }

  const org = router.query.org;
  let formattedOrg = "";

  const data = props.data.filter((member) => {
    if (member.org && normalizeParam(member.org) === org) {
      formattedOrg = member.org;
      return true;
    }
    return false;
  });

  return (
    <>
      <TeamNav
        {...props}
        data={data}
        title={formattedOrg}
        NoResults={() => <NoResults page={formattedOrg} />}
      />
    </>
  );
};

export default Organization;
