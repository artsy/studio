import { imageCache } from "lib/models";
import { NowResponse } from "@now/node";
import { authorizedEndpoint } from "@artsy-studio/auth";

export default authorizedEndpoint(async (_, res: NowResponse) => {
  const results = await imageCache.list();
  res.status(200).send(JSON.stringify(results));
});
