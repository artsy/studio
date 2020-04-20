import crypto from "crypto";

export const hash = (source: string) =>
  crypto.createHash("md5").update(source).digest("hex");

export const firstIfMany = <T>(arg: T | T[]): T => {
  if (Array.isArray(arg)) {
    return arg[0];
  }
  return arg;
};

export const normalizeParam = (param: string) =>
  param.replace(/[\W_]+/g, "_").toLowerCase();
