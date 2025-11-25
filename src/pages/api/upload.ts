import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File as FormidableFile, Files, Fields } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: { bodyParser: false },
};

function ensureUploadsDir() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const uploadDir = ensureUploadsDir();

    const form = formidable({ multiples: true, keepExtensions: true });

    const { files } = await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
      form.parse(req, (err: any, fields: Fields, files: Files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const fileArray: FormidableFile[] = [];
    if (Array.isArray(files.file)) fileArray.push(...files.file);
    else if (files.file) fileArray.push(files.file as FormidableFile);
    else {
      // also support "images" as field name
      if (Array.isArray(files.images)) fileArray.push(...files.images);
      else if (files.images) fileArray.push(files.images as FormidableFile);
    }

    const urls: string[] = [];

    for (const file of fileArray) {
      const f = file as FormidableFile & { originalFilename?: string; filepath?: string; newFilename?: string };
      const ext = path.extname(f.originalFilename || f.newFilename || '') || path.extname((f as any).filepath || '');
      const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext || '.jpg'}`;
      const destPath = path.join(uploadDir, filename);
      const tmpPath = (f as any).filepath as string;
      fs.copyFileSync(tmpPath, destPath);
      urls.push(`/uploads/${filename}`);
    }

    return res.status(200).json({ success: true, urls });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
}
