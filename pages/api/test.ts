import { NowRequest, NowResponse } from "@now/node";
export default async (req: NowRequest, res) => {
  res.send(req.headers.host);
};
