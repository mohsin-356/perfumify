import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '../../../../lib/mongodb';
import { Product } from '../../../../models/Product';

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const { id } = query;
  await dbConnect();

  switch (method) {
    case 'GET': {
      try {
        const product = await Product.findById(id as string).lean();
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.status(200).json({ success: true, data: product });
      } catch (error) {
        return res.status(500).json({ success: false, message: 'Error reading product' });
      }
    }
    case 'PUT': {
      try {
        const updated = req.body;
        const updateDoc: any = {
          name: updated.name,
          description: updated.description || '',
          short_description: updated.short_description || '',
          slug: generateSlug(updated.name),
          brand: updated.brand,
          sku: updated.sku,
          price: updated.price ? parseFloat(updated.price) : undefined,
          sale_price: updated.sale_price ? parseFloat(updated.sale_price) : null,
          category: updated.category,
          quantity: updated.stock ? parseInt(updated.stock) : undefined,
          weight: updated.weight,
          dimensions: updated.dimensions,
          status: updated.status,
          featured: !!updated.featured,
          meta_title: updated.meta_title || updated.name,
          meta_description: updated.meta_description || updated.description,
          tags: updated.tags ? String(updated.tags).split(',').map((t: string) => t.trim()) : undefined,
          updated_at: new Date(),
        };
        if (updated.images && Array.isArray(updated.images) && updated.images.length) {
          const gallery = updated.images.map((url: string, idx: number) => ({ id: idx + 1, thumbnail: url, original: url }));
          updateDoc.image = gallery[0];
          updateDoc.gallery = gallery;
        } else if (updated.image) {
          updateDoc.image = { id: 1, thumbnail: updated.image, original: updated.image };
          updateDoc.gallery = [{ id: 1, thumbnail: updated.image, original: updated.image }];
        }

        const product = await Product.findByIdAndUpdate(id as string, updateDoc, { new: true }).lean();
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.status(200).json({ success: true, data: product });
      } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ success: false, message: 'Error updating product' });
      }
    }
    case 'DELETE': {
      try {
        const deleted = await Product.findByIdAndDelete(id as string).lean();
        if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
        return res.status(200).json({ success: true, data: deleted });
      } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ success: false, message: 'Error deleting product' });
      }
    }
    default: {
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
    }
  }
}
