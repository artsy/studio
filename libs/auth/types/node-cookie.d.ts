declare module "node-cookie" {
  export function get(
    req: import("http").IncomingRequest,
    key: string,
    secret?: string,
    decrypt?: boolean,
    cookies?: { [cookieName: string]: any }
  ): any;
  export function create(
    res: import("http").ServerResponse,
    key: string,
    value: any,
    options?: import("cookie").CookieSerializeOptions,
    secret?: string,
    encrypt?: boolean
  ): unknown;
}
