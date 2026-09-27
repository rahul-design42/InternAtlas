import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';

// Abstract Storage Interface
export interface StorageService {
  uploadFile(fileBuffer: Buffer, originalName: string, mimeType: string, folder?: string): Promise<{ url: string, key: string }>;
  deleteFile(key: string): Promise<boolean>;
}

// Local implementation for development
class LocalStorageService implements StorageService {
  private baseDir = path.join(__dirname, '../../uploads');

  constructor() {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async uploadFile(fileBuffer: Buffer, originalName: string, mimeType: string, folder: string = 'misc'): Promise<{ url: string, key: string }> {
    const ext = path.extname(originalName);
    const fileName = `${uuidv4()}${ext}`;
    
    const folderPath = path.join(this.baseDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, fileBuffer);

    return {
      url: `/uploads/${folder}/${fileName}`,
      key: `${folder}/${fileName}`
    };
  }

  async deleteFile(key: string): Promise<boolean> {
    const filePath = path.join(this.baseDir, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
}

// Provider is selected via STORAGE_PROVIDER env var
// STORAGE_PROVIDER=local  → LocalStorageService (default)
// STORAGE_PROVIDER=s3     → S3StorageService (production, requires S3_* vars)
let storageInstance: StorageService;

if (config.storage.provider === 's3') {
  // Lazy require to avoid loading AWS SDK when not needed
  const { S3StorageService } = require('./S3StorageService');
  storageInstance = new S3StorageService();
  console.log('[Storage] Using S3StorageService — STATUS: IMPLEMENTED, NOT LIVE VERIFIED');
} else {
  storageInstance = new LocalStorageService();
  if (config.nodeEnv === 'production') {
    console.warn('[Storage] WARNING: Using local file storage in production. Set STORAGE_PROVIDER=s3 for production.');
  }
}

export const storageService: StorageService = storageInstance;
