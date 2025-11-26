import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { env } from '@/lib/env';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    const adminToken = req.headers.get('x-admin-token');
    if (adminToken !== env.ADMIN_SECRET_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const { name, slug, description, price, images } = body;

    if (!name || !slug || !price || !Array.isArray(images)) {
        return NextResponse.json(
            { error: 'name, slug, price, images[] are required' },
            { status: 400 },
        );
    }

    try {
        await connectDB();
        const product = await Product.create({
            name,
            slug,
            description,
            price,
            images,
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (error: any) {
        console.error('Create product error', error);
        return NextResponse.json(
            { error: 'Failed to create product', details: error?.message },
            { status: 500 },
        );
    }
}
