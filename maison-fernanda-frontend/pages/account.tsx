import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { auth, orders as ordersApi } from '@/lib/api';
import useStore from '@/store/useStore';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const AccountPage = () => {
  const router = useRouter();
  const { user, setUser, logout } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await ordersApi.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await auth.login(loginData);
      setUser(response.data);
      toast.success('¡Bienvenido de nuevo!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await auth.signup({
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        password: signupData.password,
      });
      setUser(response.data);
      toast.success('¡Cuenta creada exitosamente!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada exitosamente');
  };

  if (!user) {
    return (
      <Layout title="Cuenta - Maison Fernanda">
        <div className="container-custom py-12">
          <div className="max-w-md mx-auto">
            <h1 className="heading-lg mb-8 text-center">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h1>

            {isLogin ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="input-field"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={signupData.firstName}
                    onChange={(e) => setSignupData({ ...signupData, firstName: e.target.value })}
                    className="input-field"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    value={signupData.lastName}
                    onChange={(e) => setSignupData({ ...signupData, lastName: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className="input-field"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={signupData.confirmPassword}
                  onChange={(e) =>
                    setSignupData({ ...signupData, confirmPassword: e.target.value })
                  }
                  className="input-field"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? 'Creando Cuenta...' : 'Crear Cuenta'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-deep-taupe/80 hover:text-deep-taupe underline"
              >
                {isLogin
                  ? "¿No tienes una cuenta? Regístrate"
                  : '¿Ya tienes una cuenta? Inicia sesión'}
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mi Cuenta - Maison Fernanda">
      <div className="container-custom py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="heading-lg">Mi Cuenta</h1>
          <button onClick={handleLogout} className="btn-secondary">
            Cerrar Sesión
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-12">
          {/* Account Info */}
          <div className="md:col-span-1">
            <div className="bg-warm-taupe/5 p-6">
              <h2 className="font-playfair text-xl mb-4">Detalles de la Cuenta</h2>
              <p className="text-sm mb-2">
                <span className="text-deep-taupe/60">Nombre:</span><br />
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm mb-2">
                <span className="text-deep-taupe/60">Correo:</span><br />
                {user.email}
              </p>
              {user.role === 'admin' && (
                <div className="mt-6 pt-6 border-t border-warm-taupe/20">
                  <button
                    onClick={() => router.push('/admin')}
                    className="btn-primary w-full text-sm py-2"
                  >
                    Panel de Admin
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="md:col-span-3">
            <h2 className="font-playfair text-2xl mb-6">Historial de Pedidos</h2>

            {loadingOrders ? (
              <div className="flex justify-center py-12">
                <div className="spinner"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-deep-taupe/60 mb-6">Aún no has realizado ningún pedido.</p>
                <button
                  onClick={() => router.push('/collection')}
                  className="btn-primary"
                >
                  Comenzar a Comprar
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border border-warm-taupe/20 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-medium">Pedido #{order.orderNumber}</p>
                        <p className="text-sm text-deep-taupe/60">
                          {new Date(order.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.totalPrice.toFixed(2)}</p>
                        <span
                          className={`inline-block mt-2 px-3 py-1 text-xs uppercase tracking-wider ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status === 'delivered' ? 'Entregado' : order.status === 'shipped' ? 'Enviado' : order.status === 'processing' ? 'Procesando' : order.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex gap-4">
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
                          <p className="text-sm font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;

