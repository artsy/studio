import {
  Avatar,
  Box,
  Serif,
  Flex,
  Separator,
  Link,
  color
} from "@artsy/palette";
import styled from "styled-components";
import { GetServerSideProps } from "next";
import { H1 } from "../../components/Typography";
import { AvatarFallback } from "../../components/AvatarFallback";
import RouterLink from "next/link";
import { useRouter } from "next/router";
import { NoResults as DefaultNoResults } from "../../components/team/NoResults";
import { normalizeParam, urlFromReq, normalizeSearchTerm } from "../../lib/url";
import { authorizedPage } from "../../lib/auth";
import { useSearch } from "../../lib/useSearch";

export const getServerSideProps: GetServerSideProps = authorizedPage(
  async (ctx, fetch) => {
    const res = await fetch(`${urlFromReq(ctx.req)}/api/team/all`);
    if (!res.ok) {
      return { props: { errorCode: res.status, errorMessage: res.statusText } };
    }
    return { props: { data: await res.json() } };
  }
);

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
  const { member, showAvatar = true } = props;

  return (
    <RouterLink
      href="/team/member/[member]"
      as={`/team/member/${normalizeParam(member.name)}`}
      passHref
    >
      <Link underlineBehavior="none">
        <TeamMemberContainer width="390px" p={1} ml={(!showAvatar && -1) || 0}>
          {showAvatar && (
            <AvatarContainer mr={1}>
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
          )}

          <Flex flexDirection="column">
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
  const { title, data, NoResults = DefaultNoResults } = props;
  const searchTerm = useSearch();

  const group = {};
  data
    .filter(member => {
      return normalizeSearchTerm(member.name).includes(searchTerm);
    })
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
    <>
      {title && (
        <>
          <H1>{title}</H1>
          <Separator />
        </>
      )}
      <section>
        {Object.entries(group).map(
          ([firstLetter, members]: [string, any[]]) => {
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
          }
        )}
      </section>
    </>
  );
};

export default TeamNav;
