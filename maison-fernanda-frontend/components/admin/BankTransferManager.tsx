import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface BankTransfer {
  _id: string;
  orderId: any;
  orderNumber: string;
  amount: number;
  status: 'pending' | 'verifying' | 'approved' | 'rejected' | 'expired';
  paymentMethod: string;
  bankDetails: any;
  transferDetails: any;
  proofOfPayment: any;
  verification: any;
  expirationDate: string;
  customerInfo: any;
  adminNotes: any[];
  createdAt: string;
}

const BankTransferManager: React.FC = () => {
  const [transfers, setTransfers] = useState<BankTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransfer, setSelectedTransfer] = useState<BankTransfer | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    startDate: '',
    endDate: ''
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTransfers();
    fetchStats();
  }, [filters]);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await axios.get(`${API_URL}/api/bank-transfers?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setTransfers(response.data.data.transfers);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      toast.error('Error al cargar transferencias');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bank-transfers/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (transferId: string, status: string, notes?: string, rejectionReason?: string) => {
    try {
      await axios.put(`${API_URL}/api/bank-transfers/${transferId}/status`, {
        status,
        verificationNotes: notes,
        rejectionReason
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success(`Estado actualizado a ${status}`);
      fetchTransfers();
      fetchStats();
      setSelectedTransfer(null);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar estado');
    }
  };

  const handleAddNote = async (transferId: string, note: string) => {
    try {
      await axios.post(`${API_URL}/api/bank-transfers/${transferId}/notes`, {
        note
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Nota agregada exitosamente');
      fetchTransfers();
    } catch (error: any) {
      console.error('Error adding note:', error);
      toast.error(error.response?.data?.message || 'Error al agregar nota');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      verifying: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: any = {
      pending: 'Pendiente',
      verifying: 'Verificando',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      expired: 'Expirado'
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expirationDate: string) => {
    return new Date() > new Date(expirationDate);
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-white p-6 border border-warm-taupe/20">
        <h2 className="heading-md mb-4">Gestión de Transferencias Bancarias</h2>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-2xl font-playfair text-deep-taupe">{stats.total}</p>
              <p className="text-sm text-deep-taupe/60">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-playfair text-yellow-600">{stats.pending}</p>
              <p className="text-sm text-deep-taupe/60">Pendientes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-playfair text-blue-600">{stats.verifying}</p>
              <p className="text-sm text-deep-taupe/60">Verificando</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-playfair text-green-600">{stats.approved}</p>
              <p className="text-sm text-deep-taupe/60">Aprobadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-playfair text-red-600">{stats.rejected}</p>
              <p className="text-sm text-deep-taupe/60">Rechazadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-playfair text-gray-600">{stats.expired}</p>
              <p className="text-sm text-deep-taupe/60">Expiradas</p>
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 border border-warm-taupe/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Buscar transferencias..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="input-field"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="verifying">Verificando</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
            <option value="expired">Expirado</option>
          </select>
          <input
            type="date"
            placeholder="Fecha inicio"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="input-field"
          />
          <input
            type="date"
            placeholder="Fecha fin"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="input-field"
          />
        </div>
      </div>

      {/* Lista de transferencias */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {transfers.map((transfer) => (
            <div key={transfer._id} className="bg-white border border-warm-taupe/20 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-lg">Transferencia #{transfer.orderNumber}</h3>
                    <span className={`px-3 py-1 text-xs rounded ${getStatusColor(transfer.status)}`}>
                      {getStatusLabel(transfer.status)}
                    </span>
                    {transfer.status === 'pending' && isExpired(transfer.expirationDate) && (
                      <span className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded">
                        Expirado
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-deep-taupe/60 mb-1">
                    👤 {transfer.customerInfo.firstName} {transfer.customerInfo.lastName} • 📧 {transfer.customerInfo.email}
                  </p>
                  <p className="text-sm text-deep-taupe/60 mb-1">
                    💰 ${transfer.amount.toFixed(2)} • 📅 {formatDate(transfer.createdAt)}
                  </p>
                  {transfer.transferDetails?.referenceNumber && (
                    <p className="text-sm text-deep-taupe/60">
                      🔢 Referencia: {transfer.transferDetails.referenceNumber}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium text-2xl font-playfair mb-2">
                    ${transfer.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-deep-taupe/60">
                    {transfer.paymentMethod.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTransfer(transfer)}
                  className="btn-primary text-sm py-2 px-4"
                >
                  👁️ Ver Detalles Completos
                </button>
                
                {transfer.status === 'verifying' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(transfer._id, 'approved', 'Transferencia verificada y aprobada')}
                      className="btn-secondary text-sm py-2 px-4 bg-green-600 text-white hover:bg-green-700"
                    >
                      ✅ Aprobar
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Motivo del rechazo:');
                        if (reason) {
                          handleStatusUpdate(transfer._id, 'rejected', '', reason);
                        }
                      }}
                      className="btn-secondary text-sm py-2 px-4 bg-red-600 text-white hover:bg-red-700"
                    >
                      ❌ Rechazar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {transfers.length === 0 && (
            <div className="text-center py-24 bg-warm-taupe/5">
              <p className="text-deep-taupe/60 mb-4">No hay transferencias bancarias.</p>
              <p className="text-sm text-deep-taupe/40">Las transferencias aparecerán aquí cuando los clientes las soliciten</p>
            </div>
          )}
        </div>
      )}

      {/* Modal de detalles */}
      {selectedTransfer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-warm-taupe/20 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="heading-md">Transferencia #{selectedTransfer.orderNumber}</h2>
                  <p className="text-sm text-deep-taupe/60">
                    {formatDate(selectedTransfer.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTransfer(null)}
                  className="text-deep-taupe hover:text-deep-taupe/60"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Información del cliente */}
              <div className="border border-warm-taupe/20 p-4">
                <h3 className="font-playfair text-lg mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-deep-taupe/60 mb-1">Nombre</p>
                    <p className="font-medium">
                      {selectedTransfer.customerInfo.firstName} {selectedTransfer.customerInfo.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-deep-taupe/60 mb-1">Email</p>
                    <p className="font-medium">{selectedTransfer.customerInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-deep-taupe/60 mb-1">Teléfono</p>
                    <p className="font-medium">{selectedTransfer.customerInfo.phone || 'No proporcionado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-deep-taupe/60 mb-1">Monto</p>
                    <p className="font-medium text-xl">${selectedTransfer.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Detalles de la transferencia */}
              <div className="border border-warm-taupe/20 p-4">
                <h3 className="font-playfair text-lg mb-3">Detalles de la Transferencia</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-deep-taupe/60 mb-1">Método de Pago</p>
                    <p className="font-medium">{selectedTransfer.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-deep-taupe/60 mb-1">Número de Referencia</p>
                    <p className="font-medium">{selectedTransfer.transferDetails?.referenceNumber || 'No proporcionado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-deep-taupe/60 mb-1">Fecha de Transferencia</p>
                    <p className="font-medium">
                      {selectedTransfer.transferDetails?.transferDate 
                        ? formatDate(selectedTransfer.transferDetails.transferDate)
                        : 'No proporcionada'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-deep-taupe/60 mb-1">Estado</p>
                    <span className={`px-3 py-1 text-sm rounded ${getStatusColor(selectedTransfer.status)}`}>
                      {getStatusLabel(selectedTransfer.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comprobante de pago */}
              {selectedTransfer.proofOfPayment && (
                <div className="border border-warm-taupe/20 p-4">
                  <h3 className="font-playfair text-lg mb-3">Comprobante de Pago</h3>
                  <div className="space-y-3">
                    <img
                      src={selectedTransfer.proofOfPayment.url}
                      alt="Comprobante de pago"
                      className="max-w-full h-auto border border-warm-taupe/20 rounded"
                    />
                    <div className="text-sm text-deep-taupe/60">
                      <p>Archivo: {selectedTransfer.proofOfPayment.originalName}</p>
                      <p>Subido: {formatDate(selectedTransfer.proofOfPayment.uploadedAt)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Verificación */}
              {selectedTransfer.verification && (
                <div className="border border-warm-taupe/20 p-4">
                  <h3 className="font-playfair text-lg mb-3">Verificación</h3>
                  <div className="space-y-2">
                    <p><strong>Verificado por:</strong> {selectedTransfer.verification.verifiedBy?.firstName} {selectedTransfer.verification.verifiedBy?.lastName}</p>
                    <p><strong>Fecha:</strong> {formatDate(selectedTransfer.verification.verifiedAt)}</p>
                    {selectedTransfer.verification.verificationNotes && (
                      <p><strong>Notas:</strong> {selectedTransfer.verification.verificationNotes}</p>
                    )}
                    {selectedTransfer.verification.rejectionReason && (
                      <p><strong>Motivo de rechazo:</strong> {selectedTransfer.verification.rejectionReason}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Notas de administrador */}
              {selectedTransfer.adminNotes && selectedTransfer.adminNotes.length > 0 && (
                <div className="border border-warm-taupe/20 p-4">
                  <h3 className="font-playfair text-lg mb-3">Notas de Administrador</h3>
                  <div className="space-y-3">
                    {selectedTransfer.adminNotes.map((note: any, index: number) => (
                      <div key={index} className="bg-warm-taupe/5 p-3 rounded">
                        <p className="text-sm">{note.note}</p>
                        <p className="text-xs text-deep-taupe/60 mt-1">
                          Por {note.addedBy?.firstName} {note.addedBy?.lastName} el {formatDate(note.addedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-3">
                {selectedTransfer.status === 'verifying' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedTransfer._id, 'approved', 'Transferencia verificada y aprobada')}
                      className="btn-primary bg-green-600 hover:bg-green-700"
                    >
                      ✅ Aprobar Transferencia
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Motivo del rechazo:');
                        if (reason) {
                          handleStatusUpdate(selectedTransfer._id, 'rejected', '', reason);
                        }
                      }}
                      className="btn-secondary bg-red-600 text-white hover:bg-red-700"
                    >
                      ❌ Rechazar Transferencia
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => {
                    const note = prompt('Agregar nota:');
                    if (note) {
                      handleAddNote(selectedTransfer._id, note);
                    }
                  }}
                  className="btn-secondary"
                >
                  📝 Agregar Nota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankTransferManager;
