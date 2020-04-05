/**
 * Deletes formatted images from cache
 */
import { imageCache } from "../../../lib/models";
import { NowRequest, NowResponse } from "@now/node";

export default async (_req: NowRequest, res: NowResponse) => {
  await imageCache.clear();
  res.status(200).send("image cache cleared");
};
