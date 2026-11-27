/**
 * The Daily Knead - Storage Module
 * Menyimpan media ke folder lokal public/uploads/
 * Siap dimigrasikan ke cloud storage (Vercel Blob, Cloudinary, S3) di masa depan
 */

import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Pastikan folder public/uploads selalu ada
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export interface SaveFileResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export async function saveFile(
  file: File,
  allowedTypes: string[] = ["image/jpeg", "image/png", "image/webp"],
  maxSizeBytes: number = 5 * 1024 * 1024 // 5 MB
): Promise<SaveFileResult> {
  try {
    // 1. Validasi Tipe File
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: `Tipe file '${file.type}' tidak didukung. Harap unggah file JPG, PNG, atau WebP.`,
      };
    }

    // 2. Validasi Ukuran File
    if (file.size > maxSizeBytes) {
      return {
        success: false,
        error: `Ukuran file melebihi batas maksimal ${Math.round(maxSizeBytes / (1024 * 1024))} MB.`,
      };
    }

    // 3. Generate Nama File Unik dan Aman
    const ext = path.extname(file.name).toLowerCase() || ".png";
    const cleanBase = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .substring(0, 30);
    const uniqueFileName = `${cleanBase}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
    const destinationPath = path.join(UPLOAD_DIR, uniqueFileName);

    // 4. Tulis File ke Disk Lokal
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(destinationPath, buffer);

    const publicPath = `/uploads/${uniqueFileName}`;
    return {
      success: true,
      filePath: publicPath,
    };
  } catch (err: any) {
    console.error("[Storage saveFile Error]:", err);
    return {
      success: false,
      error: `Gagal menyimpan file: ${err.message}`,
    };
  }
}

export async function deleteFile(publicPath: string): Promise<boolean> {
  try {
    if (!publicPath || !publicPath.startsWith("/uploads/")) {
      return false;
    }
    const filename = path.basename(publicPath);
    const filePath = path.join(UPLOAD_DIR, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (err) {
    console.error("[Storage deleteFile Error]:", err);
    return false;
  }
}
