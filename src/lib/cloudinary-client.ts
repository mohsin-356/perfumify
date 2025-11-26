const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export function transform(
    publicId: string,
    {
        width,
        height,
        crop = 'fill',
        blur,
        quality = 'auto',
        format = 'auto',
    }: {
        width?: number;
        height?: number;
        crop?: 'fill' | 'fit' | 'thumb' | 'scale' | 'crop';
        blur?: number;
        quality?: string | number;
        format?: string;
    },
): string {
    if (!cloudName) return '';

    const transformations: string[] = [];

    if (crop) transformations.push(`c_${crop}`);
    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (quality) transformations.push(`q_${quality}`);
    if (format) transformations.push(`f_${format}`);
    if (blur) transformations.push(`e_blur:${blur}`);

    const transString = transformations.join(',');

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transString}/${publicId}`;
}

export function generateProductOgImageUrl(params: {
    productTitle: string;
    price: number;
    productImagePublicId: string;
}) {
    const { productTitle, price, productImagePublicId } = params;
    if (!cloudName) return '';

    const titleEncoded = encodeURIComponent(productTitle);
    const priceText = encodeURIComponent(`$${price.toFixed(2)}`);
    const baseTemplatePublicId = 'og-templates/perfumify-product-bg';

    // Manual URL construction for complex OG image
    // Format: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<public_id>

    // Transformations are applied in order.
    // 1. Base canvas
    const baseTrans = `c_fill,h_630,q_auto,w_1200,f_auto`;

    // 2. Product Image Overlay
    // l_<public_id>,c_fill,h_600,w_600,g_west,x_50
    // Note: public_id for overlay might need encoding if it has special chars, but usually simple IDs are fine.
    // Slashes in public_id for overlay need to be replaced with colon or encoded? 
    // Cloudinary URL syntax: l_<public_id>
    const prodImgTrans = `l_${productImagePublicId.replace(/\//g, ':')},c_fill,h_600,w_600,g_west,x_50`;

    // 3. Title Text Overlay
    // co_rgb:ffffff,l_text:Poppins_60_bold:<text>,g_north_east,x_80,y_80
    const titleTrans = `co_rgb:ffffff,l_text:Poppins_60_bold:${titleEncoded},g_north_east,x_80,y_80`;

    // 4. Price Text Overlay
    // co_rgb:ffd700,l_text:Poppins_48_semibold:<text>,g_south_east,x_80,y_80
    const priceTrans = `co_rgb:ffd700,l_text:Poppins_48_semibold:${priceText},g_south_east,x_80,y_80`;

    const fullTrans = [baseTrans, prodImgTrans, titleTrans, priceTrans].join('/');

    return `https://res.cloudinary.com/${cloudName}/image/upload/${fullTrans}/${baseTemplatePublicId}`;
}
