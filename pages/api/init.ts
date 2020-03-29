// Setup for models
import { Metadata } from "../../lib/models";
import { NowRequest, NowResponse } from "@now/node";

export default async (_req: NowRequest, res: NowResponse) => {
  Metadata.create();
  res.status(200).send("Models initialized");
};
