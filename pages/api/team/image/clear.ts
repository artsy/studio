/**
 * Deletes formatted images from cache
 */
import { teamNavImageCache } from "../../../../lib/models";
import { NowRequest, NowResponse } from "@now/node";

export default async (_req: NowRequest, res: NowResponse) => {
  await teamNavImageCache.delete();
  const results = await teamNavImageCache.get();
  res.status(200).send(JSON.stringify(results));
};