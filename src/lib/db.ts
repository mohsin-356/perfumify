import mongoose from 'mongoose';
import { env } from './env';

declare global {
    // eslint-disable-next-line no-var
    var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

export async function connectDB(): Promise<typeof mongoose> {
    // If an existing connection points to a different host than the current URI, force a reconnect
    const uriFromEnv = env.MONGODB_URI;
    if (mongoose.connection?.readyState === 1 && uriFromEnv) {
        try {
            const match = uriFromEnv.match(/@([^/]+)/); // extract host between @ and /
            const expectedHost = match?.[1] || '';
            const currentHost = (mongoose.connection as any)?.host || '';
            if (expectedHost && currentHost && !currentHost.includes(expectedHost)) {
                await mongoose.disconnect();
                global._mongooseConnection = undefined;
            }
        } catch {}
    }

    if (!global._mongooseConnection) {
        if (!env.MONGODB_URI) {
            if (process.env.NODE_ENV !== "production") {
                console.warn("⚠️  MONGODB_URI not provided – skipping DB connection and returning dummy connection (dev mode). API routes will return empty collections.");
                // @ts-ignore
                global._mongooseConnection = Promise.resolve(mongoose);
                return global._mongooseConnection;
            }
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const uri = env.MONGODB_URI;
        global._mongooseConnection = mongoose.connect(uri, {
            autoIndex: true,
        }).catch((err) => {
            console.error("MongoDB connection failed:", err?.message);
            // If a URI is provided but connection fails, do NOT silently continue.
            // This helps catch Atlas/network/whitelist issues immediately.
            throw err;
        });
    }

    return global._mongooseConnection;
}
