import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import useStore from '@/store/useStore';
import { checkout } from '@/lib/api';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, user, clearCart } = useStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: '',
  });

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }));
    }
  }, [user]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Por favor inicia sesión para continuar con el pago');
      router.push('/account');
      return;
    }

    setLoading(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Error al cargar Stripe');
      }

      // Create checkout session
      const response = await checkout.createSession({
        items: cart,
        shippingAddress: formData,
      });

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (result.error) {
        toast.error(result.error.message || 'Error en el pago');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Error en el pago. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <Layout title="Pago - Maison Fernanda">
      <div className="container-custom py-12">
        <h1 className="heading-lg mb-12">Pago</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {/* Contact Information */}
              <div className="mb-12">
                <h2 className="font-playfair text-2xl mb-6">Información de Contacto</h2>
                <div className="space-y-4">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Correo Electrónico"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-12">
                <h2 className="font-playfair text-2xl mb-6">Dirección de Envío</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Nombre"
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Apellido"
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    placeholder="Dirección Línea 1"
                    className="input-field md:col-span-2"
                    required
                  />
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    placeholder="Dirección Línea 2 (Opcional)"
                    className="input-field md:col-span-2"
                  />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ciudad"
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Estado/Provincia"
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    placeholder="Código Postal"
                    className="input-field"
                    required
                  />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="United States">Estados Unidos</option>
                    <option value="Canada">Canadá</option>
                    <option value="United Kingdom">Reino Unido</option>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Número de Teléfono"
                    className="input-field md:col-span-2"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-warm-taupe/5 p-8 sticky top-32">
                <h2 className="font-playfair text-2xl mb-6">Resumen del Pedido</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={`${item.product}-${item.size}-${item.color}`}
                      className="flex gap-4"
                    >
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-16 h-20 object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        {item.size && (
                          <p className="text-xs text-deep-taupe/60">Talla: {item.size}</p>
                        )}
                        <p className="text-sm mt-1">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6 border-t border-warm-taupe/20 pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-deep-taupe/80">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-deep-taupe/80">Envío</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-deep-taupe/80">Impuesto</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-warm-taupe/20 pt-3 flex justify-between">
                    <span className="font-playfair text-lg">Total</span>
                    <span className="font-playfair text-xl">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Procesando...' : 'Continuar al Pago'}
                </button>

                <p className="text-xs text-center text-deep-taupe/60 mt-4">
                  Serás redirigido a Stripe para el procesamiento seguro del pago
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CheckoutPage;

