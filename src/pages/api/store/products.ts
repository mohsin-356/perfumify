import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../../lib/mongodb';
import { simpleCache } from '../../../lib/simpleCache';
import { Product } from '../../../models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }
  try {
    await dbConnect();
    const page = Math.max(parseInt(String(req.query.page || '1'), 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(String(req.query.limit || '10'), 10) || 10, 1), 100);

    const query = { status: { $ne: 'inactive' } } as any;

    // Note: Advanced filters (category/brand/price/sort_by) can be added later.

    const projection = 'name brand price sale_price image gallery category quantity status created_at description short_description tags';

    const cacheKey = `store:products:${page}:${limit}`;
    const cached = simpleCache.get<{ items: any[]; total: number }>(cacheKey);
    let items: any[];
    let total: number;
    if (cached) {
      items = cached.items;
      total = cached.total;
      res.setHeader('X-Cache', 'HIT');
    } else {
      [items, total] = await Promise.all([
        Product.find(query, projection)
          .sort({ created_at: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Product.countDocuments(query),
      ]);
      simpleCache.set(cacheKey, { items, total }, 30_000);
      res.setHeader('X-Cache', 'MISS');
    }

    const hasNextPage = page * limit < total;

    res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=300');
    return res.status(200).json({
      data: items,
      paginatorInfo: {
        nextPageUrl: hasNextPage ? `page=${page + 1}` : '',
        hasNextPage,
        currentPage: page,
        total,
      },
    });
  } catch (e) {
    return res.status(500).json({ data: [], paginatorInfo: { nextPageUrl: '', hasNextPage: false, currentPage: 1, total: 0 } });
  }
}
