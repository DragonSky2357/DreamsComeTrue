import * as bcrypt from 'bcrypt';
import Aws from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export const hash = async (plainText: string): Promise<string> => {
  const saltOrRounds = 10;
  return await bcrypt.hash(plainText, saltOrRounds);
};

export const isHashValid = async (password, hashPassword): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

export const uploadFile = async (file: any, folder: string) => {
  const s3 = new Aws.S3({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    return await s3
      .upload({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${folder}/${uuidv4()}.png`,
        Body: file,
        ContentType: 'Content-Type: image/png',
      })
      .promise();
  } catch (err) {
    console.error(err);
  }
};
