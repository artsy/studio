import { useRouter } from "next/router";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import {
  Box,
  Link,
  Serif,
  Spinner,
  Image,
  Flex,
  Sans,
  ResponsiveImage,
  Spacer,
  EnvelopeIcon,
  space
} from "@artsy/palette";
import { TeamMember, getPathsForRoute } from "../index";
import ErrorPage from "next/error";
import { H1, H2, P } from "../../../components/Typography";
import { normalizeParam } from "../../../lib/url";
import { useMemo } from "react";

export { getStaticProps } from "../index";

export const getStaticPaths = getPathsForRoute({
  route: "name"
});

TimeAgo.addLocale(en);
const timeAgo = new TimeAgo("en-US");

const Member = props => {
  const router = useRouter();

  if (router.isFallback) {
    return <Spinner />;
  }

  const name = router.query.name;
  let member, manager;

  useMemo(() => {
    member = props.data.find(employee => {
      return normalizeParam(employee.name) === name;
    });
    if (member?.reports_to) {
      manager = props.data.find(employee => {
        return employee.name === member.reports_to;
      });
    }
  }, [name]);

  if (!member) {
    return <ErrorPage statusCode={404} />;
  }

  const showOrg = !!member.org;
  const showTeam = showOrg && !member.org.includes(member.team);
  const showSubteam = showTeam && !member.team.includes(member.subteam);

  return (
    <Box>
      <Flex>
        <Flex flexDirection="column" flexBasis="min-content">
          <Box minWidth="300px" width="300px">
            <ResponsiveImage src={member.profileImage} />
          </Box>
          {member.start_date && (
            <Link href={member.intro_email} underlineBehavior="hover" my={0.5}>
              <Flex alignItems="center">
                <Serif size="5" color="black60">
                  Joined {timeAgo.format(new Date(member.start_date))}
                </Serif>
                <EnvelopeIcon ml={0.5} />
              </Flex>
            </Link>
          )}
          {member.role_text && (
            <Serif size="4" mb={1}>
              {member.role_text}
            </Serif>
          )}
          <Flex>
            <Flex flexDirection="column" mr={2}>
              {showOrg && (
                <Serif size="4" weight="semibold" mr={0.5}>
                  Organization:
                </Serif>
              )}
              {showTeam && (
                <Serif size="4" weight="semibold" mr={0.5}>
                  Team:
                </Serif>
              )}
              {showSubteam && (
                <Serif size="4" weight="semibold" mr={0.5}>
                  Subteam:
                </Serif>
              )}
            </Flex>
            <Flex flexDirection="column">
              {showOrg && (
                <Serif size="4" mr={0.5}>
                  {member.org}
                </Serif>
              )}
              {showTeam && (
                <Serif size="4" mr={0.5}>
                  {member.team}
                </Serif>
              )}
              {showSubteam && (
                <Serif size="4" mr={0.5}>
                  {member.subteam}
                </Serif>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDirection="column" ml={1} width="500px">
          <Serif size="8" weight="semibold" mb={0.5}>
            {member.name}
          </Serif>
          {member.title && <Serif size="6">{member.title}</Serif>}
          {member.city && (
            <Serif size="6" color="black60">
              {member.city}
            </Serif>
          )}
          <Spacer mb={4} />
          {manager && (
            <>
              <Serif size="5" weight="semibold">
                Manager
              </Serif>
              <TeamMember member={manager} />
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Member;
