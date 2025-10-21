import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  product?: any;
  onSave: (productData: any) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: 'dresses',
    images: [{ url: '', alt: '' }],
    sizes: [
      { size: 'XS', inStock: true, quantity: 0 },
      { size: 'S', inStock: true, quantity: 0 },
      { size: 'M', inStock: true, quantity: 0 },
      { size: 'L', inStock: true, quantity: 0 },
      { size: 'XL', inStock: true, quantity: 0 }
    ],
    colors: [{ name: '', hex: '#000000' }],
    materials: [''],
    careInstructions: '',
    details: [''],
    featured: false,
    newArrival: false,
    bestseller: false,
    inStock: true,
    tags: [''],
    // RENTAL FIELDS
    availableForRental: false,
    rentalPriceDaily: '',
    rentalPriceWeekly: '',
    rentalPriceMonthly: '',
    rentalDeposit: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        compareAtPrice: product.compareAtPrice?.toString() || '',
        category: product.category || 'dresses',
        images: product.images?.length > 0 ? product.images : [{ url: '', alt: '' }],
        sizes: product.sizes?.length > 0 ? product.sizes : formData.sizes,
        colors: product.colors?.length > 0 ? product.colors : [{ name: '', hex: '#000000' }],
        materials: product.materials?.length > 0 ? product.materials : [''],
        careInstructions: product.careInstructions || '',
        details: product.details?.length > 0 ? product.details : [''],
        featured: product.featured || false,
        newArrival: product.newArrival || false,
        bestseller: product.bestseller || false,
        inStock: product.inStock !== undefined ? product.inStock : true,
        tags: product.tags?.length > 0 ? product.tags : [''],
        // RENTAL FIELDS
        availableForRental: product.availableForRental || false,
        rentalPriceDaily: product.rentalPrice?.daily?.toString() || '',
        rentalPriceWeekly: product.rentalPrice?.weekly?.toString() || '',
        rentalPriceMonthly: product.rentalPrice?.monthly?.toString() || '',
        rentalDeposit: product.rentalDeposit?.toString() || ''
      });
    }
  }, [product]);

  // Generate slug from product name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación
    if (!formData.name || !formData.description || !formData.price) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    // Limpiar arrays vacíos y procesar datos de alquiler
    const cleanedData = {
      ...formData,
      price: parseFloat(formData.price),
      compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
      images: formData.images.filter(img => img.url),
      materials: formData.materials.filter(m => m),
      details: formData.details.filter(d => d),
      colors: formData.colors.filter(c => c.name),
      tags: formData.tags.filter(t => t),
      // Generate slug from name if creating a new product (not editing)
      slug: product ? product.slug : generateSlug(formData.name),
      // Procesar datos de alquiler
      rentalPrice: formData.availableForRental ? {
        daily: formData.rentalPriceDaily ? parseFloat(formData.rentalPriceDaily) : undefined,
        weekly: formData.rentalPriceWeekly ? parseFloat(formData.rentalPriceWeekly) : undefined,
        monthly: formData.rentalPriceMonthly ? parseFloat(formData.rentalPriceMonthly) : undefined
      } : undefined,
      rentalDeposit: formData.availableForRental && formData.rentalDeposit ? parseFloat(formData.rentalDeposit) : undefined
    };

    // Remover campos temporales del formulario
    delete cleanedData.rentalPriceDaily;
    delete cleanedData.rentalPriceWeekly;
    delete cleanedData.rentalPriceMonthly;

    onSave(cleanedData);
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: '', alt: '' }]
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [{ url: '', alt: '' }] });
  };

  const updateImage = (index: number, field: 'url' | 'alt', value: string) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addArrayItem = (field: 'materials' | 'details' | 'tags') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayItem = (field: 'materials' | 'details' | 'tags', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray.length > 0 ? newArray : [''] });
  };

  const updateArrayItem = (field: 'materials' | 'details' | 'tags', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: '', hex: '#000000' }]
    });
  };

  const removeColor = (index: number) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: newColors.length > 0 ? newColors : [{ name: '', hex: '#000000' }] });
  };

  const updateColor = (index: number, field: 'name' | 'hex', value: string) => {
    const newColors = [...formData.colors];
    newColors[index][field] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const updateSize = (index: number, field: 'inStock' | 'quantity', value: boolean | number) => {
    setFormData((prev) => {
      const newSizes = [...prev.sizes];
      if (field === 'inStock') {
        newSizes[index] = { ...newSizes[index], inStock: value as boolean };
        if (!value) newSizes[index].quantity = 0; // Reset quantity if out of stock
      } else {
        newSizes[index] = { ...newSizes[index], quantity: value as number };
      }
      return { ...prev, sizes: newSizes };
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información Básica */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <h3 className="text-xl font-playfair mb-4">Información Básica</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre del Producto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Precio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-deep-taupe/60">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input-field pl-8"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Precio Comparativo (opcional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-deep-taupe/60">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.compareAtPrice}
                  onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                  className="input-field pl-8"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
              required
            >
              <option value="dresses">Vestidos</option>
              <option value="tops">Blusas</option>
              <option value="bottoms">Pantalones</option>
              <option value="outerwear">Abrigos</option>
              <option value="accessories">Accesorios</option>
              <option value="shoes">Zapatos</option>
              <option value="bags">Bolsos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sistema de Alquiler */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <h3 className="text-xl font-playfair mb-4">Sistema de Alquiler</h3>
        
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.availableForRental}
              onChange={(e) => setFormData({ ...formData, availableForRental: e.target.checked })}
              className="mr-3"
            />
            <span className="font-medium">Disponible para Alquiler</span>
          </label>

          {formData.availableForRental && (
            <div className="space-y-4 pl-6 border-l-2 border-deep-taupe/20">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Precio Diario
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-deep-taupe/60">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.rentalPriceDaily}
                      onChange={(e) => setFormData({ ...formData, rentalPriceDaily: e.target.value })}
                      className="input-field pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Precio Semanal
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-deep-taupe/60">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.rentalPriceWeekly}
                      onChange={(e) => setFormData({ ...formData, rentalPriceWeekly: e.target.value })}
                      className="input-field pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Precio Mensual
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-deep-taupe/60">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.rentalPriceMonthly}
                      onChange={(e) => setFormData({ ...formData, rentalPriceMonthly: e.target.value })}
                      className="input-field pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Depósito de Garantía
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-deep-taupe/60">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.rentalDeposit}
                    onChange={(e) => setFormData({ ...formData, rentalDeposit: e.target.value })}
                    className="input-field pl-8"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-deep-taupe/60 mt-1">
                  Cantidad que se cobra como garantía y se devuelve al retornar el producto
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Imágenes */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <h3 className="text-xl font-playfair mb-4">Imágenes del Producto</h3>
        
        <ImageUpload
          onImageSelect={(images) => {
            if (Array.isArray(images)) {
              setFormData({ ...formData, images: images.map(img => ({ url: img.url, alt: img.alt })) });
            } else if (images) {
              setFormData({ ...formData, images: [{ url: images.url, alt: images.alt }] });
            }
          }}
          selectedImage={formData.images.length > 0 ? formData.images : null}
          category="products"
          multiple={true}
          maxImages={10}
        />

        {/* Vista previa de imágenes seleccionadas */}
        {formData.images.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Vista previa:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tallas */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <h3 className="text-xl font-playfair mb-4">Tallas Disponibles</h3>
        <div className="grid grid-cols-5 gap-4">
          {formData.sizes.map((size, index) => (
            <div key={index} className="border border-warm-taupe/20 p-3">
              <label className="flex items-center justify-center mb-2">
                <input
                  type="checkbox"
                  checked={size.inStock}
                  onChange={(e) => updateSize(index, 'inStock', e.target.checked)}
                  className="mr-2"
                />
                <span className="font-medium">{size.size}</span>
              </label>
              <input
                type="number"
                placeholder="Cantidad"
                value={size.quantity}
                onChange={(e) => updateSize(index, 'quantity', parseInt(e.target.value) || 0)}
                className="input-field text-sm"
                disabled={!size.inStock}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Colores */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair">Colores</h3>
          <button type="button" onClick={addColor} className="btn-secondary text-sm py-2">
            + Agregar Color
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.colors.map((color, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Nombre del color"
                value={color.name}
                onChange={(e) => updateColor(index, 'name', e.target.value)}
                className="input-field flex-1"
              />
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateColor(index, 'hex', e.target.value)}
                className="w-16 h-10 border border-warm-taupe"
              />
              {formData.colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Materiales */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair">Materiales</h3>
          <button type="button" onClick={() => addArrayItem('materials')} className="btn-secondary text-sm py-2">
            + Agregar Material
          </button>
        </div>
        
        <div className="space-y-2">
          {formData.materials.map((material, index) => (
            <div key={index} className="flex gap-4">
              <input
                type="text"
                placeholder="Ej: 100% Algodón"
                value={material}
                onChange={(e) => updateArrayItem('materials', index, e.target.value)}
                className="input-field flex-1"
              />
              {formData.materials.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('materials', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detalles */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair">Detalles del Producto</h3>
          <button type="button" onClick={() => addArrayItem('details')} className="btn-secondary text-sm py-2">
            + Agregar Detalle
          </button>
        </div>
        
        <div className="space-y-2">
          {formData.details.map((detail, index) => (
            <div key={index} className="flex gap-4">
              <input
                type="text"
                placeholder="Ej: Cierre invisible en la espalda"
                value={detail}
                onChange={(e) => updateArrayItem('details', index, e.target.value)}
                className="input-field flex-1"
              />
              {formData.details.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('details', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instrucciones de Cuidado */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <h3 className="text-xl font-playfair mb-4">Instrucciones de Cuidado</h3>
        <textarea
          value={formData.careInstructions}
          onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
          placeholder="Ej: Lavar a mano con agua fría. No usar blanqueador."
          className="input-field min-h-[80px]"
        />
      </div>

      {/* Etiquetas */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-playfair">Etiquetas / Tags</h3>
          <button type="button" onClick={() => addArrayItem('tags')} className="btn-secondary text-sm py-2">
            + Agregar Tag
          </button>
        </div>
        
        <div className="space-y-2">
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex gap-4">
              <input
                type="text"
                placeholder="Ej: verano, elegante, casual"
                value={tag}
                onChange={(e) => updateArrayItem('tags', index, e.target.value)}
                className="input-field flex-1"
              />
              {formData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem('tags', index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Configuraciones */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <h3 className="text-xl font-playfair mb-4">Configuraciones</h3>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="mr-3"
            />
            <span>Producto Destacado</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.newArrival}
              onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
              className="mr-3"
            />
            <span>Nuevo Llegado</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.bestseller}
              onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
              className="mr-3"
            />
            <span>Más Vendido</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.inStock}
              onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
              className="mr-3"
            />
            <span>En Stock</span>
          </label>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {product ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;







