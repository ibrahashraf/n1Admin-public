import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';

const bucketName = 'venus'; // your MinIO bucket name

export default async function Handle(req, res) {
  const form = new multiparty.Form();

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  // 🟢 Use MinIO endpoint instead of AWS region
  const client = new S3Client({
    endpoint: process.env.S3_ENDPOINT, // e.g. https://minio.venusoutlet.net
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true, // 🔥 REQUIRED for MinIO
  });

  const links = [];

  for (const file of files.file) {
    const ext = file.originalFilename.split('.').pop();
    const newFileName = `${Date.now()}.${ext}`;

    await client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: newFileName,
        Body: fs.readFileSync(file.path),
        ACL: 'public-read',
        ContentType: mime.lookup(file.path) || 'application/octet-stream',
      })
    );

    // 🔗 Public URL (path-style, not AWS style)
    const link = `${process.env.S3_ENDPOINT}/${bucketName}/${newFileName}`;
    links.push(link);
  }

  return res.json({ links });
}

export const config = {
  api: { bodyParser: false },
};
