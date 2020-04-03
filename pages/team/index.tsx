import useSWR from "swr";
import {
  Avatar,
  Box,
  Serif,
  Flex,
  UserSingleIcon,
  color,
  Separator
} from "@artsy/palette";
import fetch from "node-fetch";
import style from "styled-components";
import { GetServerSideProps } from "next";
import { H1 } from "../../components/Typography";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { host } = req.headers;
  const url = host.includes("http") ? host : `http://${host}`;
  const data = await fetcher(`${url}/api/team/all`);
  return { props: { data } };
};

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

const TeamNav = props => {
  const initialData = props.data;
  const { data, error } = useSWR("/api/team/all", fetcher, { initialData });
  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const group = {};
  data
    .filter(member =>
      member.name.toLowerCase().includes(props.searchText.toLowerCase())
    )
    .forEach(member => {
      const firstLetter = member.name[0];
      if (!group[firstLetter]) {
        group[firstLetter] = [];
      }
      group[firstLetter].push(member);
    });

  return (
    <section>
      {Object.entries(group).map(([firstLetter, members]: [string, any[]]) => {
        return (
          <Box key={`group-${firstLetter}`} width="100%">
            <H1>{firstLetter}</H1>
            <Flex flexWrap="wrap">
              {members.map(member => (
                <TeamMember key={member.name + member.title} member={member} />
              ))}
            </Flex>
            <Separator mt={3} />
          </Box>
        );
      })}
    </section>
  );
};

export default TeamNav;
