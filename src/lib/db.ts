import mongoose from 'mongoose';
import { env } from './env';

declare global {
    // eslint-disable-next-line no-var
    var _mongooseConnection: Promise<typeof mongoose> | undefined;
}

export async function connectDB(): Promise<typeof mongoose> {
    if (!global._mongooseConnection) {
        global._mongooseConnection = mongoose.connect(env.MONGODB_URI, {
            autoIndex: true,
        });
    }

    return global._mongooseConnection;
}
