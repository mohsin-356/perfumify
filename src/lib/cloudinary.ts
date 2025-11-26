import { v2 as cloudinary, UploadApiOptions, TransformationOptions } from 'cloudinary';
import { env } from './env';

cloudinary.config({
    cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
});

export type CloudinaryUploadResult = typeof cloudinary.uploader.upload extends (
    file: any,
    options?: any
) => Promise<infer R>
    ? R
    : never;

const defaultUploadOptions: UploadApiOptions = {
    upload_preset: env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    folder: 'perfumify',
    // automatic quality + format
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
};

export async function uploadImage(
    file: string | Buffer,
    options: UploadApiOptions = {},
): Promise<CloudinaryUploadResult> {
    const finalOptions: UploadApiOptions = {
        ...defaultUploadOptions,
        ...options,
    };

    if (Buffer.isBuffer(file)) {
        // Buffer upload via upload_stream
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(finalOptions, (err, result) => {
                if (err || !result) return reject(err);
                resolve(result);
            });

            stream.end(file);
        });
    }

    // base64 or remote URL
    return cloudinary.uploader.upload(file, finalOptions);
}

export async function deleteImage(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
}

export function generateUrl(publicId: string, options: Record<string, any> = {}): string {
    return cloudinary.url(publicId, {
        secure: true,
        quality: 'auto',
        fetch_format: 'auto',
        ...options,
    });
}

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
    const transformation: TransformationOptions[] = [
        {
            width,
            height,
            crop,
            quality,
            fetch_format: format,
        },
    ];

    if (blur) {
        transformation.push({ effect: `blur:${blur}` });
    }

    return cloudinary.url(publicId, {
        secure: true,
        transformation,
    });
}

// Example OG image generator
export function generateProductOgImageUrl(params: {
    productTitle: string;
    price: number;
    productImagePublicId: string;
}) {
    const { productTitle, price, productImagePublicId } = params;

    const titleEncoded = encodeURIComponent(productTitle);
    const priceText = encodeURIComponent(`$${price.toFixed(2)}`);

    const baseTemplatePublicId = 'og-templates/perfumify-product-bg'; // create this in Cloudinary

    return cloudinary.url(baseTemplatePublicId, {
        secure: true,
        transformation: [
            {
                width: 1200,
                height: 630,
                crop: 'fill',
                quality: 'auto',
                fetch_format: 'auto',
            },
            // Product image on the left
            {
                overlay: productImagePublicId,
                width: 600,
                height: 600,
                crop: 'fill',
                gravity: 'west',
                x: 50,
            },
            // Title text on the right
            {
                overlay: {
                    font_family: 'Poppins',
                    font_size: 60,
                    font_weight: 'bold',
                    text: titleEncoded,
                },
                color: '#ffffff',
                gravity: 'north_east',
                x: 80,
                y: 80,
            },
            // Price text
            {
                overlay: {
                    font_family: 'Poppins',
                    font_size: 48,
                    font_weight: 'semibold',
                    text: priceText,
                },
                color: '#ffd700',
                gravity: 'south_east',
                x: 80,
                y: 80,
            },
        ],
    });
}

export { cloudinary };
