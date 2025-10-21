const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      console.log('MONGODB_URI not found, using mock connection');
      return { connection: { host: 'mock-host' } };
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add serverless-specific options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Create text index for search if Product model exists
    try {
      const Product = mongoose.model('Product');
      await Product.collection.createIndex({
        name: 'text',
        description: 'text',
        category: 'text'
      });
      console.log('Text index created successfully');
    } catch (indexError) {
      console.log('Text index creation skipped:', indexError.message);
    }
    
    return conn;
    
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // In serverless environment, don't crash the app
    if (process.env.VERCEL) {
      console.log('Running in serverless mode - continuing without database');
      return null;
    }
    
    // In development, exit on database error
    process.exit(1);
  }
};

module.exports = connectDB;

