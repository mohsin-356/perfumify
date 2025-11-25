import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const logoPath = path.join(process.cwd(), 'src', 'slider_images', 'logo.jpg');
    if (!fs.existsSync(logoPath)) {
      res.status(404).end('Not Found');
      return;
    }
    const file = fs.readFileSync(logoPath);
    // Serve as jpeg favicon (browsers accept PNG/JPEG for rel="icon")
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.status(200).send(file);
  } catch (e) {
    res.status(500).end('Error');
  }
}
