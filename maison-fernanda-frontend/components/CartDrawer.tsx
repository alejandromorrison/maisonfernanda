import React from 'react';
import Link from 'next/link';
import useStore from '@/store/useStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full md:w-96 bg-white z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-warm-taupe/20">
            <h2 className="text-xl font-playfair">Bolsa de Compras</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-warm-taupe/10 rounded-full transition-colors"
              aria-label="Close cart"
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
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-deep-taupe/60 mb-4">Tu carrito está vacío</p>
                <Link
                  href="/collection"
                  onClick={onClose}
                  className="btn-primary inline-block"
                >
                  Continuar Comprando
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={`${item.product}-${item.size}-${item.color}`}
                    className="flex space-x-4"
                  >
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-24 h-32 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                      {item.size && (
                        <p className="text-xs text-deep-taupe/60">Talla: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="text-xs text-deep-taupe/60">Color: {item.color}</p>
                      )}
                      <p className="text-sm font-medium mt-2">${item.price}</p>

                      <div className="flex items-center space-x-3 mt-3">
                        <div className="flex items-center border border-warm-taupe">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product,
                                Math.max(1, item.quantity - 1),
                                item.size,
                                item.color
                              )
                            }
                            className="px-2 py-1 hover:bg-warm-taupe/10"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-sm">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product,
                                item.quantity + 1,
                                item.size,
                                item.color
                              )
                            }
                            className="px-2 py-1 hover:bg-warm-taupe/10"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(item.product, item.size, item.color)
                          }
                          className="text-xs text-deep-taupe/60 hover:text-deep-taupe underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-warm-taupe/20 p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-playfair">Subtotal</span>
                <span className="text-xl font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={onClose}
                className="btn-primary w-full block text-center mb-3"
              >
                Pagar
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="btn-secondary w-full block text-center"
              >
                Ver Carrito
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;

