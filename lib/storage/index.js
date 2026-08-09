import fs from 'fs';
import path from 'path';

/**
 * Storage Interface Abstraction
 * Supports LocalStorageAdapter today and can easily plug S3, Supabase Storage, or Cloudinary.
 */

class LocalStorageAdapter {
  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(fileBuffer, originalFilename, mimeType) {
    const fileExt = path.extname(originalFilename);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`;
    const filePath = path.join(this.uploadDir, uniqueName);

    await fs.promises.writeFile(filePath, fileBuffer);

    return {
      name: originalFilename,
      path: `/uploads/${uniqueName}`,
      size: fileBuffer.length,
      mimeType: mimeType || 'application/octet-stream'
    };
  }

  async deleteFile(relativePath) {
    try {
      const fullPath = path.join(process.cwd(), 'public', relativePath);
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath);
      }
      return true;
    } catch (e) {
      console.error('Failed to delete file:', e);
      return false;
    }
  }
}

export const storageAdapter = new LocalStorageAdapter();
