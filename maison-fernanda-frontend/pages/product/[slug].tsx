import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/api';
import { useRouter } from 'next/router';
import useStore from '@/store/useStore';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } = useStore();

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await products.getOne(slug as string);
      setProduct(response.data.product);
      setRelatedProducts(response.data.relatedProducts || []);
      
      // Set default selections
      if (response.data.product.sizes?.length > 0) {
        setSelectedSize(response.data.product.sizes[0].size);
      }
      if (response.data.product.colors?.length > 0) {
        setSelectedColor(response.data.product.colors[0].name);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Producto no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Por favor selecciona una talla');
      return;
    }

    addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      price: product.price,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });

    toast.success('¡Agregado al carrito!');
  };

  const isWishlisted = product && wishlist.includes(product._id);

  const toggleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product._id);
      toast.success('Eliminado de favoritos');
    } else {
      addToWishlist(product._id);
      toast.success('Agregado a favoritos');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-custom py-24 flex justify-center">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container-custom py-24 text-center">
          <h1 className="heading-lg mb-4">Producto No Encontrado</h1>
          <button onClick={() => router.push('/collection')} className="btn-primary">
            Ver Colección
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${product.name} - Maison Fernanda`}
      description={product.description}
    >
      {/* Breadcrumb */}
      <div className="container-custom py-6">
        <div className="flex items-center text-sm space-x-2">
          <a href="/" className="text-deep-taupe/60 hover:text-deep-taupe">Inicio</a>
          <span className="text-deep-taupe/60">/</span>
          <a href="/collection" className="text-deep-taupe/60 hover:text-deep-taupe">Colección</a>
          <span className="text-deep-taupe/60">/</span>
          <span className="text-deep-taupe capitalize">{product.category}</span>
        </div>
      </div>

      <div className="container-custom pb-24">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="aspect-[3/4] bg-warm-taupe/10 mb-4 overflow-hidden">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt || product.name}
                  className="w-full h-full object-cover cursor-zoom-in"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-deep-taupe/30">
                  No Image
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-[3/4] bg-warm-taupe/10 overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-deep-taupe' : ''
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="sticky top-32">
              <p className="text-xs uppercase tracking-wider text-deep-taupe/60 mb-2">
                {product.category}
              </p>
              <h1 className="heading-md mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl font-medium">${product.price}</span>
                {product.compareAtPrice && (
                  <span className="text-lg text-deep-taupe/50 line-through">
                    ${product.compareAtPrice}
                  </span>
                )}
              </div>

              <p className="text-body mb-8">{product.description}</p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium">Color</label>
                    <span className="text-sm text-deep-taupe/60">{selectedColor}</span>
                  </div>
                  <div className="flex gap-3">
                    {product.colors.map((color: any) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedColor === color.name
                            ? 'border-deep-taupe'
                            : 'border-warm-taupe/30'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium">Talla</label>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-sm underline text-deep-taupe/60 hover:text-deep-taupe"
                    >
                      Guía de Tallas
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sizeObj: any) => (
                      <button
                        key={sizeObj.size}
                        onClick={() => setSelectedSize(sizeObj.size)}
                        disabled={!sizeObj.inStock}
                        className={`px-4 py-2 border text-sm ${
                          selectedSize === sizeObj.size
                            ? 'bg-deep-taupe text-ivory border-deep-taupe'
                            : sizeObj.inStock
                            ? 'border-warm-taupe hover:border-deep-taupe'
                            : 'border-warm-taupe/30 text-deep-taupe/30 cursor-not-allowed'
                        }`}
                      >
                        {sizeObj.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="text-sm font-medium mb-3 block">Cantidad</label>
                <div className="flex items-center border border-warm-taupe w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-warm-taupe/10"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 flex-1 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-warm-taupe/10"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart / Wishlist */}
              <div className="flex gap-4 mb-8">
                <button onClick={handleAddToCart} className="btn-primary flex-1">
                  Agregar al Carrito
                </button>
                <button
                  onClick={toggleWishlist}
                  className="btn-secondary px-6"
                  aria-label={isWishlisted ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isWishlisted ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Product Details */}
              {product.details && product.details.length > 0 && (
                <div className="border-t border-warm-taupe/20 pt-6 mb-6">
                  <h3 className="text-sm font-medium mb-3">Detalles</h3>
                  <ul className="space-y-2">
                    {product.details.map((detail: string, index: number) => (
                      <li key={index} className="text-sm text-deep-taupe/80 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Materials & Care */}
              {product.materials && product.materials.length > 0 && (
                <div className="border-t border-warm-taupe/20 pt-6 mb-6">
                  <h3 className="text-sm font-medium mb-2">Materiales</h3>
                  <p className="text-sm text-deep-taupe/80">
                    {product.materials.join(', ')}
                  </p>
                </div>
              )}

              {product.careInstructions && (
                <div className="border-t border-warm-taupe/20 pt-6">
                  <h3 className="text-sm font-medium mb-2">Instrucciones de Cuidado</h3>
                  <p className="text-sm text-deep-taupe/80">{product.careInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="heading-md mb-12 text-center">También Te Puede Gustar</h2>
            <div className="product-grid">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSizeGuide(false)}
        >
          <div
            className="bg-white max-w-2xl w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="heading-sm">Guía de Tallas</h2>
              <button onClick={() => setShowSizeGuide(false)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-warm-taupe/20">
                    <th className="text-left py-3 px-4">Talla</th>
                    <th className="text-left py-3 px-4">Busto (pulg)</th>
                    <th className="text-left py-3 px-4">Cintura (pulg)</th>
                    <th className="text-left py-3 px-4">Cadera (pulg)</th>
                  </tr>
                </thead>
                <tbody>
                  {['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size, index) => (
                    <tr key={size} className="border-b border-warm-taupe/10">
                      <td className="py-3 px-4 font-medium">{size}</td>
                      <td className="py-3 px-4">{30 + index * 2}-{31 + index * 2}</td>
                      <td className="py-3 px-4">{24 + index * 2}-{25 + index * 2}</td>
                      <td className="py-3 px-4">{34 + index * 2}-{35 + index * 2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProductDetailPage;

