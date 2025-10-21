import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Image {
  _id: string;
  filename: string;
  originalName: string;
  url: string;
  cloudinaryId: string;
  alt: string;
  caption: string;
  category: string;
  tags: string[];
  size: number;
  width: number;
  height: number;
  format: string;
  uploadedBy: {
    firstName: string;
    lastName: string;
  };
  isActive: boolean;
  usage: any[];
  createdAt: string;
}

interface ImageManagerProps {
  onImageSelect?: (image: Image) => void;
  selectedImages?: Image[];
  multiple?: boolean;
  category?: string;
}

const ImageManager: React.FC<ImageManagerProps> = ({
  onImageSelect,
  selectedImages = [],
  multiple = false,
  category = 'gallery'
}) => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    alt: '',
    caption: '',
    tags: '',
    category: selectedCategory
  });
  const [stats, setStats] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchImages();
    fetchStats();
  }, [selectedCategory, searchTerm]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`${API_URL}/api/images?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setImages(response.data.data.images);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Error al cargar imágenes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/images/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });
    
    formData.append('category', uploadData.category);
    formData.append('alt', uploadData.alt);
    formData.append('caption', uploadData.caption);
    formData.append('tags', uploadData.tags);

    try {
      const response = await axios.post(`${API_URL}/api/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success(response.data.message);
      setShowUploadModal(false);
      setUploadData({ alt: '', caption: '', tags: '', category: selectedCategory });
      fetchImages();
      fetchStats();
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(error.response?.data?.message || 'Error al subir imágenes');
    } finally {
      setUploading(false);
    }
  };

  const handleImageSelect = (image: Image) => {
    if (onImageSelect) {
      if (multiple) {
        const isSelected = selectedImages.some(img => img._id === image._id);
        if (isSelected) {
          onImageSelect(image); // Para deseleccionar
        } else {
          onImageSelect(image); // Para seleccionar
        }
      } else {
        onImageSelect(image);
      }
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta imagen?')) return;

    try {
      await axios.delete(`${API_URL}/api/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Imagen eliminada exitosamente');
      fetchImages();
      fetchStats();
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar imagen');
    }
  };

  const handleUpdateImage = async (imageId: string, updates: Partial<Image>) => {
    try {
      await axios.put(`${API_URL}/api/images/${imageId}`, updates, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Imagen actualizada exitosamente');
      fetchImages();
    } catch (error: any) {
      console.error('Error updating image:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar imagen');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const categories = [
    { value: 'products', label: 'Productos', color: 'bg-blue-100 text-blue-800' },
    { value: 'hero', label: 'Hero', color: 'bg-purple-100 text-purple-800' },
    { value: 'editorial', label: 'Editorial', color: 'bg-green-100 text-green-800' },
    { value: 'categories', label: 'Categorías', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'gallery', label: 'Galería', color: 'bg-gray-100 text-gray-800' },
    { value: 'thumbnails', label: 'Miniaturas', color: 'bg-pink-100 text-pink-800' }
  ];

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="heading-md">Gestión de Imágenes</h2>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            📤 Subir Imágenes
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-playfair text-deep-taupe">{stats.total}</p>
              <p className="text-sm text-deep-taupe/60">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-playfair text-green-600">{stats.active}</p>
              <p className="text-sm text-deep-taupe/60">Activas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-playfair text-orange-600">{stats.unused}</p>
              <p className="text-sm text-deep-taupe/60">Sin usar</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-playfair text-blue-600">{formatFileSize(stats.totalSize)}</p>
              <p className="text-sm text-deep-taupe/60">Tamaño total</p>
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 border border-warm-taupe/20">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Buscar imágenes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field min-w-48"
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Galería de imágenes */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image) => {
            const isSelected = selectedImages.some(img => img._id === image._id);
            return (
              <div
                key={image._id}
                className={`relative group border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  isSelected ? 'border-deep-taupe bg-deep-taupe/5' : 'border-warm-taupe/20 hover:border-deep-taupe/40'
                }`}
                onClick={() => handleImageSelect(image)}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-32 object-cover"
                />
                
                {/* Overlay con información */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="text-white text-center p-2">
                    <p className="text-xs font-medium truncate">{image.originalName}</p>
                    <p className="text-xs opacity-80">{image.width}x{image.height}</p>
                    <p className="text-xs opacity-80">{formatFileSize(image.size)}</p>
                  </div>
                </div>

                {/* Indicador de selección */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-deep-taupe text-white rounded-full flex items-center justify-center text-sm">
                    ✓
                  </div>
                )}

                {/* Categoría */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    categories.find(c => c.value === image.category)?.color || 'bg-gray-100 text-gray-800'
                  }`}>
                    {categories.find(c => c.value === image.category)?.label || image.category}
                  </span>
                </div>

                {/* Botones de acción */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(image._id);
                      }}
                      className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de subida */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="heading-md">Subir Imágenes</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-deep-taupe hover:text-deep-taupe/60"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Categoría</label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    className="input-field"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Texto alternativo</label>
                  <input
                    type="text"
                    value={uploadData.alt}
                    onChange={(e) => setUploadData({ ...uploadData, alt: e.target.value })}
                    placeholder="Descripción de la imagen"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <textarea
                    value={uploadData.caption}
                    onChange={(e) => setUploadData({ ...uploadData, caption: e.target.value })}
                    placeholder="Descripción adicional"
                    className="input-field"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Etiquetas (separadas por comas)</label>
                  <input
                    type="text"
                    value={uploadData.tags}
                    onChange={(e) => setUploadData({ ...uploadData, tags: e.target.value })}
                    placeholder="moda, vestidos, elegante"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Seleccionar imágenes</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    className="input-field"
                  />
                  <p className="text-xs text-deep-taupe/60 mt-1">
                    💡 Puedes usar servicios como Cloudinary, ImgBB, o subir a tu servidor
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="btn-secondary"
                    disabled={uploading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-primary"
                    disabled={uploading}
                  >
                    {uploading ? '⏳ Subiendo...' : '📤 Seleccionar Archivos'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;

