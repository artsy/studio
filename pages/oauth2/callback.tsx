import { GetServerSideProps } from "next";
import { H1 } from "../../components/Typography";
import fetch from "isomorphic-unfetch";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  console.log(query);
  const tokenResults = await fetch(
    "https://stagingapi.artsy.net/oauth2/access_token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        client_id: process.env.APP_ID,
        client_secret: process.env.APP_SECRET,
        code: query.code,
        grant_type: "authorization_code"
      })
    }
  ).then(res => res.json());
  console.log(tokenResults);
  const user = await fetch("https://stagingapi.artsy.net/api/v1/me", {
    method: "GET",
    headers: {
      "X-Access-Token": tokenResults.access_token,
      Accept: "application/json"
    }
  }).then(res => res.json());
  console.log(user);

  return { props: {} };
};

const LoggingIn = () => {
  return <H1>Something went wrong</H1>;
};

export default LoggingIn;
