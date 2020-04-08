import to from "await-to-js";
import cookie from "cookie";
import { GetServerSideProps } from "next";
import { NowRequest, NowResponse } from "@now/node";
import fetch from "isomorphic-unfetch";
import { IncomingHttpHeaders } from "http";

const COOKIE_NAME = "artsy-studio-token";
type Context = Parameters<GetServerSideProps>[0];
export type Fetcher = typeof fetch;

export const createAuthenticatedFetcher = (headers: IncomingHttpHeaders) => (
  input: RequestInfo,
  init: RequestInit = {}
) =>
  fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...init.headers,
      cookie: headers.cookie,
      "x-bypass-token": (headers["x-bypass-token"] as string) || ""
    }
  });

export const authorizedEndpoint = (
  lambda: (rq: NowRequest, rs: NowResponse, fetcher: typeof fetch) => void
) => {
  return async (req: NowRequest, res: NowResponse) => {
    // This should never be held by or passed from any client
    // it's specifically _only_ to make api to api service calls
    // faster.
    const bypassToken = req.headers["x-bypass-token"];
    if (
      typeof bypassToken === "string" &&
      bypassToken === process.env.BYPASS_TOKEN
    ) {
      const fetcher = createAuthenticatedFetcher({
        "x-bypass-token": bypassToken
      });
      return lambda(req, res, fetcher);
    }

    const token = cookie.parse(req.headers.cookie)[COOKIE_NAME];
    if (!token || typeof token !== "string") {
      res.status(401).send("Not authorized");
      res.end();
    } else {
      const authorized = checkUserAuthorization(token);
      if (!authorized) {
        res.status(401).send("Not authorized");
        res.end();
      } else {
        const fetcher = createAuthenticatedFetcher({
          "x-bypass-token": process.env.BYPASS_TOKEN
        });
        await lambda(req, res, fetcher);
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
    "Set-Cookie": cookie.serialize(COOKIE_NAME, token, { httpOnly: true })
  };
};
