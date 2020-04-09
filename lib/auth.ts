import to from "await-to-js";
import cookie from "node-cookie";
import { GetServerSideProps } from "next";
import { NowRequest, NowResponse } from "@now/node";
import fetch from "isomorphic-unfetch";
import { IncomingMessage, ServerResponse } from "http";

const COOKIE_NAME = "artsy-studio-user-token";
type Context = Parameters<GetServerSideProps>[0];
export type Fetcher = typeof fetch;

export const createAuthenticatedFetcher = (req: IncomingMessage) => (
  input: RequestInfo,
  init: RequestInit = {}
) =>
  fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      ...init.headers,
      cookie: req.headers.cookie
    }
  });

export const authorizedEndpoint = (
  lambda: (rq: NowRequest, rs: NowResponse, fetcher: Fetcher) => void
) => {
  return async (req: NowRequest, res: NowResponse) => {
    if (verifyCookie(req, res)) {
      const fetcher = createAuthenticatedFetcher(req);
      return lambda(req, res, fetcher);
    }
  };
};

export const authorizedPage = (
  getServerSideProps: (
    context: Context,
    fetcher: Fetcher
  ) => ReturnType<GetServerSideProps>
): GetServerSideProps => {
  return async (context: Context) => {
    if (await verifyServerSideAuthorization(context)) {
      const fetcher = createAuthenticatedFetcher(context.req);
      return getServerSideProps(context, fetcher);
    }
    return { props: {} };
  };
};

export const verifyServerSideAuthorization = async (context: Context) => {
  const { req, res } = context;
  const { host } = req.headers;

  const { user } =
    cookie.get(req, COOKIE_NAME, process.env.COOKIE_SECRET, true) ?? {};

  if (!user) {
    res.writeHead(302, {
      Location: `https://stagingapi.artsy.net/oauth2/authorize?client_id=${
        process.env.APP_ID
      }&redirect_uri=http://${host}/oauth2/callback?redirect_to=${encodeURI(
        req.url
      )}&response_type=code`
    });
    res.end();
  } else {
    if (user?.roles?.includes("team")) {
      return true;
    }
    res.writeHead(401, "Not authorized");
    res.end();
  }
};

const getUserDetails = async (token: string) =>
  fetch("https://stagingapi.artsy.net/api/v1/me", {
    method: "GET",
    headers: {
      "X-Access-Token": token,
      Accept: "application/json"
    }
  }).then(res => res.json());

export const checkUserAuthorization = async (token: string) => {
  const [_, user] = await to(getUserDetails(token));
  if (user?.roles?.includes("team")) {
    return true;
  }
  return false;
};

export const verifyCookie = (req: IncomingMessage, res: ServerResponse) => {
  const { user } =
    cookie.get(req, COOKIE_NAME, process.env.COOKIE_SECRET, true) ?? {};
  if (user?.roles?.includes("team")) {
    return user;
  }
  res.writeHead(401, "Not authorized");
  res.end();
  return false;
};

export const setUserCookie = async (res: ServerResponse, token: string) => {
  const user = await getUserDetails(token);
  if (user?.roles?.includes("team")) {
    cookie.create(
      res,
      COOKIE_NAME,
      {
        token,
        user: {
          roles: user.roles
        }
      },
      {
        secure: false,
        sameSite: "lax",
        httpOnly: false,
        path: "/"
      },
      process.env.COOKIE_SECRET,
      true
    );
    return;
  }

  throw new Error("Not Authorized");
};

export const redirectAuthorizedUsersWithCookie = async (
  res: ServerResponse,
  token: string,
  redirectUrl: string
) => {
  const [error] = await to(setUserCookie(res, token));
  if (!error) {
    res.writeHead(302, {
      Location: redirectUrl,
      "Set-Cookie": res.getHeader("set-cookie")
    });
    res.end();
  }
};
