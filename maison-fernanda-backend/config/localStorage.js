const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const categoriesDir = {
  products: path.join(uploadDir, 'products'),
  hero: path.join(uploadDir, 'hero'),
  editorial: path.join(uploadDir, 'editorial'),
  categories: path.join(uploadDir, 'categories'),
  gallery: path.join(uploadDir, 'gallery'),
  thumbnails: path.join(uploadDir, 'thumbnails')
};

// Create directories if they don't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

Object.values(categoriesDir).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for local storage
const createLocalStorage = (category) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, categoriesDir[category] || categoriesDir.gallery);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, `${category}-${uniqueSuffix}${ext}`);
    }
  });
};

// Function to create uploader for local storage
const createLocalUploader = (storageType) => {
  return multer({
    storage: createLocalStorage(storageType),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
      files: 10 // maximum 10 files per request
    },
    fileFilter: (req, file, cb) => {
      // Verify file type
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos de imagen'), false);
      }
    }
  });
};

// Local uploaders for different categories
const localUploaders = {
  products: createLocalUploader('products'),
  hero: createLocalUploader('hero'),
  editorial: createLocalUploader('editorial'),
  categories: createLocalUploader('categories'),
  gallery: createLocalUploader('gallery'),
  thumbnails: createLocalUploader('thumbnails')
};

// Function to delete local image
const deleteLocalImage = async (filename, category = 'gallery') => {
  try {
    const filePath = path.join(categoriesDir[category] || categoriesDir.gallery, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true };
    }
    return { success: false, message: 'File not found' };
  } catch (error) {
    console.error('Error deleting local image:', error);
    throw error;
  }
};

// Get image dimensions using image-size package (optional)
const getImageInfo = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    // For now, return basic info. You can add image-size package for dimensions
    return {
      size: stats.size,
      // If you install image-size: const sizeOf = require('image-size'); const dimensions = sizeOf(filePath);
      width: 0, // Placeholder
      height: 0, // Placeholder
      format: path.extname(filePath).substring(1)
    };
  } catch (error) {
    console.error('Error getting image info:', error);
    return null;
  }
};

module.exports = {
  localUploaders,
  deleteLocalImage,
  uploadDir,
  categoriesDir,
  getImageInfo
};

