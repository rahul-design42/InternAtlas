import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { StorageService } from '../storageService';
import { config } from '../../config/env';

/**
 * AWS S3 Cloud Storage Provider
 * 
 * STATUS: IMPLEMENTED — NOT LIVE VERIFIED
 * Requires:
 *   S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY
 * 
 * Resumes are stored as private objects (no public-read ACL).
 * Organization logos may be served publicly if needed (set ACL per folder).
 * Signed URLs should be used to deliver private resume downloads.
 */
export class S3StorageService implements StorageService {
  private client: S3Client;
  private bucket: string;

  constructor() {
    this.client = new S3Client({
      region: config.storage.s3Region,
      credentials: {
        accessKeyId: config.storage.s3AccessKey,
        secretAccessKey: config.storage.s3SecretKey,
      },
    });
    this.bucket = config.storage.s3Bucket;
  }

  async uploadFile(fileBuffer: Buffer, originalName: string, mimeType: string, folder: string = 'misc'): Promise<{ url: string; key: string }> {
    const ext = path.extname(originalName);
    const fileName = `${uuidv4()}${ext}`;
    const key = `${folder}/${fileName}`;

    await this.client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      // NOTE: No ACL set — objects are private by default.
      // Use signed URLs for access to private resources (resumes).
      // For logos, a separate public bucket or CDN may be appropriate.
    }));

    const url = `https://${this.bucket}.s3.${config.storage.s3Region}.amazonaws.com/${key}`;
    return { url, key };
  }

  async deleteFile(key: string): Promise<boolean> {
    try {
      await this.client.send(new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }));
      return true;
    } catch (error: any) {
      console.error(`[S3] Delete failed for key ${key}: ${error.code}`);
      return false;
    }
  }
}
