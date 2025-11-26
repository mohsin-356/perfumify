import { NextRequest, NextResponse } from 'next/server';
import { deleteImage } from '@/lib/cloudinary';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

export async function DELETE(req: NextRequest) {
    const adminToken = req.headers.get('x-admin-token');
    if (adminToken !== env.ADMIN_SECRET_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const public_id = body?.public_id as string | undefined;

    if (!public_id) {
        return NextResponse.json({ error: 'public_id is required' }, { status: 400 });
    }

    try {
        const result = await deleteImage(public_id);
        return NextResponse.json({ result }, { status: 200 });
    } catch (error: any) {
        console.error('Cloudinary delete error', error);
        return NextResponse.json(
            { error: 'Delete failed', details: error?.message },
            { status: 500 },
        );
    }
}
