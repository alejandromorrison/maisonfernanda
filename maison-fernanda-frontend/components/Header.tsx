import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useStore from '@/store/useStore';
import SearchBar from './SearchBar';
import CartDrawer from './CartDrawer';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();
  const { cart, user, logout } = useStore();
  
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Colección', href: '/collection' },
    { name: 'Nuevos Llegados', href: '/collection?filter=newArrival' },
    { name: 'Más Vendidos', href: '/collection?filter=bestseller' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-ivory shadow-md py-4' : 'bg-ivory/95 py-6'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/logo.svg" 
                alt="Maison Fernanda" 
                className="h-24 md:h-30 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm uppercase tracking-wider link-underline pb-1"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4 md:space-x-6">
              <SearchBar />
              
              {/* Account */}
              {user ? (
                <div className="relative group hidden md:block">
                  <button className="text-sm uppercase tracking-wider">
                    Cuenta
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link
                      href="/account"
                      className="block px-4 py-3 hover:bg-warm-taupe/10 text-sm"
                    >
                      Mi Cuenta
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-3 hover:bg-warm-taupe/10 text-sm"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        router.push('/');
                      }}
                      className="block w-full text-left px-4 py-3 hover:bg-warm-taupe/10 text-sm"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/account"
                  className="hidden md:block text-sm uppercase tracking-wider link-underline pb-1"
                >
                  Iniciar Sesión
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative"
                aria-label="Shopping cart"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                  />
                </svg>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold text-deep-taupe text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  ) : (
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 6h16M4 12h16M4 18h16" 
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-6 pb-4 border-t border-warm-taupe/20 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-sm uppercase tracking-wider"
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    href="/account"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 text-sm uppercase tracking-wider"
                  >
                    Mi Cuenta
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-3 text-sm uppercase tracking-wider"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      router.push('/');
                    }}
                    className="block py-3 text-sm uppercase tracking-wider"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 text-sm uppercase tracking-wider"
                >
                  Iniciar Sesión
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className={isScrolled ? 'h-20' : 'h-24'} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;

