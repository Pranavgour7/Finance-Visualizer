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

/**
 * Custom database connection error class
 */
export class DatabaseConnectionError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

/**
 * Connects to MongoDB and returns the mongoose instance
 * Uses connection pooling and caching for serverless environments
 */
async function dbConnect() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection if none exists
  if (!cached.promise) {
    // Connection options for optimal performance and reliability
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout for cloud environments
      maxPoolSize: 10, // Optimize connection pool for serverless
      minPoolSize: 5, // Maintain minimum connections
      family: 4, // Force IPv4
    };

    // Sanitize connection string before logging (hide credentials)
    const sanitizedUri = MONGODB_URI.replace(/mongodb(\+srv)?:\/\/[^@]+@/, 'mongodb$1://****@');
    console.log('Connecting to MongoDB...', sanitizedUri);
    
    // Try to connect with error handling and detailed logging
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB successfully');
        return mongoose;
      })
      .catch((error) => {
        let errorMessage = 'Failed to connect to MongoDB.';
        
        // Add more specific error messages for common connection problems
        if (error.name === 'MongoServerSelectionError') {
          errorMessage = 'Could not connect to any MongoDB servers. Check network connectivity and server status.';
        } else if (error.message.includes('bad auth')) {
          errorMessage = 'Authentication failed. Check your username and password in the connection string.';
        } else if (error.message.includes('ENOTFOUND')) {
          errorMessage = 'MongoDB host not found. Check your connection string and network connectivity.';
        } else if (error.message.includes('ECONNREFUSED')) {
          errorMessage = 'Connection refused by MongoDB server. Ensure the server is running and accessible.';
        }
        
        console.error(errorMessage, error);
        cached.promise = null; // Reset the promise on error
        throw new DatabaseConnectionError(errorMessage, error);
      }) as Promise<typeof mongoose>;
  }
  
  // Await the connection promise
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