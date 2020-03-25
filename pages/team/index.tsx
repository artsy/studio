import useSWR from "swr";
import { Avatar, Serif } from "@artsy/palette";
import fetch from "node-fetch";

const TeamMember = props => {
  const { member } = props;

  return (
    <>
      <Serif size="4t">{member.name}</Serif>
      <Avatar size="md" src={member.headshot} />
    </>
  );
};

const TeamNav = () => {
  const { data, error } = useSWR("/api/team/all", url =>
    fetch(url).then(res => res.json())
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return data.map(member => <TeamMember member={member} />);
};

export default TeamNav;
