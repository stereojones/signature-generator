import { Storage } from "@google-cloud/storage";
import { randomUUID } from "node:crypto";

let storage: Storage | null = null;

function getStorage(): Storage {
  if (!storage) {
    storage = new Storage();
  }
  return storage;
}

export function getBucketName(): string {
  const bucket = process.env.GCS_BUCKET_NAME;
  if (!bucket) {
    throw new Error("GCS_BUCKET_NAME environment variable is not set");
  }
  return bucket;
}

export async function uploadHeadshot(
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  const bucketName = getBucketName();
  const extension = contentType === "image/jpeg" ? "jpg" : "png";
  const objectName = `headshots/${randomUUID()}.${extension}`;

  const bucket = getStorage().bucket(bucketName);
  const file = bucket.file(objectName);

  await file.save(buffer, {
    contentType,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
    resumable: false,
  });

  return `https://storage.googleapis.com/${bucketName}/${objectName}`;
}
