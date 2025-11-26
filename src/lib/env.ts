import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),
  NEXT_PUBLIC_CLOUDINARY_API_KEY: z.string().min(1),
  NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string().min(1).default('perfume_store'),
  // Server-only
  CLOUDINARY_API_SECRET: z.string().optional(),
  MONGODB_URI: z.string().optional(),
  ADMIN_SECRET_TOKEN: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  // Only throw on server to prevent client crash if something is missing but not needed
  if (typeof window === 'undefined') {
    throw new Error('Invalid environment variables – check .env');
  }
}

export const env = parsed.success ? parsed.data : {} as z.infer<typeof envSchema>;