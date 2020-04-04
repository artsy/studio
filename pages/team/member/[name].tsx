import { useRouter } from "next/router";
import { Box, Link, Serif } from "@artsy/palette";
import {
  TeamMember,
  formatMemberName,
  getServerSideProps as getTeamProps
} from "../index";
import { GetServerSideProps } from "next";
import ErrorPage from "next/error";
import { H1 } from "../../../components/Typography";

export const getServerSideProps: GetServerSideProps = async (...args) => {
  return getTeamProps(...args);
};

const Member = props => {
  const router = useRouter();
  const name = router.query.name;

  const member = props.data.find(member => {
    return formatMemberName(member.name) === name;
  });

  if (!member) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Box>
      <H1>{member.name}</H1>
      <TeamMember member={member} />
      {member.role_text && <Serif size="2">{member.role_text}</Serif>}

      {member.intro_email && (
        <Link href={member.intro_email}>
          <Serif size="2">Intro email</Serif>
        </Link>
      )}
      <Serif size="2">Joined: {member.start_date}</Serif>
      <Serif size="2">Teams</Serif>
      <Serif size="2">{member.team}</Serif>
      <Serif size="2">Reports To</Serif>
      <Serif size="2">{member.reports_to}</Serif>
      <Serif size="2">{member.personal_bio}</Serif>
    </Box>
  );
};

export default Member;
