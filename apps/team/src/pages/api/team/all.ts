import csv from "csvtojson";
import pLimit from "p-limit";
import { imageCache } from "@artsy-studio/models";
import { authorizedEndpoint, Fetcher } from "@artsy-studio/auth";
import { urlFromReq, hash, capitalize } from "@artsy-studio/utils";

const limit = pLimit(10);

const resizeImage = (
  fetch: Fetcher,
  url: string,
  imageUrl: string,
  size?: number
) => {
  return fetch(
    `${url}/api/image/resize?url=${encodeURI(imageUrl)}${
      size ? "&size=" + size : ""
    }`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Couldn't result image ${imageUrl}`);
      }
      return res.text();
    })
    .catch((err) => {
      console.error(err);
    });
};

const getResizedImageUrl = async (
  fetch: Fetcher,
  url: string,
  imageUrl: string,
  size: number
): Promise<string | undefined> => {
  const cacheKey = hash(imageUrl + (size ? `&size=${size}` : ""));
  const cachedImage = await imageCache.get(cacheKey);
  if (cachedImage) {
    return cachedImage;
  }
  return limit(() => resizeImage(fetch, url, imageUrl, size)).then(
    async function afterResizingImage(resizedImageUrl) {
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
  const url = urlFromReq(req);
  const { SHEETS_URL } = process.env;

  if (typeof SHEETS_URL !== "string") {
    res.status(500).setHeader("Content-Type", "application/json");
    res.end({ errors: ["`SHEETS_URL` environment variable is unset"] });
    return;
  }

  const parsed = await fetch(SHEETS_URL)
    .then((res) => res.text())
    .then((csvContent) => csv().fromString(csvContent));

  const seen = new Set();
  const promisedMembers = parsed
    .filter((member) => {
      if (member.name && !seen.has(member.name)) {
        seen.add(member.name);
        return true;
      }
      return false;
    })
    .sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0))
    .map(async (member) => {
      if (member.preferred_pronouns) {
        member.preferred_pronouns = member.preferred_pronouns
          .split("/")
          .map((p: string) => capitalize(p))
          .join("/");
      }
      if (member.headshot) {
        member.profileImage = await getResizedImageUrl(
          fetch,
          url,
          member.headshot,
          500
        );
        member.avatar = await getResizedImageUrl(
          fetch,
          url,
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
