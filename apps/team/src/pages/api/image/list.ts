import { imageCache } from "utils/models";
import { NowResponse } from "@now/node";
import { authorizedEndpoint } from "libs/auth";

export default authorizedEndpoint(async (_, res: NowResponse) => {
  const results = await imageCache.list();
  if (results) {
    res.status(200).send(JSON.stringify(results));
  } else {
    res.status(404).send("No results");
  }
});
