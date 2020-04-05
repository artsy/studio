import { metadata } from "../../../lib/models";
import { NowRequest, NowResponse } from "@now/node";

export default async (_req: NowRequest, res: NowResponse) => {
  const results = await metadata.get();
  res.status(200).send(JSON.stringify(results));
};
