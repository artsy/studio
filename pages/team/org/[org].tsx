import { useRouter } from "next/router";
import TeamNav from "../index";

export { getServerSideProps } from "../index";

const Organization = props => {
  const router = useRouter();
  const org = router.query.org;

  const data = props.data.filter(member => {
    return member.org === org;
  });

  return <TeamNav {...props} data={data} />;
};

export default Organization;
