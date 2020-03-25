import { NowRequest, NowResponse } from "@now/node";
import csv from "csvtojson";
import fetch from "node-fetch";

export default async (req: NowRequest, res: NowResponse) => {
  const { SHEETS_URL } = process.env;

  if (typeof SHEETS_URL !== "string") {
    res.status(500).setHeader("Content-Type", "application/json");
    res.end({ errors: ["`SHEETS_URL` environment variable is unset"] });
    return;
  }

  const csvContent = await fetch(SHEETS_URL).then(res => res.text());
  const parsed = await csv().fromString(csvContent);
  const members = parsed.filter(member => !!member.name);

  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
  res.status(200).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(members));
};
