import sharp from "sharp";
import S3 from "aws-sdk/clients/s3";
import stream from "stream";
import { env } from "libs/utils";
import { authorizedEndpoint } from "libs/auth";
import { hash } from "utils";

const streamToS3 = (
  s3: S3,
  key: string,
  done: (err: Error, data: S3.ManagedUpload.SendData) => void
) => {
  const pass = new stream.PassThrough();
  const params: S3.PutObjectRequest = {
    Bucket: env("IMAGE_BUCKET"),
    Key: key,
    Body: pass,
    ACL: "public-read",
  };
  s3.upload(params, done);
  return pass;
};

export default authorizedEndpoint(async (req, res, fetch) => {
  const s3 = new S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  });
  const { url, size = 200 } = req.query;
  if (typeof url !== "string") {
    res.status(422).send("No url provided");
    res.end();
    return;
  }
  const imageUrl = new URL(url);
  if (imageUrl.href.includes("dropbox")) {
    imageUrl.search = "?raw=1";
  }

  const resizer = sharp()
    .rotate()
    .resize(parseInt(size as any), parseInt(size as any));

  await fetch(imageUrl.href)
    .then((imgRes) => {
      return new Promise((resolve) => {
        if (!imgRes.headers.get("content-type")?.includes("image")) {
          res.status(500).send(`${imageUrl} resulted in invalid context type`);
          res.end();
          resolve();
          return;
        }
        if (imgRes.status >= 400) {
          res.status(404).send(`${imageUrl} couldn't be found`);
          res.end();
          resolve();
          return;
        }
        (imgRes.body as any).pipe(resizer).pipe(
          streamToS3(
            s3,
            `team/${hash(
              imageUrl.href + "?size=" + size
            )}.${imageUrl.pathname.split(".").pop()}`,
            (err, data) => {
              if (err) {
                console.error(err);
                res.status(500).send("Unable to process image");
              } else {
                res.status(200).send(data.Location);
              }
              res.end();
              resolve();
            }
          )
        );
      });
    })
    .catch((err) => {
      console.error("Could not resise image:", err);
      res.status(422).send("Unable to process image" + err);
      res.end();
    });
});
