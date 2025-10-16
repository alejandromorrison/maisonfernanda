import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import useStore from '@/store/useStore';
import { products, orders as ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const router = useRouter();
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('orders');
  const [productList, setProductList] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/account');
      return;
    }

    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [user, activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await products.getAll({ limit: 50 });
      setProductList(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersApi.getAllAdmin();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      toast.success('Estado del pedido actualizado');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error al actualizar el estado del pedido');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      await products.delete(productId);
      toast.success('Producto eliminado');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar producto');
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Layout title="Panel de Administración - Maison Fernanda">
      <div className="container-custom py-12">
        <h1 className="heading-lg mb-12">Panel de Administración</h1>

        {/* Tabs */}
        <div className="flex border-b border-warm-taupe/20 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'orders'
                ? 'border-b-2 border-deep-taupe'
                : 'text-deep-taupe/60'
            }`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'products'
                ? 'border-b-2 border-deep-taupe'
                : 'text-deep-taupe/60'
            }`}
          >
            Productos
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : activeTab === 'orders' ? (
          /* Orders Tab */
          <div>
            <h2 className="font-playfair text-2xl mb-6">
              Todos los Pedidos ({orders.length})
            </h2>

            {orders.length === 0 ? (
              <p className="text-center py-12 text-deep-taupe/60">Aún no hay pedidos.</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border border-warm-taupe/20 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-medium">Pedido #{order.orderNumber}</p>
                        <p className="text-sm text-deep-taupe/60">
                          {order.user.firstName} {order.user.lastName} ({order.user.email})
                        </p>
                        <p className="text-sm text-deep-taupe/60">
                          {new Date(order.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium mb-2">${order.totalPrice.toFixed(2)}</p>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="text-sm border border-warm-taupe px-2 py-1"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="processing">Procesando</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregado</option>
                          <option value="cancelled">Cancelado</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>
                            {item.name} {item.size ? `(${item.size})` : ''} x {item.quantity}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-warm-taupe/10 text-sm">
                      <p>
                        <strong>Dirección de Envío:</strong> {order.shippingAddress.address1},{' '}
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.postalCode}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Products Tab */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-2xl">
                Productos ({productList.length})
              </h2>
              <button
                onClick={() => toast('El formulario de creación de productos iría aquí')}
                className="btn-primary"
              >
                Agregar Nuevo Producto
              </button>
            </div>

            {productList.length === 0 ? (
              <p className="text-center py-12 text-deep-taupe/60">No se encontraron productos.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-warm-taupe/20">
                      <th className="text-left py-3 px-4">Imagen</th>
                      <th className="text-left py-3 px-4">Nombre</th>
                      <th className="text-left py-3 px-4">Categoría</th>
                      <th className="text-left py-3 px-4">Precio</th>
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-left py-3 px-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((product) => (
                      <tr key={product._id} className="border-b border-warm-taupe/10">
                        <td className="py-3 px-4">
                          <img
                            src={product.images[0]?.url || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-16 h-20 object-cover"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-deep-taupe/60">{product.slug}</p>
                        </td>
                        <td className="py-3 px-4 capitalize">{product.category}</td>
                        <td className="py-3 px-4">${product.price}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs ${
                              product.inStock
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.inStock ? 'En Stock' : 'Agotado'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toast('El formulario de edición iría aquí')}
                              className="text-sm text-deep-taupe underline"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-sm text-red-600 underline"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;

