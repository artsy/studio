/**
 * Deletes ALL metadata from studio. Use with caution
 */
import { metadata } from "../../../lib/models";
import { NowRequest, NowResponse } from "@now/node";

export default async (_req: NowRequest, res: NowResponse) => {
  await metadata.erase();
  res.status(200).send("metadata erased");
};
