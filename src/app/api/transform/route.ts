import { NextRequest, NextResponse } from 'next/server';
import { transform } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get('public_id');

    if (!publicId) {
        return NextResponse.json({ error: 'public_id is required' }, { status: 400 });
    }

    const width = searchParams.get('w');
    const height = searchParams.get('h');
    const crop = searchParams.get('crop') ?? 'fill';
    const blur = searchParams.get('blur');
    const quality = searchParams.get('q') ?? 'auto';

    const url = transform(publicId, {
        width: width ? Number(width) : undefined,
        height: height ? Number(height) : undefined,
        crop: crop as any,
        blur: blur ? Number(blur) : undefined,
        quality,
        format: 'auto',
    });

    return NextResponse.json({ url }, { status: 200 });
}
