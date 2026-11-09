import mongoose from 'mongoose';
import { env } from './env';

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var _mongooseCache: MongooseCache | undefined;
    // eslint-disable-next-line no-var
    var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

let cached: MongooseCache = global._mongooseCache || { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
    const uri = process.env.MONGODB_URI || env.MONGODB_URI;

    if (!uri) {
        if (process.env.NODE_ENV !== "production") {
            console.warn("⚠️  MONGODB_URI not provided – skipping DB connection (dev mode).");
            return mongoose;
        }
        throw new Error("MONGODB_URI is not defined in environment variables");
    }

    // If an existing connection points to a different host than the current URI, force a reconnect
    if (mongoose.connection?.readyState === 1) {
        try {
            const match = uri.match(/@([^/]+)/);
            const expectedHost = match?.[1] || '';
            const currentHost = (mongoose.connection as any)?.host || '';
            if (expectedHost && currentHost && !currentHost.includes(expectedHost)) {
                await mongoose.disconnect();
                cached.conn = null;
                cached.promise = null;
            } else if (cached.conn) {
                return cached.conn;
            }
        } catch {}
    }

    // If readyState is 1 (connected), return existing connection
    if (mongoose.connection?.readyState === 1 && cached.conn) {
        return cached.conn;
    }

    // If no active promise or connection is disconnected (0), initiate new connection
    if (!cached.promise || mongoose.connection?.readyState === 0) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 8000,
            autoIndex: true,
        };

        cached.promise = mongoose.connect(uri, opts)
            .then((mongooseInstance) => {
                cached.conn = mongooseInstance;
                return mongooseInstance;
            })
            .catch((err) => {
                // Reset cached state on failure so subsequent requests can retry
                cached.promise = null;
                cached.conn = null;
                global._mongooseConnection = undefined;
                console.error("MongoDB connection failed:", err?.message);
                throw err;
            });

        global._mongooseConnection = cached.promise;
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        cached.conn = null;
        global._mongooseConnection = undefined;
        throw err;
    }

    return cached.conn;
}
