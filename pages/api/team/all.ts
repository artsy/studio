import csv from "csvtojson";
import pLimit from "p-limit";
import { imageCache } from "../../../lib/models";
import { hash } from "../../../lib/hash";
import { authorizedEndpoint, Fetcher } from "../../../lib/auth";

const limit = pLimit(10);

const capitalize = (s: string) => {
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
};

const resizeImage = (
  fetch: Fetcher,
  host: string,
  imageUrl: string,
  size?: number
) => {
  host = host.startsWith("http") ? host : `http://${host}`;
  return fetch(
    `${host}/api/image/resize?url=${encodeURI(imageUrl)}${
      size ? "&size=" + size : ""
    }`
  )
    .then(res => {
      if (!res.ok) {
        throw new Error(`Couldn't result image ${imageUrl}`);
      }
      return res.text();
    })
    .catch(err => {
      console.error(err);
    });
};

const getResizedImageUrl = async (
  fetch: Fetcher,
  host: string,
  imageUrl: string,
  size: number
): Promise<string> => {
  const cacheKey = hash(imageUrl + (size ? `&size=${size}` : ""));
  const cachedImage = await imageCache.get(cacheKey);
  if (cachedImage) {
    return cachedImage;
  }
  return limit(() => resizeImage(fetch, host, imageUrl, size)).then(
    async resizedImageUrl => {
      if (!resizedImageUrl) {
        return;
      }
      console.log(`resized ${imageUrl} to ${size}`);
      console.log(resizedImageUrl);
      await imageCache.set(cacheKey, resizedImageUrl);
      return resizedImageUrl;
    }
  );
};

export default authorizedEndpoint(async (req, res, fetch) => {
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
          fetch,
          host,
          member.headshot,
          500
        );
        member.avatar = await getResizedImageUrl(
          fetch,
          host,
          member.headshot,
          200
        );
      }
      return member;
    });
  const members = await Promise.all(promisedMembers);

  res.status(200).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(members));
});
