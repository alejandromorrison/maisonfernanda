const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const { protect, admin } = require('../middleware/auth');
const { uploaders, deleteImage, getOptimizedUrl, generateMultipleSizes } = require('../config/cloudinary');
const { localUploaders, deleteLocalImage, getImageInfo } = require('../config/localStorage');

// @route   GET /api/images
// @desc    Get all images with filters and pagination
// @access  Admin only
router.get('/', protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Category filter
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Search filter
    if (req.query.search) {
      query.$or = [
        { originalName: { $regex: req.query.search, $options: 'i' } },
        { alt: { $regex: req.query.search, $options: 'i' } },
        { caption: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Active filter
    if (req.query.active !== undefined) {
      query.isActive = req.query.active === 'true';
    }

    // Unused filter
    if (req.query.unused === 'true') {
      query.usage = { $size: 0 };
    }

    const images = await Image.find(query)
      .populate('uploadedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Image.countDocuments(query);

    res.json({
      success: true,
      data: {
        images,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Error al obtener imágenes' });
  }
});

// @route   GET /api/images/categories
// @desc    Get images by category
// @access  Admin only
router.get('/categories', protect, admin, async (req, res) => {
  try {
    const categories = await Image.distinct('category');
    const categoryStats = {};

    for (const category of categories) {
      const count = await Image.countDocuments({ category, isActive: true });
      categoryStats[category] = count;
    }

    res.json({
      success: true,
      data: {
        categories,
        stats: categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error al obtener categorías' });
  }
});

// @route   POST /api/images/upload
// @desc    Upload single or multiple images
// @access  Admin only
router.post('/upload', protect, admin, async (req, res) => {
  try {
    const { category = 'gallery', alt = '', caption = '', tags = [] } = req.body;
    
    // Check if Cloudinary is configured
    const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && 
                          process.env.CLOUDINARY_API_KEY && 
                          process.env.CLOUDINARY_API_SECRET;
    
    // Determine the uploader based on configuration
    const uploader = useCloudinary 
      ? (uploaders[category] || uploaders.gallery)
      : (localUploaders[category] || localUploaders.gallery);
    
    uploader.array('images', 10)(req, res, async (err) => {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ message: 'Error al subir imágenes: ' + err.message });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No se seleccionaron imágenes' });
      }

      const uploadedImages = [];
      const API_URL = process.env.API_URL || 'http://localhost:5000';

      for (const file of req.files) {
        try {
          let imageData;
          
          if (useCloudinary) {
            // Cloudinary upload
            imageData = {
              filename: file.filename,
              originalName: file.originalname,
              url: file.path,
              cloudinaryId: file.public_id,
              alt: alt || file.originalname,
              caption: caption || '',
              category: category,
              tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
              size: file.size,
              width: file.width,
              height: file.height,
              format: file.format,
              uploadedBy: req.user.id,
              storageType: 'cloudinary'
            };
          } else {
            // Local storage upload
            const imageInfo = getImageInfo(file.path);
            imageData = {
              filename: file.filename,
              originalName: file.originalname,
              url: `${API_URL}/uploads/${category}/${file.filename}`,
              cloudinaryId: null,
              alt: alt || file.originalname,
              caption: caption || '',
              category: category,
              tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
              size: file.size,
              width: imageInfo?.width || 0,
              height: imageInfo?.height || 0,
              format: imageInfo?.format || 'jpg',
              uploadedBy: req.user.id,
              storageType: 'local'
            };
          }

          const image = new Image(imageData);
          await image.save();
          uploadedImages.push(image);
        } catch (error) {
          console.error('Error saving image:', error);
          // If there's an error, delete the uploaded file
          if (useCloudinary && file.public_id) {
            try {
              await deleteImage(file.public_id);
            } catch (deleteError) {
              console.error('Error deleting from Cloudinary:', deleteError);
            }
          } else if (!useCloudinary && file.filename) {
            try {
              await deleteLocalImage(file.filename, category);
            } catch (deleteError) {
              console.error('Error deleting local file:', deleteError);
            }
          }
        }
      }

      res.json({
        success: true,
        message: `${uploadedImages.length} imagen(es) subida(s) exitosamente`,
        data: uploadedImages
      });
    });
  } catch (error) {
    console.error('Error in upload route:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// @route   PUT /api/images/:id
// @desc    Update image metadata
// @access  Admin only
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { alt, caption, tags, isActive } = req.body;
    
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    // Actualizar campos
    if (alt !== undefined) image.alt = alt;
    if (caption !== undefined) image.caption = caption;
    if (tags !== undefined) image.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    if (isActive !== undefined) image.isActive = isActive;

    await image.save();

    res.json({
      success: true,
      message: 'Imagen actualizada exitosamente',
      data: image
    });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({ message: 'Error al actualizar imagen' });
  }
});

// @route   DELETE /api/images/:id
// @desc    Delete image
// @access  Admin only
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    // Delete from storage (Cloudinary or local)
    if (image.cloudinaryId) {
      // Delete from Cloudinary
      try {
        await deleteImage(image.cloudinaryId);
      } catch (deleteError) {
        console.error('Error deleting from Cloudinary:', deleteError);
        // Continue with database deletion even if Cloudinary fails
      }
    } else if (image.filename) {
      // Delete from local storage
      try {
        await deleteLocalImage(image.filename, image.category);
      } catch (deleteError) {
        console.error('Error deleting local file:', deleteError);
        // Continue with database deletion even if local deletion fails
      }
    }

    await Image.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Error al eliminar imagen' });
  }
});

// @route   GET /api/images/:id
// @desc    Get single image
// @access  Admin only
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const image = await Image.findById(req.params.id)
      .populate('uploadedBy', 'firstName lastName email');
    
    if (!image) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    res.json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ message: 'Error al obtener imagen' });
  }
});

module.exports = router;






