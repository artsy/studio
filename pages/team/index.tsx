import {
  Avatar,
  Box,
  Serif,
  Flex,
  Separator,
  Link,
  color
} from "@artsy/palette";
import fetch from "node-fetch";
import styled from "styled-components";
import { GetStaticProps } from "next";
import { H1 } from "../../components/Typography";
import { AvatarFallback } from "../../components/AvatarFallback";
import memoize from "fast-memoize";
import RouterLink from "next/link";
import { useRouter } from "next/router";
import { NoResults as DefaultNoResults } from "../../components/team/NoResults";
import { normalizeParam } from "../../lib/url";

export const fetcher = memoize((url: string) =>
  fetch(url).then(res => res.json())
);

export const getPathsForRoute = ({ route, key = null, format = x => x }) => {
  if (!key) {
    key = route;
  }
  return async () => {
    const data = await fetcher(`http://localhost:3000/api/team/all`);
    const paths = Array.from(
      new Set(data.map(member => format(member[key])))
    ).map((param: string) => ({
      params: {
        [route]: normalizeParam(param)
      }
    }));
    return { paths, fallback: false };
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await fetcher(`http://localhost:3000/api/team/all`);
  return { props: { data } };
};

const TeamMemberContainer = styled(Flex)`
  border-radius: 5px;
  transition: background-color 250ms;
  background-color: transparent;
  &:hover {
    background-color: ${color("black5")};
  }
`;

const AvatarContainer = styled(Box)`
  flex-shrink: 0;
`;

const location = ({ city, floor }) =>
  [city, floor && `Fl. ${floor}`].filter(v => v).join(", ");

export const TeamMember = props => {
  const { member } = props;

  return (
    <RouterLink href={`/team/member/${normalizeParam(member.name)}`} passHref>
      <Link underlineBehavior="none">
        <TeamMemberContainer width="390px" p={1}>
          <AvatarContainer>
            {member.avatar ? (
              <Avatar
                size="md"
                src={member.avatar}
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
                  {member.preferred_pronouns}
                </Serif>
              )}
            </Flex>
            <Serif size="4">{member.title}</Serif>
            <Serif size="4" color="black60">
              {location(member)}
            </Serif>
          </Flex>
        </TeamMemberContainer>
      </Link>
    </RouterLink>
  );
};

const TeamNav = props => {
  const { data, NoResults = DefaultNoResults } = props;
  const router = useRouter();

  const normalizeSearchTerm = content => {
    return content.toLowerCase().replace(/\s/g, "");
  };

  const group = {};
  data
    .filter(member =>
      normalizeSearchTerm(member.name).includes(
        normalizeSearchTerm(router.query.search || "")
      )
    )
    .forEach(member => {
      const firstLetter = member.name[0];
      if (!group[firstLetter]) {
        group[firstLetter] = [];
      }
      group[firstLetter].push(member);
    });

  if (Object.keys(group).length === 0) {
    return <NoResults />;
  }

  return (
    <section>
      {Object.entries(group).map(([firstLetter, members]: [string, any[]]) => {
        return (
          <Box key={`group-${firstLetter}`} width="100%">
            <H1>{firstLetter}</H1>
            <Flex flexWrap="wrap">
              {members.map(member => (
                <TeamMember key={member.name} member={member} />
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
