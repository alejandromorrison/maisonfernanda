const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Don't exit in serverless environment
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error; // Re-throw to be caught by caller
  }
};

module.exports = connectDB;

