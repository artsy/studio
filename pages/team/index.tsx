import useSWR from "swr";
import { Avatar, Serif, Flex, Box, CSSGrid } from "@artsy/palette";
import fetch from "node-fetch";

const location = ({ city, floor }) =>
  [city, floor && `Fl. ${floor}`].filter(v => v).join(", ");

const TeamMember = props => {
  const { member } = props;

  return (
    <Flex key={member.name + member.title} width="390px" mb={3}>
      <Avatar size="md" src={member.headshot} />
      <Flex flexDirection="column" ml={1}>
        <Serif size="4" weight="semibold">
          {member.name}
        </Serif>
        <Serif size="4">{member.title}</Serif>
        <Serif size="4" color="black60">
          {location(member)}
        </Serif>
      </Flex>
    </Flex>
  );
};

const TeamNav = () => {
  const { data, error } = useSWR("/api/team/all", url =>
    fetch(url).then(res => res.json())
  );
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return (
    <Flex flexWrap="wrap">
      {data.map(member => (
        <TeamMember member={member} />
      ))}
    </Flex>
  );
};

export default TeamNav;
