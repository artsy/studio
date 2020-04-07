// image-51261d5c19915e9050bc7f2c1a8e23be
import { imageCache } from "../../../lib/models";
import { NowRequest, NowResponse } from "@now/node";

export default async (req: NowRequest, res: NowResponse) => {
  const { id } = req.query;
  await imageCache.delete(id);
  res.status(200).send(`${id} successfully deleted`);
};
