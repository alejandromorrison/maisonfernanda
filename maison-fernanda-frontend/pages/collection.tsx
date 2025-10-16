import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/api';
import { useRouter } from 'next/router';

const CollectionPage = () => {
  const router = useRouter();
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  
  // Filters
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    sort: 'newest',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Initialize filters from URL query
    const query = router.query;
    setFilters({
      category: (query.category as string) || '',
      minPrice: (query.minPrice as string) || '',
      maxPrice: (query.maxPrice as string) || '',
      size: (query.size as string) || '',
      sort: (query.sort as string) || 'newest',
    });
  }, [router.query]);

  useEffect(() => {
    fetchProducts();
  }, [router.query]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        ...router.query,
        page: router.query.page || 1,
        limit: 12,
      };

      const response = await products.getAll(params);
      setProductList(response.data.products);
      setPagination({
        page: response.data.page,
        pages: response.data.pages,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL
    const query: any = { ...router.query, [key]: value };
    if (!value) delete query[key];
    router.push({ pathname: '/collection', query }, undefined, { shallow: true });
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      sort: 'newest',
    });
    router.push('/collection', undefined, { shallow: true });
  };

  const categories = ['dresses', 'tops', 'bottoms', 'outerwear', 'accessories', 'shoes', 'bags'];
  const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const sortOptions = [
    { value: 'newest', label: 'Más Reciente' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'popular', label: 'Más Popular' },
  ];

  return (
    <Layout title="Colección - Maison Fernanda" description="Navega por nuestra colección completa de piezas de moda de lujo">
      <div className="container-custom py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="heading-lg mb-4">Colección</h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-body">
              {pagination.total} {pagination.total === 1 ? 'producto' : 'productos'}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary md:hidden"
              >
                {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
              </button>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="input-field py-2"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className={`md:w-64 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-32">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-playfair text-xl">Filtros</h2>
                {(filters.category || filters.minPrice || filters.maxPrice || filters.size) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm underline text-deep-taupe/60 hover:text-deep-taupe"
                  >
                    Limpiar Todo
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="mb-8">
                <h3 className="font-medium mb-3">Categoría</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={filters.category === cat}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-8">
                <h3 className="font-medium mb-3">Talla</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        handleFilterChange('size', filters.size === size ? '' : size)
                      }
                      className={`px-3 py-1 border text-sm ${
                        filters.size === size
                          ? 'bg-deep-taupe text-ivory border-deep-taupe'
                          : 'border-warm-taupe hover:border-deep-taupe'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-medium mb-3">Rango de Precio</h3>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field w-full py-2"
                  />
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field w-full py-2"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-24">
                <div className="spinner"></div>
              </div>
            ) : productList.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-deep-taupe/60 mb-6">No se encontraron productos con tus filtros.</p>
                <button onClick={clearFilters} className="btn-primary">
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {productList.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-12 gap-2">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          router.push({
                            pathname: '/collection',
                            query: { ...router.query, page },
                          });
                        }}
                        className={`px-4 py-2 ${
                          page === pagination.page
                            ? 'bg-deep-taupe text-ivory'
                            : 'border border-warm-taupe hover:border-deep-taupe'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CollectionPage;

