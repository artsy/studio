import { metadata } from "@artsy-studio/models";
import { NowRequest, NowResponse } from "@now/node";
import { authorizedEndpoint } from "@artsy-studio/auth";

export default authorizedEndpoint(
  async (_req: NowRequest, res: NowResponse) => {
    const results = await metadata.get();
    res.status(200).send(JSON.stringify(results));
  }
);
