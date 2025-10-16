import React from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import useStore from '@/store/useStore';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <Layout title="Carrito de Compras - Maison Fernanda">
      <div className="container-custom py-12">
        <h1 className="heading-lg mb-12">Carrito de Compras</h1>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-deep-taupe/60 mb-6 text-lg">Tu carrito está vacío</p>
            <Link href="/collection" className="btn-primary">
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={`${item.product}-${item.size}-${item.color}`}
                    className="flex gap-6 pb-6 border-b border-warm-taupe/20"
                  >
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-32 h-40 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">{item.name}</h3>
                      {item.size && (
                        <p className="text-sm text-deep-taupe/60 mb-1">Talla: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="text-sm text-deep-taupe/60 mb-3">Color: {item.color}</p>
                      )}

                      <div className="flex items-center justify-between mt-4">
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
                            className="px-4 py-2 hover:bg-warm-taupe/10"
                          >
                            -
                          </button>
                          <span className="px-6 py-2">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product,
                                item.quantity + 1,
                                item.size,
                                item.color
                              )
                            }
                            className="px-4 py-2 hover:bg-warm-taupe/10"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => removeFromCart(item.product, item.size, item.color)}
                            className="text-sm text-deep-taupe/60 hover:text-deep-taupe underline mt-2"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/collection" className="btn-secondary mt-8 inline-block">
                Continuar Comprando
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-warm-taupe/5 p-8 sticky top-32">
                <h2 className="font-playfair text-2xl mb-6">Resumen del Pedido</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-deep-taupe/80">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-deep-taupe/80">Envío</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-deep-taupe/80">Impuesto (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-warm-taupe/20 pt-4 flex justify-between">
                    <span className="font-playfair text-lg">Total</span>
                    <span className="font-playfair text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 200 && (
                  <p className="text-sm text-deep-taupe/60 mb-6">
                    Agrega ${(200 - subtotal).toFixed(2)} más para envío gratis
                  </p>
                )}

                <Link href="/checkout" className="btn-primary w-full block text-center mb-3">
                  Proceder al Pago
                </Link>

                <div className="text-center text-sm text-deep-taupe/60 mt-6">
                  <p className="mb-2">Aceptamos:</p>
                  <div className="flex justify-center gap-2">
                    <span>💳</span>
                    <span>Visa, Mastercard, Amex</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;

