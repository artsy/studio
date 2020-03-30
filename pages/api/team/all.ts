import { NowRequest, NowResponse } from "@now/node";
import csv from "csvtojson";
import fetch from "node-fetch";
import memoize from "fast-memoize";
import pLimit from "p-limit";
import needle from "needle";
import { teamNavImageCache } from "../../../lib/models";
import { hash } from "../../../lib/hash";

// arn:aws:sdb:us-east-1:585031190124:domain/artsy-studio

const fetchHeadshot = (host: string, imageUrl: string) =>
  needle("get", `${host}/api/team/image/resize?url=${encodeURI(imageUrl)}`)
    .then(res => {
      if (res.status < 400) {
        throw new Error(res.body.toString());
      }
      return res.body.toString();
    })
    .catch(err => {
      console.error("Something went wrong fetching" + err);
    });

const limit = pLimit(20);

export default async (req: NowRequest, res: NowResponse) => {
  const { host } = req.headers;
  const { SHEETS_URL } = process.env;

  if (typeof SHEETS_URL !== "string") {
    res.status(500).setHeader("Content-Type", "application/json");
    res.end({ errors: ["`SHEETS_URL` environment variable is unset"] });
    return;
  }

  const [imageCache, parsed] = await Promise.all([
    teamNavImageCache.get(),
    fetch(SHEETS_URL)
      .then(res => res.text())
      .then(csvContent => csv().fromString(csvContent))
  ]);

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
      if (member.headshot) {
        const headshotHash = hash(member.headshot);
        // If it's in the cache, skip computing it
        if (imageCache.images[headshotHash]) {
          member.headshot = imageCache.images[headshotHash];
          return member;
        }

        await limit(() =>
          fetchHeadshot(
            host.startsWith("http") ? host : `http://${host}`,
            member.headshot
          )
        )
          .then(headshotUrl => {
            imageCache.images[headshotHash] = headshotUrl;
            member.headshot = headshotUrl;
          })
          .catch(err => {
            console.error("err");
          });
      }
      return member;
    });
  const members = await Promise.all(promisedMembers);
  await teamNavImageCache.set(imageCache);

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.status(200).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(members));
};
