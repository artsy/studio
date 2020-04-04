import { useRouter } from "next/router";
import TeamNav from "../index";

export { getServerSideProps } from "../index";

const Team = props => {
  const router = useRouter();
  const team = router.query.team;

  const data = props.data.filter(member => {
    return member.team === team;
  });

  return <TeamNav {...props} data={data} />;
};

export default Team;
