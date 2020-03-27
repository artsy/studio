import sharp from "sharp";
import fetch from "node-fetch";
import { NowRequest, NowResponse } from "@now/node";
import S3 from "aws-sdk/clients/s3";
import stream from "stream";
import crypto from "crypto";

const hash = (source: string) =>
  crypto
    .createHash("md5")
    .update(source)
    .digest("hex");

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
  const { url } = req.query;
  if (typeof url !== "string") {
    res.status(422).end();
    return;
  }

  const resizer = sharp()
    .rotate()
    .resize(100, 100, {
      position: sharp.strategy.attention
    });

  fetch(url).then(imgRes => {
    imgRes.body.pipe(resizer).pipe(
      streamToS3(s3, `team/${hash(url)}.jpg`, (err, data) => {
        if (err) {
          console.error(err);
          res.status(500).send("Unable to process image");
        } else {
          res.status(200).send(data.Location);
        }
      })
    );
  });
};
