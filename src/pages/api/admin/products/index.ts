import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import { simpleCache } from '../../../../lib/simpleCache';

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  try {
    await dbConnect();
  } catch (e: any) {
    return res.status(500).json({ success: false, message: e?.message || 'Database connection failed' });
  }

  switch (method) {
    case 'GET': {
      try {
        const page = Math.max(parseInt(String(req.query.page || '1'), 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(String(req.query.limit || '20'), 10) || 20, 1), 100);
        const search = String(req.query.search || '').trim();
        const status = String(req.query.status || 'all');

        const query: any = {};
        if (status && status !== 'all') query.status = status;
        if (search) {
          const r = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
          query.$or = [{ name: r }, { brand: r }, { sku: r }];
        }

        const projection = 'name brand price sale_price quantity status image created_at';

        const cacheKey = `admin:products:${page}:${limit}:${status}:${search}`;
        const cached = simpleCache.get<{ items: any[]; total: number }>(cacheKey);
        let items: any[];
        let total: number;
        if (cached) {
          ({ items, total } = cached);
          res.setHeader('X-Cache', 'HIT');
        } else {
          [items, total] = await Promise.all([
            Product.find(query, projection).sort({ created_at: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Product.countDocuments(query),
          ]);
          // Short TTL for admin listing (15s)
          simpleCache.set(cacheKey, { items, total }, 15_000);
          res.setHeader('X-Cache', 'MISS');
        }
        const hasNextPage = page * limit < total;
        return res.status(200).json({
          success: true,
          data: items,
          paginatorInfo: {
            currentPage: page,
            total,
            hasNextPage,
            nextPageUrl: hasNextPage ? `page=${page + 1}` : '',
          },
        });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Error reading products' });
      }
    }
    case 'POST': {
      try {
        const newProduct = req.body;
        const baseSlug = generateSlug(newProduct.name);
        let slug = baseSlug;
        // Ensure unique slug
        let i = 1;
        // eslint-disable-next-line no-constant-condition
        while (await Product.exists({ slug })) {
          slug = `${baseSlug}-${i++}`;
        }

        const now = new Date();
        const imageUrls: string[] = Array.isArray(newProduct.images)
          ? newProduct.images
          : newProduct.image
          ? [newProduct.image]
          : [];

        const primary = imageUrls[0] || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=85';
        const gallery = imageUrls.map((url: string, idx: number) => ({ id: idx + 1, thumbnail: url, original: url }));

        const created = await Product.create({
          name: newProduct.name,
          description: newProduct.description || '',
          short_description: newProduct.short_description || '',
          slug,
          brand: newProduct.brand,
          sku: newProduct.sku || undefined,
          image: { id: 1, thumbnail: primary, original: primary },
          gallery,
          price: Number.parseFloat(newProduct.price) || 0,
          sale_price: newProduct.sale_price ? Number.parseFloat(newProduct.sale_price) : null,
          category: newProduct.category || 'perfume',
          quantity: Number.parseInt(newProduct.stock) || 0,
          weight: newProduct.weight || '',
          dimensions: newProduct.dimensions || '',
          status: newProduct.status || 'active',
          featured: !!newProduct.featured,
          meta_title: newProduct.meta_title || newProduct.name,
          meta_description: newProduct.meta_description || newProduct.description,
          tags: newProduct.tags ? String(newProduct.tags).split(',').map((t: string) => t.trim()) : [],
          variations: [
            {
              id: 1,
              value: newProduct.weight || '50ml',
              attribute: { id: 1, name: 'Size', slug: 'size' },
            },
          ],
          created_at: now,
          updated_at: now,
        });

        return res.status(201).json({ success: true, data: created });
      } catch (error: any) {
        const msg = error?.code === 11000 ? 'A product with this name already exists.' : (error?.message || 'Error creating product');
        return res.status(500).json({ success: false, message: msg });
      }
    }
    default: {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
