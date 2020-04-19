import crypto from "crypto";

export const hash = (source: string) =>
  crypto
    .createHash("md5")
    .update(source)
    .digest("hex");
