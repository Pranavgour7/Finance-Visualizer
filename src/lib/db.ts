import mongoose from 'mongoose';

// Use 127.0.0.1 explicitly instead of localhost to avoid IPv6 resolution issues
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finance-visualizer';

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000, // Reduce timeout for faster feedback
      family: 4, // Force IPv4
    };

    console.log('Connecting to MongoDB...', MONGODB_URI.replace(/mongodb:\/\/.*@/, 'mongodb://****@'));
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        cached.promise = null; // Reset the promise on error
        throw error;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect; 