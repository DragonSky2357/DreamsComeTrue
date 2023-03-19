import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import path from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const multerOptionsFactory = (
  configservice: ConfigService,
): MulterOptions => {
  const s3 = new S3Client({
    region: configservice.get('AWS_BUCKET_REGION'),
    credentials: {
      accessKeyId: configservice.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configservice.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  return {
    storage: multerS3({
      s3,
      bucket: configservice.get('AWS_S3_BUCKET_NAME'),
      key(_req, file, done) {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);

        done(null, `${basename}_${Date.now()}${ext}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
  };
};
