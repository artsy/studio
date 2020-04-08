import to from "await-to-js";
import cookie from "cookie";
import { GetServerSideProps } from "next";
import { NowRequest, NowResponse } from "@now/node";
import fetch from "isomorphic-unfetch";

const COOKIE_NAME = "artsy-studio-token";
type Context = Parameters<GetServerSideProps>[0];

export const authorizedEndpoint = (
  lambda: (rq: NowRequest, rs: NowResponse) => void
) => {
  return async (req: NowRequest, res: NowResponse) => {
    const token = req.headers["X-Access-Token"];
    if (!token || typeof token !== "string") {
      res.status(401).send("Not authorized");
      res.end();
    } else {
      const authorized = checkUserAuthorization(token);
      if (!authorized) {
        res.status(401).send("Not authorized");
        res.end();
      } else {
        await lambda(req, res);
      }
    }
  };
};

export const authorizedPage = (
  getServerSideProps: GetServerSideProps
): GetServerSideProps => {
  return async (context: Context) => {
    await verifyServerSideAuthorization(context);
    return getServerSideProps(context);
  };
};

export const verifyServerSideAuthorization = async (context: Context) => {
  const { req, res } = context;
  const { host } = req.headers;

  const token = cookie.parse(req.headers.cookie)[COOKIE_NAME];

  if (!token) {
    res.writeHead(302, {
      Location: `https://stagingapi.artsy.net/oauth2/authorize?client_id=${
        process.env.APP_ID
      }&redirect_uri=http://${host}/oauth2/callback?redirect_to=${encodeURI(
        req.url
      )}&response_type=code`
    });
    res.end();
  } else {
    const authorized = await checkUserAuthorization(token);
    if (!authorized) {
      res.writeHead(401);
      res.end();
      return false;
    }
  }
};

export const checkUserAuthorization = async (token: string) => {
  const [_, user] = await to(
    fetch("https://stagingapi.artsy.net/api/v1/me", {
      method: "GET",
      headers: {
        "X-Access-Token": token,
        Accept: "application/json"
      }
    }).then(res => res.json())
  );
  if (user?.roles?.includes("team")) {
    return true;
  }
  return false;
};

export const setTokenCookie = (token: string) => {
  return {
    "Set-Cookie": cookie.serialize(COOKIE_NAME, token)
  };
};
