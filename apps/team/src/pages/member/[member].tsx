import { useRouter } from "next/router";
import { formatDistanceToNow } from "date-fns";
import {
  Box,
  Link,
  Serif,
  Spinner,
  Flex,
  ResponsiveImage,
  Spacer,
  space,
  Separator,
} from "@artsy/palette";
import Error from "next/error";
import { normalizeParam } from "@artsy-studio/utils";
import { useMemo, FC } from "react";
import { H1 } from "@artsy-studio/components";
import RouterLink from "next/link";
import { Member as MemberType, ServerProps } from "../index";

export { getServerSideProps } from "../index";

const Member: FC<ServerProps> = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return <Spinner />;
  }

  if (!props.data) {
    return <Error statusCode={500} />;
  }

  const name = router.query.member;
  let member: MemberType | undefined;
  let manager: MemberType | undefined;

  useMemo(() => {
    member = props!.data!.find((employee) => {
      return normalizeParam(employee.name) === name;
    });
    if (member && member?.reports_to) {
      manager = props!.data!.find((employee) => {
        return employee.name === member!.reports_to;
      });
    }
  }, [name]);

  if (!member) {
    return <Error statusCode={404} />;
  }

  const showOrg = !!member.org;
  const showTeam = showOrg && member.team && !member.org?.includes(member.team);
  const showSubteam =
    showTeam && member.subteam && !member.team!.includes(member.subteam);

  return (
    <>
      <H1>{member.name}</H1>
      <Separator mb={space(4) + 5} />
      <Flex>
        <Flex flexDirection="column" flexBasis="min-content">
          <Box minWidth="300px" width="300px" mb={2}>
            {member.profileImage && (
              <ResponsiveImage src={member.profileImage} />
            )}
          </Box>

          {member.title && (
            <Serif size="6" mb={0.5}>
              {member.title}
            </Serif>
          )}
          {member.city && (
            <Serif size="6" color="black60">
              {member.city}
            </Serif>
          )}
          <Spacer mb={2} />

          {member.role_text && (
            <Serif size="4" mb={2}>
              {member.role_text}
            </Serif>
          )}
          <Flex flexDirection="column">
            {member.start_date && (
              <Flex mb={0.5}>
                <Serif size="4" weight="semibold" mr={0.5} style={{ flex: 1 }}>
                  Joined:
                </Serif>
                <Link
                  href={member.intro_email}
                  underlineBehavior="hover"
                  mr={0.5}
                  style={{ flex: 1 }}
                >
                  <Flex alignItems="center">
                    <Serif size="4" mr={0.5}>
                      {formatDistanceToNow(new Date(member.start_date))}
                    </Serif>
                  </Flex>
                </Link>
              </Flex>
            )}
            {member.preferred_pronouns && (
              <Flex mb={0.5}>
                <Serif size="4" weight="semibold" mr={0.5} style={{ flex: 1 }}>
                  Pronouns:
                </Serif>
                <Serif size="4" mr={0.5} style={{ flex: 1 }}>
                  {member.preferred_pronouns}
                </Serif>
              </Flex>
            )}
            {showOrg && (
              <Flex mb={0.5}>
                <Serif size="4" weight="semibold" mr={0.5} style={{ flex: 1 }}>
                  Organization:
                </Serif>
                <Serif size="4" mr={0.5} style={{ flex: 1 }}>
                  {member.org}
                </Serif>
              </Flex>
            )}
            {showTeam && (
              <Flex mb={0.5}>
                <Serif size="4" weight="semibold" mr={0.5} style={{ flex: 1 }}>
                  Team:
                </Serif>{" "}
                <Serif size="4" mr={0.5} style={{ flex: 1 }}>
                  {member.team}
                </Serif>
              </Flex>
            )}
            {showSubteam && (
              <Flex mb={0.5}>
                <Serif size="4" weight="semibold" mr={0.5} style={{ flex: 1 }}>
                  Subteam:
                </Serif>
                <Serif size="4" mr={0.5} style={{ flex: 1 }}>
                  {member.subteam}
                </Serif>
              </Flex>
            )}
            {manager && (
              <Flex mb={0.5}>
                <Serif size="4" weight="semibold" style={{ flex: 1 }}>
                  Manager
                </Serif>
                <Box style={{ flex: 1 }}>
                  <RouterLink
                    href={"/team/member/[member]"}
                    as={`/team/member/${normalizeParam(manager.name)}`}
                    passHref
                  >
                    <Link>
                      <Serif size="4">{manager.name}</Serif>
                    </Link>
                  </RouterLink>
                </Box>
              </Flex>
            )}
          </Flex>
          <Flex flexDirection="column"></Flex>
        </Flex>
        <Flex flexDirection="column" ml={3} width="500px"></Flex>
      </Flex>
    </>
  );
};

export default Member;