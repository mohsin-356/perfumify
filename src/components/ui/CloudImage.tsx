import Image from 'next/image';
import { transform } from '@/lib/cloudinary-client';

export interface CloudImageProps {
    publicId: string;
    alt: string;
    width: number;
    height: number;
    sizes?: string;
    className?: string;
    crop?: 'fill' | 'fit' | 'thumb' | 'scale' | 'crop';
}

// Server component (no hooks)
const CloudImage = ({
    publicId,
    alt,
    width,
    height,
    sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px',
    className,
    crop = 'fill',
}: CloudImageProps) => {
    const src = transform(publicId, {
        width,
        height,
        crop,
        quality: 'auto',
        format: 'auto',
    });

    const blurDataURL = transform(publicId, {
        width: 20,
        height: 20,
        crop,
        blur: 200,
        quality: 'auto',
        format: 'auto',
    });

    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            className={className}
            placeholder="blur"
            blurDataURL={blurDataURL}
            loading="lazy"
        />
    );
};

export default CloudImage;
