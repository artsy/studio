import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import TeamNav from "../index";

export { getServerSideProps } from "../index";

const Location = props => {
  const router = useRouter();
  const location = router.query.location;

  const data = props.data.filter(member => {
    return member.city === location;
  });

  return <TeamNav {...props} data={data} />;
};

export default Location;
