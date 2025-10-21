import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import useStore from '@/store/useStore';
import { products, orders as ordersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import ProductForm from '@/components/admin/ProductForm';
import OrderDetail from '@/components/admin/OrderDetail';
import ContentEditor from '@/components/admin/ContentEditor';
import FooterEditor from '@/components/admin/FooterEditor';
import NewsletterManager from '@/components/admin/NewsletterManager';
import PageManager from '@/components/admin/PageManager';
import ImageManager from '@/components/admin/ImageManager';
import BankTransferManager from '@/components/admin/BankTransferManager';
import PaymentMethodManager from '@/components/admin/PaymentMethodManager';
import RentalManager from '@/components/admin/RentalManager';

const AdminPage = () => {
  const router = useRouter();
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'content' | 'footer' | 'newsletter' | 'pages' | 'images' | 'transfers' | 'payments' | 'rentals'>('orders');
  const [productList, setProductList] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el formulario de productos
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Estado para detalles del pedido
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await products.update(editingProduct._id, productData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await products.create(productData);
        toast.success('Producto creado exitosamente');
      }
      setShowProductForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.message || 'Error al guardar producto');
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  // Si está mostrando el formulario de producto
  if (showProductForm) {
    return (
      <Layout title="Gestionar Producto - Admin">
        <div className="container-custom py-12">
          <div className="mb-6">
            <button
              onClick={() => {
                setShowProductForm(false);
                setEditingProduct(null);
              }}
              className="text-deep-taupe hover:text-deep-taupe/60 flex items-center gap-2"
            >
              ← Volver al Panel
            </button>
          </div>
          <h1 className="heading-lg mb-8">
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </h1>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setShowProductForm(false);
              setEditingProduct(null);
            }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Panel de Administración - Maison Fernanda">
      <div className="container-custom py-12">
        <h1 className="heading-lg mb-12">Panel de Administración</h1>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 border border-warm-taupe/20">
            <p className="text-sm text-deep-taupe/60 mb-1">Total Pedidos</p>
            <p className="text-3xl font-playfair">{orders.length}</p>
          </div>
          <div className="bg-white p-6 border border-warm-taupe/20">
            <p className="text-sm text-deep-taupe/60 mb-1">Productos</p>
            <p className="text-3xl font-playfair">{productList.length}</p>
          </div>
          <div className="bg-white p-6 border border-warm-taupe/20">
            <p className="text-sm text-deep-taupe/60 mb-1">Ingresos Totales</p>
            <p className="text-3xl font-playfair">
              ${orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-white p-6 border border-warm-taupe/20">
            <p className="text-sm text-deep-taupe/60 mb-1">Pendientes</p>
            <p className="text-3xl font-playfair">
              {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
            </p>
          </div>
        </div>

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
            📦 Pedidos ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'products'
                ? 'border-b-2 border-deep-taupe'
                : 'text-deep-taupe/60'
            }`}
          >
            🏷️ Productos ({productList.length})
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'content'
                ? 'border-b-2 border-deep-taupe'
                : 'text-deep-taupe/60'
            }`}
          >
            ✏️ Contenido del Sitio
          </button>
          <button
            onClick={() => setActiveTab('footer')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'footer'
                ? 'border-b-2 border-deep-taupe'
                : 'text-deep-taupe/60'
            }`}
          >
            🦶 Footer y Redes
          </button>
          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'newsletter'
                ? 'border-b-2 border-deep-taupe'
                : 'text-deep-taupe/60'
            }`}
          >
            📧 Newsletter
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'pages'
                ? 'border-b-2 border-deep-taupe'
                : 'text-deep-taupe/60'
            }`}
          >
            📄 Páginas
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'images'
                ? 'border-b-2 border-deep-taupe'
                : 'text-deep-taupe/60'
            }`}
          >
            🖼️ Imágenes
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'transfers'
                ? 'border-b-2 border-deep-taupe'
                : 'text-deep-taupe/60'
            }`}
          >
            🏦 Transferencias
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'payments'
                ? 'border-b-2 border-deep-taupe'
                : 'text-deep-taupe/60'
            }`}
          >
            💳 Métodos de Pago
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'rentals'
                ? 'border-b-2 border-deep-taupe'
                : 'text-deep-taupe/60'
            }`}
          >
            👗 Alquileres
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
              <div className="text-center py-24 bg-warm-taupe/5">
                <p className="text-deep-taupe/60 mb-4">Aún no hay pedidos.</p>
                <p className="text-sm text-deep-taupe/40">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="border border-warm-taupe/20 p-6 hover:bg-warm-taupe/5 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-medium text-lg">Pedido #{order.orderNumber}</p>
                          <span className={`px-3 py-1 text-xs ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status === 'delivered' ? 'Entregado' : 
                             order.status === 'shipped' ? 'Enviado' :
                             order.status === 'processing' ? 'Procesando' :
                             order.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                          </span>
                        </div>
                        <p className="text-sm text-deep-taupe/60">
                          👤 {order.user.firstName} {order.user.lastName} • 📧 {order.user.email}
                        </p>
                        <p className="text-sm text-deep-taupe/60">
                          📅 {new Date(order.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-2xl font-playfair mb-2">
                          ${order.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-xs text-deep-taupe/60">
                          {order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} artículos
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        👁️ Ver Detalles Completos
                      </button>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="text-sm border border-warm-taupe px-3 py-2"
                      >
                        <option value="pending">Pendiente</option>
                        <option value="processing">Procesando</option>
                        <option value="shipped">Enviado</option>
                        <option value="delivered">Entregado</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'products' ? (
          /* Products Tab */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-2xl">
                Productos ({productList.length})
              </h2>
              <button
                onClick={handleNewProduct}
                className="btn-primary flex items-center gap-2"
              >
                ➕ Agregar Nuevo Producto
              </button>
            </div>

            {productList.length === 0 ? (
              <div className="text-center py-24 bg-warm-taupe/5">
                <p className="text-deep-taupe/60 mb-4">No hay productos en tu catálogo.</p>
                <button onClick={handleNewProduct} className="btn-primary">
                  Crear Primer Producto
                </button>
              </div>
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
                              onClick={() => handleEditProduct(product)}
                              className="btn-secondary text-sm py-1 px-3"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-sm text-red-600 hover:text-red-800 py-1 px-3"
                            >
                              🗑️ Eliminar
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
        ) : activeTab === 'content' ? (
          /* Content Tab */
          <ContentEditor />
        ) : activeTab === 'footer' ? (
          /* Footer Tab */
          <FooterEditor />
        ) : activeTab === 'newsletter' ? (
          /* Newsletter Tab */
          <NewsletterManager />
        ) : activeTab === 'pages' ? (
          /* Pages Tab */
          <PageManager />
        ) : activeTab === 'images' ? (
          /* Images Tab */
          <ImageManager />
        ) : activeTab === 'transfers' ? (
          /* Transfers Tab */
          <BankTransferManager />
        ) : activeTab === 'payments' ? (
          /* Payment Methods Tab */
          <PaymentMethodManager />
        ) : activeTab === 'rentals' ? (
          /* Rentals Tab */
          <RentalManager onClose={() => setActiveTab('orders')} />
        ) : null}

        {/* Modal de Detalles del Pedido */}
        {selectedOrder && (
          <OrderDetail
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;

