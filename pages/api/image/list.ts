import { imageCache } from "../../../lib/models";
import { NowRequest, NowResponse } from "@now/node";

export default async (_req: NowRequest, res: NowResponse) => {
  const results = await imageCache.list();
  res.status(200).send(JSON.stringify(results));
};
