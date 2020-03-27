import { NowRequest, NowResponse } from "@now/node";
import csv from "csvtojson";
import fetch from "node-fetch";
import memoize from "fast-memoize";
import pLimit from "p-limit";
import needle from "needle";

const fetchHeadshot = memoize((host: string, imageUrl: string) =>
  needle(
    "get",
    `${host}/api/team/image/resize?url=${encodeURI(imageUrl)}`
  ).then(res => {
    console.log("BODY", res.body);
    return res.body.toString();
  })
);

const limit = pLimit(20);

export default async (req: NowRequest, res: NowResponse) => {
  const { host } = req.headers;
  const { SHEETS_URL } = process.env;

  if (typeof SHEETS_URL !== "string") {
    res.status(500).setHeader("Content-Type", "application/json");
    res.end({ errors: ["`SHEETS_URL` environment variable is unset"] });
    return;
  }

  const csvContent = await fetch(SHEETS_URL).then(res => res.text());
  const parsed = await csv().fromString(csvContent);
  const promisedMembers = [parsed.filter(member => !!member.name)[0]].map(
    async member => {
      if (member.headshot) {
        await limit(() =>
          fetchHeadshot(
            host.startsWith("http") ? host : `http://${host}`,
            member.headshot
          )
        ).then(headshotUrl => (member.headshot = headshotUrl));
      }
      return member;
    }
  );

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.status(200).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(await Promise.all(promisedMembers)));
};
