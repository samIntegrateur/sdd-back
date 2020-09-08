import AWS, { S3 } from "aws-sdk";

const envVars = process.env;

const {
  AWS_S3_ID,
  AWS_S3_SECRET,
  AWS_S3_REGION,
} = envVars;

let s3: S3;

const connectS3 = () => {
  console.log('connect s3');
  // how to catch errors ? (if we provide fake access, we still have a s3 object)
  s3 = new AWS.S3({
    region: AWS_S3_REGION,
    accessKeyId: AWS_S3_ID,
    secretAccessKey: AWS_S3_SECRET,
  });
};

export const getS3 = (): S3 => {
  console.log('get s3');
  if (!s3) {
    connectS3();
  }

  return s3;
};
