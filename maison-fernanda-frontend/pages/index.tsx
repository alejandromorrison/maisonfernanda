import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { products } from '@/lib/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, newArrivalsRes] = await Promise.all([
          products.getAll({ featured: true, limit: 4 }),
          products.getAll({ newArrival: true, limit: 4 }),
        ]);
        setFeaturedProducts(featuredRes.data.products);
        setNewArrivals(newArrivalsRes.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout
      title="Maison Fernanda - Moda de Lujo y Elegancia Atemporal"
      description="Descubre colecciones curadas de piezas de moda de lujo. Maison Fernanda te trae elegancia atemporal y sofisticación moderna."
    >
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-warm-taupe/10 to-ivory">
        <div className="container-custom text-center z-10">
          <h1 className="heading-xl mb-6 animate-fade-in-up">
            Elegancia Atemporal
          </h1>
          <p className="text-xl md:text-2xl text-deep-taupe/80 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Descubre el arte del lujo refinado en cada pieza
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/collection" className="btn-primary">
              Ver Colección
            </Link>
            <Link href="/collection?filter=newArrival" className="btn-secondary">
              Nuevos Llegados
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-deep-taupe/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 bg-ivory">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4">Colección Destacada</h2>
            <p className="text-body max-w-2xl mx-auto">
              Piezas seleccionadas que encarnan la esencia de Maison Fernanda
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/collection?featured=true" className="btn-secondary">
              Ver Toda la Colección
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Block */}
      <section className="py-24 bg-warm-taupe/5">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="heading-lg mb-6">El Arte de la Moda Sostenible</h2>
              <p className="text-body mb-6">
                En Maison Fernanda, creemos en crear piezas que trascienden las temporadas. Cada artículo está cuidadosamente elaborado con los mejores materiales y atención al detalle, asegurando que tu inversión se convierta en una parte apreciada de tu guardarropa durante años.
              </p>
              <p className="text-body mb-8">
                Nuestro compromiso con la sostenibilidad y la producción ética significa que puedes sentirte bien con cada compra, sabiendo que fue hecha con respeto tanto para las personas como para el planeta.
              </p>
              <Link href="/collection" className="btn-primary">
                Explora Nuestra Filosofía
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="aspect-[4/5] bg-warm-taupe/20 flex items-center justify-center">
                <span className="text-deep-taupe/30 text-sm">Imagen Editorial</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 bg-ivory">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-lg mb-4">Nuevos Llegados</h2>
            <p className="text-body max-w-2xl mx-auto">
              Las últimas adiciones a nuestra colección
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="product-grid">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/collection?newArrival=true" className="btn-secondary">
              Ver Todos los Nuevos Llegados
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Lookbook */}
      <section className="py-24 bg-deep-taupe text-ivory">
        <div className="container-custom">
          <h2 className="heading-lg text-center mb-16">Comprar por Categoría</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Vestidos', href: '/collection?category=dresses' },
              { name: 'Blusas', href: '/collection?category=tops' },
              { name: 'Pantalones', href: '/collection?category=bottoms' },
              { name: 'Abrigos', href: '/collection?category=outerwear' },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group"
              >
                <div className="aspect-square bg-ivory/10 mb-4 flex items-center justify-center group-hover:bg-ivory/20 transition-colors">
                  <span className="text-ivory/30 text-sm">Imagen de Categoría</span>
                </div>
                <h3 className="text-center text-lg font-playfair group-hover:text-gold transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-ivory">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-md mb-4">Únete a Nuestra Comunidad</h2>
            <p className="text-body mb-8">
              Suscríbete para recibir ofertas exclusivas, inspiración de estilo y ser el primero en conocer los nuevos llegados.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="input-field flex-1"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;

