import { imageCache } from "utils/models";
import { authorizedEndpoint } from "libs/auth";
import { firstIfMany } from "utils";
import to from "await-to-js";

export default authorizedEndpoint(async (req, res) => {
  const { id } = req.query;
  const [error] = await to(imageCache.delete(firstIfMany(id)));
  if (error) {
    res.status(500).send(error);
  } else {
    res.status(200).send(`Image ${id} deleted`);
  }
});
