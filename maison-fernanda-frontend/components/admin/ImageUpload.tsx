import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface ImageUploadProps {
  onImageSelect: (image: any) => void;
  selectedImage?: any;
  category?: string;
  multiple?: boolean;
  maxImages?: number;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  selectedImage,
  category = 'gallery',
  multiple = false,
  maxImages = 5,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Verificar límite de archivos
    if (multiple && fileArray.length > maxImages) {
      toast.error(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    fileArray.forEach(file => {
      formData.append('images', file);
    });
    
    formData.append('category', category);
    formData.append('alt', 'Imagen subida desde formulario');

    try {
      const response = await axios.post(`${API_URL}/api/images/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const uploadedImages = response.data.data;
      
      if (multiple) {
        onImageSelect(uploadedImages);
      } else {
        onImageSelect(uploadedImages[0]);
      }

      toast.success(`${uploadedImages.length} imagen(es) subida(s) exitosamente`);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(error.response?.data?.message || 'Error al subir imágenes');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const removeImage = (index?: number) => {
    if (multiple && typeof index === 'number') {
      const newImages = Array.isArray(selectedImage) 
        ? selectedImage.filter((_, i) => i !== index)
        : [];
      onImageSelect(newImages);
    } else {
      onImageSelect(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Área de subida */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-deep-taupe bg-deep-taupe/5' 
            : 'border-warm-taupe/30 hover:border-deep-taupe/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-2">
            <div className="spinner mx-auto"></div>
            <p className="text-sm text-deep-taupe/60">Subiendo imágenes...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl text-deep-taupe/40">📤</div>
            <p className="text-sm font-medium text-deep-taupe">
              {dragOver ? 'Suelta las imágenes aquí' : 'Arrastra imágenes aquí o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-deep-taupe/60">
              {multiple ? `Máximo ${maxImages} imágenes` : 'Una imagen'}
            </p>
            <p className="text-xs text-deep-taupe/40">
              💡 Subir a servidor local o Cloudinary (según configuración)
            </p>
          </div>
        )}
      </div>

      {/* Imágenes seleccionadas */}
      {selectedImage && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-deep-taupe">Imágenes seleccionadas:</h4>
          
          {multiple && Array.isArray(selectedImage) ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {selectedImage.map((image: any, index: number) => (
                <div key={image._id || index} className="relative group">
                  <img
                    src={image.url}
                    alt={image.alt || 'Imagen'}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b">
                    <p className="truncate">{image.originalName}</p>
                    {image.width && image.height && (
                      <p>{image.width}x{image.height} • {formatFileSize(image.size)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : !multiple && selectedImage && !Array.isArray(selectedImage) ? (
            <div className="relative group max-w-xs">
              <img
                src={selectedImage.url}
                alt={selectedImage.alt || 'Imagen'}
                className="w-full h-32 object-cover rounded border"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 rounded-b">
                <p className="truncate">{selectedImage.originalName}</p>
                {selectedImage.width && selectedImage.height && (
                  <p>{selectedImage.width}x{selectedImage.height} • {formatFileSize(selectedImage.size)}</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Información adicional */}
      <div className="text-xs text-deep-taupe/60 space-y-1">
        <p>• Formatos soportados: JPG, PNG, WebP</p>
        <p>• Tamaño máximo: 10MB por imagen</p>
        <p>• Las imágenes se optimizan automáticamente</p>
        {category !== 'gallery' && (
          <p>• Categoría: {category}</p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
