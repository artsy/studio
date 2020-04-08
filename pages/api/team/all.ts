import { NowRequest, NowResponse } from "@now/node";
import csv from "csvtojson";
import fetch from "isomorphic-unfetch";
import pLimit from "p-limit";
import needle from "needle";
import { imageCache } from "../../../lib/models";
import { hash } from "../../../lib/hash";
import { authorizedEndpoint } from "../../../lib/auth";

const limit = pLimit(10);

const capitalize = (s: string) => {
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
};

const resizeImage = (host: string, imageUrl: string, size?: number) => {
  host = host.startsWith("http") ? host : `http://${host}`;
  return needle(
    "get",
    `${host}/api/image/resize?url=${encodeURI(imageUrl)}${
      size ? "&size=" + size : ""
    }`
  )
    .then(res => {
      if (res.status < 400) {
        throw new Error(res.body.toString());
      }
      return res.body.toString();
    })
    .catch(err => {
      console.error("Something went wrong fetching" + err);
    });
};

const getResizedImageUrl = async (
  host: string,
  imageUrl: string,
  size: number
): Promise<string> => {
  const cacheKey = hash(imageUrl + (size ? `&size=${size}` : ""));
  const cachedImage = await imageCache.get(cacheKey);
  if (cachedImage) {
    return cachedImage;
  }
  return limit(() => resizeImage(host, imageUrl, size)).then(
    async resizedImageUrl => {
      console.log(`resized ${imageUrl} to ${size}`);
      console.log(resizedImageUrl);
      await imageCache.set(cacheKey, resizedImageUrl);
      return resizedImageUrl;
    }
  );
};

export default authorizedEndpoint(async (req: NowRequest, res: NowResponse) => {
  const { host } = req.headers;
  const { SHEETS_URL } = process.env;

  if (typeof SHEETS_URL !== "string") {
    res.status(500).setHeader("Content-Type", "application/json");
    res.end({ errors: ["`SHEETS_URL` environment variable is unset"] });
    return;
  }

  const parsed = await fetch(SHEETS_URL)
    .then(res => res.text())
    .then(csvContent => csv().fromString(csvContent));

  const seen = new Set();
  const promisedMembers = parsed
    .filter(member => {
      if (member.name && !seen.has(member.name)) {
        seen.add(member.name);
        return true;
      }
      return false;
    })
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
    .map(async member => {
      if (member.preferred_pronouns) {
        member.preferred_pronouns = member.preferred_pronouns
          .split("/")
          .map(p => capitalize(p))
          .join("/");
      }
      if (member.headshot) {
        member.profileImage = await getResizedImageUrl(
          host,
          member.headshot,
          500
        );
        member.avatar = await getResizedImageUrl(host, member.headshot, 200);
      }
      return member;
    });
  const members = await Promise.all(promisedMembers);

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.status(200).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(members));
});
