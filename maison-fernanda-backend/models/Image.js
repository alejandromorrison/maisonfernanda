const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  cloudinaryId: {
    type: String,
    required: false,
    default: null
  },
  storageType: {
    type: String,
    enum: ['cloudinary', 'local'],
    default: 'cloudinary'
  },
  alt: {
    type: String,
    default: ''
  },
  caption: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['products', 'hero', 'editorial', 'categories', 'gallery', 'thumbnails', 'other'],
    default: 'other'
  },
  tags: [{
    type: String
  }],
  size: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usage: [{
    type: {
      type: String,
      enum: ['products', 'hero', 'editorial', 'categories', 'gallery']
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId
    },
    referenceType: {
      type: String
    }
  }]
}, {
  timestamps: true
});

// Índices para búsqueda eficiente
imageSchema.index({ category: 1 });
imageSchema.index({ tags: 1 });
imageSchema.index({ uploadedBy: 1 });
imageSchema.index({ isActive: 1 });
imageSchema.index({ createdAt: -1 });

// Método para obtener estadísticas de uso
imageSchema.methods.getUsageStats = function() {
  return {
    totalUsage: this.usage.length,
    categories: [...new Set(this.usage.map(u => u.type))],
    lastUsed: this.usage.length > 0 ? Math.max(...this.usage.map(u => new Date(u.createdAt).getTime())) : null
  };
};

// Método estático para buscar imágenes por categoría
imageSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ createdAt: -1 });
};

// Método estático para buscar imágenes no utilizadas
imageSchema.statics.findUnused = function() {
  return this.find({ usage: { $size: 0 }, isActive: true }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Image', imageSchema);

