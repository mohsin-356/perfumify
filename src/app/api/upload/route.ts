import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import sharp from 'sharp';

export const runtime = 'nodejs'; // ensures Node.js (not edge) for Cloudinary

export async function POST(req: NextRequest) {
    const contentType = req.headers.get('content-type') ?? '';

    try {
        // multipart/form-data (file upload from form)
        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file = formData.get('file');

            if (!(file instanceof Blob)) {
                return NextResponse.json(
                    { error: 'Missing or invalid file field' },
                    { status: 400 },
                );
            }

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const optimized = await sharp(buffer)
                .rotate()
                .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
                .toFormat('webp', { quality: 85 })
                .toBuffer();

            const result = await uploadImage(optimized);

            return NextResponse.json(
                {
                    url: result.secure_url,
                    public_id: result.public_id,
                    width: result.width,
                    height: result.height,
                    secure_url: result.secure_url,
                },
                { status: 200 },
            );
        }

        // JSON with base64 or remote URL
        const body = await req.json().catch(() => null);
        if (!body || !body.file) {
            return NextResponse.json(
                { error: 'Missing file in body (base64 or URL)' },
                { status: 400 },
            );
        }

        const { file, ...options } = body;

        let result;
        if (typeof file === 'string' && file.startsWith('data:')) {
            const match = file.match(/^data:(.+);base64,(.*)$/);
            if (!match) {
                return NextResponse.json(
                    { error: 'Invalid data URI' },
                    { status: 400 },
                );
            }
            const base64Data = match[2];
            const inputBuffer = Buffer.from(base64Data, 'base64');
            const optimized = await sharp(inputBuffer)
                .rotate()
                .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
                .toFormat('webp', { quality: 85 })
                .toBuffer();
            result = await uploadImage(optimized, options);
        } else {
            result = await uploadImage(file, options);
        }

        return NextResponse.json(
            {
                url: result.secure_url,
                public_id: result.public_id,
                width: result.width,
                height: result.height,
                secure_url: result.secure_url,
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.error('Cloudinary upload error', error);
        return NextResponse.json(
            { error: 'Upload failed', details: error?.message },
            { status: 500 },
        );
    }
}
