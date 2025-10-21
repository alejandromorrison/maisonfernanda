import React, { useState, useEffect } from 'react';
import { newsletter } from '@/lib/api';
import toast from 'react-hot-toast';

const NewsletterManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [pagination, setPagination] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSubscriber, setSelectedSubscriber] = useState<any>(null);
  const [editingSubscriber, setEditingSubscriber] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subscribersRes, statsRes] = await Promise.all([
        newsletter.getSubscribers({
          page: currentPage,
          limit: 20,
          search: searchTerm || undefined,
          status: statusFilter || undefined
        }),
        newsletter.getStats()
      ]);
      
      setSubscribers(subscribersRes.data.subscribers);
      setPagination(subscribersRes.data.pagination);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching newsletter data:', error);
      toast.error('Error al cargar datos del newsletter');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchData();
  };

  const handleStatusChange = async (subscriberId: string, newStatus: string) => {
    try {
      await newsletter.updateSubscriber(subscriberId, { status: newStatus });
      toast.success('Estado actualizado exitosamente');
      fetchData();
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este suscriptor?')) {
      return;
    }

    try {
      await newsletter.deleteSubscriber(subscriberId);
      toast.success('Suscriptor eliminado exitosamente');
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar suscriptor');
    }
  };

  const handleUpdateSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await newsletter.updateSubscriber(editingSubscriber._id, {
        notes: editingSubscriber.notes,
        tags: editingSubscriber.tags
      });
      toast.success('Suscriptor actualizado exitosamente');
      setEditingSubscriber(null);
      fetchData();
    } catch (error) {
      toast.error('Error al actualizar suscriptor');
    }
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Nombre', 'Apellido', 'Estado', 'Fecha de Suscripción', 'Fuente', 'Notas'],
      ...subscribers.map(sub => [
        sub.email,
        sub.firstName || '',
        sub.lastName || '',
        sub.status,
        new Date(sub.subscribedAt).toLocaleDateString('es-ES'),
        sub.source,
        sub.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `suscriptores-newsletter-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Lista de suscriptores exportada');
  };

  if (loading && !stats) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-playfair text-2xl mb-6">Gestión de Newsletter</h2>
      
      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 border border-warm-taupe/20">
            <p className="text-sm text-deep-taupe/60 mb-1">Total Suscriptores</p>
            <p className="text-3xl font-playfair">{stats.total}</p>
          </div>
          <div className="bg-white p-6 border border-warm-taupe/20">
            <p className="text-sm text-deep-taupe/60 mb-1">Activos</p>
            <p className="text-3xl font-playfair text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white p-6 border border-warm-taupe/20">
            <p className="text-sm text-deep-taupe/60 mb-1">Desuscritos</p>
            <p className="text-3xl font-playfair text-red-600">{stats.unsubscribed}</p>
          </div>
          <div className="bg-white p-6 border border-warm-taupe/20">
            <p className="text-sm text-deep-taupe/60 mb-1">Rebotados</p>
            <p className="text-3xl font-playfair text-orange-600">{stats.bounced}</p>
          </div>
          <div className="bg-white p-6 border border-warm-taupe/20">
            <p className="text-sm text-deep-taupe/60 mb-1">Últimos 30 días</p>
            <p className="text-3xl font-playfair text-blue-600">{stats.recent}</p>
          </div>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-6 border border-warm-taupe/20 mb-6">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por email, nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="unsubscribed">Desuscritos</option>
            <option value="bounced">Rebotados</option>
          </select>
          <button type="submit" className="btn-primary">
            🔍 Buscar
          </button>
        </form>
        
        <div className="flex gap-4">
          <button
            onClick={exportSubscribers}
            className="btn-secondary"
          >
            📊 Exportar CSV
          </button>
        </div>
      </div>

      {/* Lista de Suscriptores */}
      <div className="bg-white border border-warm-taupe/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm-taupe/20">
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Nombre</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Fecha</th>
                <th className="text-left py-3 px-4">Fuente</th>
                <th className="text-left py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="spinner mx-auto"></div>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-deep-taupe/60">
                    No se encontraron suscriptores
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="border-b border-warm-taupe/10">
                    <td className="py-3 px-4">
                      <div className="font-medium">{subscriber.email}</div>
                      {subscriber.notes && (
                        <div className="text-xs text-deep-taupe/60 mt-1">
                          {subscriber.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {subscriber.firstName || subscriber.lastName ? (
                        <div>
                          {subscriber.firstName} {subscriber.lastName}
                        </div>
                      ) : (
                        <span className="text-deep-taupe/60">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={subscriber.status}
                        onChange={(e) => handleStatusChange(subscriber._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded ${
                          subscriber.status === 'active' ? 'bg-green-100 text-green-800' :
                          subscriber.status === 'unsubscribed' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}
                      >
                        <option value="active">Activo</option>
                        <option value="unsubscribed">Desuscrito</option>
                        <option value="bounced">Rebotado</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm text-deep-taupe/60">
                      {new Date(subscriber.subscribedAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-sm text-deep-taupe/60 capitalize">
                      {subscriber.source}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingSubscriber(subscriber)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeleteSubscriber(subscriber._id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pagination.pages > 1 && (
          <div className="flex justify-between items-center p-4 border-t border-warm-taupe/20">
            <div className="text-sm text-deep-taupe/60">
              Mostrando {((pagination.current - 1) * 20) + 1} - {Math.min(pagination.current * 20, pagination.total)} de {pagination.total} suscriptores
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              <span className="px-4 py-2 text-sm">
                Página {pagination.current} de {pagination.pages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {editingSubscriber && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full p-6">
            <h3 className="text-lg font-playfair mb-4">Editar Suscriptor</h3>
            
            <form onSubmit={handleUpdateSubscriber}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={editingSubscriber.email}
                    disabled
                    className="input-field bg-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Notas</label>
                  <textarea
                    value={editingSubscriber.notes || ''}
                    onChange={(e) => setEditingSubscriber({
                      ...editingSubscriber,
                      notes: e.target.value
                    })}
                    className="input-field min-h-[80px]"
                    placeholder="Notas sobre este suscriptor..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (separados por comas)</label>
                  <input
                    type="text"
                    value={editingSubscriber.tags?.join(', ') || ''}
                    onChange={(e) => setEditingSubscriber({
                      ...editingSubscriber,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                    })}
                    className="input-field"
                    placeholder="VIP, cliente frecuente, etc."
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  💾 Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setEditingSubscriber(null)}
                  className="btn-secondary flex-1"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterManager;
