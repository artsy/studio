import { metadata } from "lib/models";
import { NowRequest, NowResponse } from "@now/node";
import { authorizedEndpoint } from "lib/auth";

export default authorizedEndpoint(
  async (_req: NowRequest, res: NowResponse) => {
    const results = await metadata.get();
    res.status(200).send(JSON.stringify(results));
  }
);
