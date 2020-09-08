import fs from "fs";
import { getS3 } from './s3-client';
import { PutObjectRequest, ManagedUpload } from 'aws-sdk/clients/s3';

const envVars = process.env;

const {
  AWS_S3_BUCKET,
} = envVars;

export const uploadImage = async (
  imagePath: string,
  fileKey: string, // includes folders and filename (ex 'folder/subfolder/myfile.jpg')
): Promise<ManagedUpload.SendData | false> => {

  const s3 = getS3();

  const fileContent = fs.readFileSync(imagePath);

  const params: PutObjectRequest = {
    Bucket: AWS_S3_BUCKET!,
    Key: fileKey,
    Body: fileContent,
    ACL: 'public-read',
    ContentDisposition: 'attachment',
  };

  return new Promise(async (resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('error trying to upload image', err);
        reject(false);
      }
      console.log(`File uploaded successfully`);
      console.log('data.Location', data.Location);
      console.log('data.ETag', data.ETag);
      console.log('data.Bucket', data.Bucket);
      console.log('data.Key', data.Key);
      resolve(data);
    });
  });
};
