import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-deep-taupe text-ivory mt-24">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <img 
              src="/logo.png" 
              alt="Maison Fernanda" 
              className="h-8 mb-6 brightness-0 invert"
            />
            <p className="text-sm text-ivory/80 leading-relaxed">
              Curando elegancia atemporal y moda de lujo para la mujer moderna.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-playfair text-lg mb-4">Tienda</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/collection?category=dresses" className="text-sm text-ivory/80 hover:text-ivory transition-colors">
                  Vestidos
                </Link>
              </li>
              <li>
                <Link href="/collection?category=tops" className="text-sm text-ivory/80 hover:text-ivory transition-colors">
                  Blusas
                </Link>
              </li>
              <li>
                <Link href="/collection?category=bottoms" className="text-sm text-ivory/80 hover:text-ivory transition-colors">
                  Pantalones
                </Link>
              </li>
              <li>
                <Link href="/collection?category=outerwear" className="text-sm text-ivory/80 hover:text-ivory transition-colors">
                  Abrigos
                </Link>
              </li>
              <li>
                <Link href="/collection?category=accessories" className="text-sm text-ivory/80 hover:text-ivory transition-colors">
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-playfair text-lg mb-4">Atención al Cliente</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-ivory/80 hover:text-ivory transition-colors">
                  Contáctanos
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-ivory/80 hover:text-ivory transition-colors">
                  Envíos y Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-ivory/80 hover:text-ivory transition-colors">
                  Guía de Tallas
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-ivory/80 hover:text-ivory transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-ivory/80 hover:text-ivory transition-colors">
                  Instrucciones de Cuidado
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-playfair text-lg mb-4">Mantente Conectada</h4>
            <p className="text-sm text-ivory/80 mb-4">
              Suscríbete para recibir actualizaciones sobre nuevos llegados y ofertas exclusivas.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="px-4 py-2 bg-ivory/10 border border-ivory/20 text-ivory placeholder-ivory/50 focus:outline-none focus:border-ivory/40"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-ivory text-deep-taupe hover:bg-gold transition-colors text-sm uppercase tracking-wider"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-ivory/20 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-ivory/60">
            © {new Date().getFullYear()} Maison Fernanda. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-ivory/60 hover:text-ivory transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-ivory/60 hover:text-ivory transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="text-ivory/60 hover:text-ivory transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

