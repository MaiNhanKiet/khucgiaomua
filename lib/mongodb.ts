import mongoose from "mongoose"

// Khi deploy trên cùng Docker network/VPS:
// - Dùng service name: mongodb_container (nếu dùng Docker Compose)
// - Hoặc IP trong network: 172.20.0.2 (IP có thể thay đổi)
// - Hoặc localhost nếu chạy trên cùng host
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://kietmn:kietdeptrai123@mongodb_container:27017/khucgiaomua?authSource=admin"

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

interface MongooseCache {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

declare global {
    var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
    global.mongoose = cached
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        }

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose
        })
    }

    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

export default connectDB

