import useSWR from "swr";
import {
  Avatar,
  Box,
  Serif,
  Flex,
  UserSingleIcon,
  color
} from "@artsy/palette";
import fetch from "node-fetch";
import style from "styled-components";

const AvatarContainer = style(Box)`
  flex-shrink: 0;
`;

const location = ({ city, floor }) =>
  [city, floor && `Fl. ${floor}`].filter(v => v).join(", ");

const AvatarFallback = ({ diameter }) => (
  <Flex
    width={diameter}
    height={diameter}
    borderRadius={diameter}
    background={color("black10")}
    alignItems="center"
    justifyContent="center"
  >
    <UserSingleIcon
      fill="black30"
      height={parseInt(diameter) - 20}
      width={parseInt(diameter) - 20}
    />
  </Flex>
);

const TeamMember = props => {
  const { member } = props;

  return (
    <Flex width="390px" mb={3}>
      <AvatarContainer>
        {member.headshot ? (
          <Avatar
            size="md"
            src={member.headshot}
            renderFallback={({ diameter }) => (
              <AvatarFallback diameter={diameter} />
            )}
          />
        ) : (
          <AvatarFallback diameter={"100px"} />
        )}
      </AvatarContainer>
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
        <TeamMember key={member.name + member.title} member={member} />
      ))}
    </Flex>
  );
};

export default TeamNav;
