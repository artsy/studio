import { Avatar, Box, Serif, Flex, Separator, Link } from "@artsy/palette";
import fetch from "node-fetch";
import style from "styled-components";
import { GetServerSideProps } from "next";
import { H1 } from "../../components/Typography";
import { AvatarFallback } from "../../components/AvatarFallback";
import memoize from "fast-memoize";
import RouterLink from "next/link";

const capitalize = (s: string) => {
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
};

export const formatMemberName = name => name.toLowerCase().replace(" ", ".");

export const fetcher = memoize((url: string) =>
  fetch(url).then(res => res.json())
);

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

export const TeamMember = props => {
  const { member } = props;

  return (
    <Flex width="390px" mb={3}>
      <AvatarContainer>
        {member.headshot ? (
          <Avatar
            size="md"
            src={member.headshot}
            lazyLoad={true}
            renderFallback={({ diameter }) => (
              <AvatarFallback diameter={diameter} />
            )}
          />
        ) : (
          <AvatarFallback diameter={"100px"} />
        )}
      </AvatarContainer>
      <Flex flexDirection="column" ml={1}>
        <Flex>
          <Serif size="4" weight="semibold">
            {member.name}
          </Serif>
          {member.preferred_pronouns && (
            <Serif size="4" color="black60" ml={1}>
              {member.preferred_pronouns
                .split("/")
                .map(capitalize)
                .join("/")}
            </Serif>
          )}
        </Flex>
        <Serif size="4">{member.title}</Serif>
        <Serif size="4" color="black60">
          {location(member)}
        </Serif>
      </Flex>
    </Flex>
  );
};

const TeamNav = props => {
  const { data } = props;

  const normalizeSearchTerm = content => {
    return content.toLowerCase().replace(/\s/g, "");
  };

  const group = {};
  data
    .filter(member =>
      normalizeSearchTerm(member.name).includes(
        normalizeSearchTerm(props.searchText)
      )
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
                <RouterLink
                  key={member.name}
                  href={`/team/member/${formatMemberName(member.name)}`}
                  passHref
                >
                  <Link underlineBehavior="none">
                    <TeamMember member={member} />
                  </Link>
                </RouterLink>
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
