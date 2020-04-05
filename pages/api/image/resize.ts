import sharp from "sharp";
import fetch from "node-fetch";
import { NowRequest, NowResponse } from "@now/node";
import S3 from "aws-sdk/clients/s3";
import stream from "stream";
import { hash } from "../../../lib/hash";

const streamToS3 = (
  s3: S3,
  key: string,
  done: (err: Error, data: S3.ManagedUpload.SendData) => void
) => {
  const pass = new stream.PassThrough();
  const params = {
    Bucket: process.env.IMAGE_BUCKET,
    Key: key,
    Body: pass,
    ACL: "public-read"
  };
  s3.upload(params, done);
  return pass;
};

export default async (req: NowRequest, res: NowResponse) => {
  const s3 = new S3();
  const { url, size = 200 } = req.query;
  if (typeof url !== "string") {
    res.status(422).send("No url provided");
    res.end();
    return;
  }
  const imageUrl = new URL(url);
  imageUrl.search = "?raw=1";

  const resizer = sharp()
    .rotate()
    .resize(parseInt(size as any), parseInt(size as any));

  await fetch(imageUrl.href)
    .then(imgRes => {
      return new Promise(resolve => {
        if (imgRes.status >= 400) {
          res.status(404).send(`${imageUrl} couldn't be found`);
          res.end();
          resolve();
          return;
        }
        imgRes.body.pipe(resizer).pipe(
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
    .catch(err => {
      console.error("Could not resise image:", err);
      res.status(422).send("Unable to process image" + err);
      res.end();
    });
};
