import mongoose from 'mongoose';

// Get MongoDB URI from environment variable with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/finance-visualizer';

// Global mongoose connection setup for serverless environment
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
      serverSelectionTimeoutMS: 10000, // Increased timeout for cloud environments
      maxPoolSize: 10, // Optimize connection pool for serverless
      minPoolSize: 5, // Maintain minimum connections
      family: 4, // Force IPv4
    };

    // Sanitize connection string before logging
    const sanitizedUri = MONGODB_URI.replace(/mongodb(\+srv)?:\/\/[^@]+@/, 'mongodb$1://****@');
    console.log('Connecting to MongoDB...', sanitizedUri);
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        cached.promise = null; // Reset the promise on error
        throw error;
      }) as Promise<typeof mongoose>;
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Failed to resolve MongoDB connection:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect; 