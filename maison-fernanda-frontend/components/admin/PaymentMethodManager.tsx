import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface PaymentMethod {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  type: string;
  icon: string;
  isActive: boolean;
  isDefault: boolean;
  order: number;
  configuration: any;
  fees: any;
  restrictions: any;
  instructions: any;
  metadata: any;
  createdAt: string;
}

const PaymentMethodManager: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [stats, setStats] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPaymentMethods();
    fetchStats();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/payment-methods`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setPaymentMethods(response.data.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Error al cargar métodos de pago');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/payment-methods/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleToggleActive = async (methodId: string) => {
    try {
      await axios.put(`${API_URL}/api/payment-methods/${methodId}/toggle`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Estado del método de pago actualizado');
      fetchPaymentMethods();
      fetchStats();
    } catch (error: any) {
      console.error('Error toggling payment method:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar estado');
    }
  };

  const handleSetDefault = async (methodId: string) => {
    try {
      await axios.put(`${API_URL}/api/payment-methods/${methodId}/set-default`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Método de pago establecido como predeterminado');
      fetchPaymentMethods();
      fetchStats();
    } catch (error: any) {
      console.error('Error setting default:', error);
      toast.error(error.response?.data?.message || 'Error al establecer método predeterminado');
    }
  };

  const handleDelete = async (methodId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este método de pago?')) return;

    try {
      await axios.delete(`${API_URL}/api/payment-methods/${methodId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Método de pago eliminado exitosamente');
      fetchPaymentMethods();
      fetchStats();
    } catch (error: any) {
      console.error('Error deleting payment method:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar método de pago');
    }
  };

  const getTypeColor = (type: string) => {
    const colors: any = {
      stripe: 'bg-blue-100 text-blue-800',
      bank_transfer: 'bg-green-100 text-green-800',
      paypal: 'bg-yellow-100 text-yellow-800',
      cash_on_delivery: 'bg-purple-100 text-purple-800',
      crypto: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels: any = {
      stripe: 'Stripe',
      bank_transfer: 'Transferencia Bancaria',
      paypal: 'PayPal',
      cash_on_delivery: 'Efectivo contra Entrega',
      crypto: 'Criptomonedas',
      other: 'Otro'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="heading-md">Gestión de Métodos de Pago</h2>
          <button
            onClick={() => {
              setEditingMethod(null);
              setShowForm(true);
            }}
            className="btn-primary flex items-center gap-2"
          >
            ➕ Agregar Método de Pago
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-playfair text-deep-taupe">{stats.total}</p>
              <p className="text-sm text-deep-taupe/60">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-playfair text-green-600">{stats.active}</p>
              <p className="text-sm text-deep-taupe/60">Activos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-playfair text-red-600">{stats.inactive}</p>
              <p className="text-sm text-deep-taupe/60">Inactivos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-playfair text-blue-600">{stats.typeStats.length}</p>
              <p className="text-sm text-deep-taupe/60">Tipos</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-playfair text-purple-600">
                {stats.defaultMethod ? stats.defaultMethod.displayName : 'Ninguno'}
              </p>
              <p className="text-sm text-deep-taupe/60">Predeterminado</p>
            </div>
          </div>
        )}
      </div>

      {/* Lista de métodos de pago */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method._id} className="bg-white border border-warm-taupe/20 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{method.icon}</span>
                    <h3 className="font-medium text-lg">{method.displayName}</h3>
                    <span className={`px-3 py-1 text-xs rounded ${getTypeColor(method.type)}`}>
                      {getTypeLabel(method.type)}
                    </span>
                    {method.isDefault && (
                      <span className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        Predeterminado
                      </span>
                    )}
                    <span className={`px-3 py-1 text-xs rounded ${
                      method.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {method.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-sm text-deep-taupe/60 mb-2">{method.description}</p>
                  <div className="flex gap-4 text-xs text-deep-taupe/60">
                    <span>Nombre: {method.name}</span>
                    <span>Orden: {method.order}</span>
                    {method.fees && (
                      <span>
                        Comisión: {method.fees.fixed > 0 ? `$${method.fees.fixed}` : ''}
                        {method.fees.percentage > 0 ? ` + ${method.fees.percentage}%` : ''}
                        {method.fees.fixed === 0 && method.fees.percentage === 0 ? 'Sin comisión' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-deep-taupe/60">
                    Creado: {new Date(method.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingMethod(method);
                    setShowForm(true);
                  }}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  ✏️ Editar
                </button>
                
                <button
                  onClick={() => handleToggleActive(method._id)}
                  className={`text-sm py-2 px-4 ${
                    method.isActive 
                      ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {method.isActive ? '❌ Desactivar' : '✅ Activar'}
                </button>

                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method._id)}
                    className="btn-secondary text-sm py-2 px-4 bg-purple-100 text-purple-800 hover:bg-purple-200"
                  >
                    ⭐ Establecer como Predeterminado
                  </button>
                )}

                <button
                  onClick={() => handleDelete(method._id)}
                  className="text-sm text-red-600 hover:text-red-800 py-2 px-4"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}

          {paymentMethods.length === 0 && (
            <div className="text-center py-24 bg-warm-taupe/5">
              <p className="text-deep-taupe/60 mb-4">No hay métodos de pago configurados.</p>
              <button 
                onClick={() => {
                  setEditingMethod(null);
                  setShowForm(true);
                }}
                className="btn-primary"
              >
                Crear Primer Método de Pago
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <PaymentMethodForm
          method={editingMethod}
          onClose={() => {
            setShowForm(false);
            setEditingMethod(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingMethod(null);
            fetchPaymentMethods();
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

// Componente de formulario para crear/editar métodos de pago
const PaymentMethodForm: React.FC<{
  method?: PaymentMethod | null;
  onClose: () => void;
  onSave: () => void;
}> = ({ method, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    type: 'stripe',
    icon: '💳',
    isActive: true,
    isDefault: false,
    order: 0,
    configuration: {
      stripe: {
        publishableKey: '',
        secretKey: '',
        webhookSecret: '',
        currency: 'usd',
        allowedCountries: [],
        supportedPaymentMethods: []
      },
      bankTransfer: {
        bankName: '',
        accountNumber: '',
        routingNumber: '',
        swiftCode: '',
        accountHolderName: '',
        bankAddress: '',
        instructions: '',
        supportedCurrencies: [],
        processingTime: '',
        minimumAmount: 0,
        maximumAmount: 0
      }
    },
    fees: {
      fixed: 0,
      percentage: 0,
      currency: 'USD'
    },
    restrictions: {
      minAmount: 0,
      maxAmount: 0,
      allowedCountries: [],
      excludedCountries: [],
      allowedCurrencies: []
    },
    instructions: {
      customer: '',
      admin: ''
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (method) {
      setFormData({
        name: method.name,
        displayName: method.displayName,
        description: method.description,
        type: method.type,
        icon: method.icon,
        isActive: method.isActive,
        isDefault: method.isDefault,
        order: method.order,
        configuration: method.configuration || formData.configuration,
        fees: method.fees || formData.fees,
        restrictions: method.restrictions || formData.restrictions,
        instructions: method.instructions || formData.instructions
      });
    }
  }, [method]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      if (method) {
        await axios.put(`${API_URL}/api/payment-methods/${method._id}`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Método de pago actualizado exitosamente');
      } else {
        await axios.post(`${API_URL}/api/payment-methods`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        toast.success('Método de pago creado exitosamente');
      }

      onSave();
    } catch (error: any) {
      console.error('Error saving payment method:', error);
      toast.error(error.response?.data?.message || 'Error al guardar método de pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-warm-taupe/20 p-6">
          <div className="flex justify-between items-center">
            <h2 className="heading-md">
              {method ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
            </h2>
            <button
              onClick={onClose}
              className="text-deep-taupe hover:text-deep-taupe/60"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre único</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
                disabled={!!method}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nombre para mostrar</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input-field"
                required
              >
                <option value="stripe">Stripe</option>
                <option value="bank_transfer">Transferencia Bancaria</option>
                <option value="paypal">PayPal</option>
                <option value="cash_on_delivery">Efectivo contra Entrega</option>
                <option value="crypto">Criptomonedas</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icono</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="input-field"
                placeholder="💳"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Orden</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="input-field"
              />
            </div>
          </div>

          {/* Configuración específica por tipo */}
          {formData.type === 'stripe' && (
            <div className="border border-warm-taupe/20 p-4 rounded">
              <h3 className="font-medium mb-4">Configuración de Stripe</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Clave Pública</label>
                  <input
                    type="text"
                    value={formData.configuration.stripe.publishableKey}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        stripe: { ...formData.configuration.stripe, publishableKey: e.target.value }
                      }
                    })}
                    className="input-field"
                    placeholder="pk_test_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Clave Secreta</label>
                  <input
                    type="password"
                    value={formData.configuration.stripe.secretKey}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        stripe: { ...formData.configuration.stripe, secretKey: e.target.value }
                      }
                    })}
                    className="input-field"
                    placeholder="sk_test_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Webhook Secret</label>
                  <input
                    type="password"
                    value={formData.configuration.stripe.webhookSecret}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        stripe: { ...formData.configuration.stripe, webhookSecret: e.target.value }
                      }
                    })}
                    className="input-field"
                    placeholder="whsec_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Moneda</label>
                  <select
                    value={formData.configuration.stripe.currency}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        stripe: { ...formData.configuration.stripe, currency: e.target.value }
                      }
                    })}
                    className="input-field"
                  >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="mxn">MXN</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {formData.type === 'bank_transfer' && (
            <div className="border border-warm-taupe/20 p-4 rounded">
              <h3 className="font-medium mb-4">Configuración de Transferencia Bancaria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre del Banco</label>
                  <input
                    type="text"
                    value={formData.configuration.bankTransfer.bankName}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        bankTransfer: { ...formData.configuration.bankTransfer, bankName: e.target.value }
                      }
                    })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Número de Cuenta</label>
                  <input
                    type="text"
                    value={formData.configuration.bankTransfer.accountNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        bankTransfer: { ...formData.configuration.bankTransfer, accountNumber: e.target.value }
                      }
                    })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Código de Enrutamiento</label>
                  <input
                    type="text"
                    value={formData.configuration.bankTransfer.routingNumber}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        bankTransfer: { ...formData.configuration.bankTransfer, routingNumber: e.target.value }
                      }
                    })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Código SWIFT</label>
                  <input
                    type="text"
                    value={formData.configuration.bankTransfer.swiftCode}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        bankTransfer: { ...formData.configuration.bankTransfer, swiftCode: e.target.value }
                      }
                    })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre del Titular</label>
                  <input
                    type="text"
                    value={formData.configuration.bankTransfer.accountHolderName}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        bankTransfer: { ...formData.configuration.bankTransfer, accountHolderName: e.target.value }
                      }
                    })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Dirección del Banco</label>
                  <input
                    type="text"
                    value={formData.configuration.bankTransfer.bankAddress}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        bankTransfer: { ...formData.configuration.bankTransfer, bankAddress: e.target.value }
                      }
                    })}
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Instrucciones para el Cliente</label>
                  <textarea
                    value={formData.configuration.bankTransfer.instructions}
                    onChange={(e) => setFormData({
                      ...formData,
                      configuration: {
                        ...formData.configuration,
                        bankTransfer: { ...formData.configuration.bankTransfer, instructions: e.target.value }
                      }
                    })}
                    className="input-field"
                    rows={3}
                    placeholder="Instrucciones detalladas para realizar la transferencia..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Comisiones */}
          <div className="border border-warm-taupe/20 p-4 rounded">
            <h3 className="font-medium mb-4">Comisiones</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Comisión Fija</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.fees.fixed}
                  onChange={(e) => setFormData({
                    ...formData,
                    fees: { ...formData.fees, fixed: parseFloat(e.target.value) || 0 }
                  })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comisión Porcentual (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.fees.percentage}
                  onChange={(e) => setFormData({
                    ...formData,
                    fees: { ...formData.fees, percentage: parseFloat(e.target.value) || 0 }
                  })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Moneda</label>
                <select
                  value={formData.fees.currency}
                  onChange={(e) => setFormData({
                    ...formData,
                    fees: { ...formData.fees, currency: e.target.value }
                  })}
                  className="input-field"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MXN">MXN</option>
                </select>
              </div>
            </div>
          </div>

          {/* Instrucciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Instrucciones para el Cliente</label>
              <textarea
                value={formData.instructions.customer}
                onChange={(e) => setFormData({
                  ...formData,
                  instructions: { ...formData.instructions, customer: e.target.value }
                })}
                className="input-field"
                rows={4}
                placeholder="Instrucciones que verá el cliente..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Notas para Administradores</label>
              <textarea
                value={formData.instructions.admin}
                onChange={(e) => setFormData({
                  ...formData,
                  instructions: { ...formData.instructions, admin: e.target.value }
                })}
                className="input-field"
                rows={4}
                placeholder="Notas internas para el equipo..."
              />
            </div>
          </div>

          {/* Opciones */}
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              Activo
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="mr-2"
              />
              Método Predeterminado
            </label>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Guardando...' : (method ? 'Actualizar' : 'Crear')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethodManager;

