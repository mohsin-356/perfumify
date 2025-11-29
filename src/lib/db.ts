import mongoose from 'mongoose';
import { env } from './env';

declare global {
    // eslint-disable-next-line no-var
    var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

export async function connectDB(): Promise<typeof mongoose> {
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
        global._mongooseConnection = mongoose.connect(env.MONGODB_URI, {
            autoIndex: true,
        }).catch((err) => {
            console.error("MongoDB connection failed:", err?.message);
            if (process.env.NODE_ENV !== "production") {
                console.warn("⚠️  Continuing without DB (dev mode). APIs will return empty arrays.");
                // resolve with existing mongoose object so callers can still use lean()/etc. safely
                return mongoose;
            }
            // rethrow in production
            throw err;
        });
    }

    return global._mongooseConnection;
}
