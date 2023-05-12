import AWS, { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export async function uploadFileTo(file: any) {
  const s3 = new AWS.S3({
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
        Key: `${uuidv4()}.png`,
        Body: file,
        ContentType: 'Content-Type: image/png',
      })
      .promise();
  } catch (err) {
    console.error(err);
  }
}
