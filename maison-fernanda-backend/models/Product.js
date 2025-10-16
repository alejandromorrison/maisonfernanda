const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  compareAtPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['dresses', 'tops', 'bottoms', 'outerwear', 'accessories', 'shoes', 'bags']
  },
  subcategory: {
    type: String
  },
  images: [{
    url: String,
    alt: String
  }],
  sizes: [{
    size: {
      type: String,
      enum: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    inStock: {
      type: Boolean,
      default: true
    },
    quantity: {
      type: Number,
      default: 0
    }
  }],
  colors: [{
    name: String,
    hex: String
  }],
  materials: [String],
  careInstructions: String,
  featured: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  tags: [String],
  details: [String],
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);

