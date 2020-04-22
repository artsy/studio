import { metadata } from "utils/models";
import { NowRequest, NowResponse } from "@now/node";
import { authorizedEndpoint } from "libs/auth";

export default authorizedEndpoint(
  async (_req: NowRequest, res: NowResponse) => {
    const results = await metadata.get();
    res.status(200).send(JSON.stringify(results));
  }
);
