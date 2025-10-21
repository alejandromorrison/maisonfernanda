import React, { useState, useEffect } from 'react';
import { pages } from '@/lib/api';
import toast from 'react-hot-toast';

const PageManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [pageList, setPageList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    metaDescription: '',
    content: '',
    isActive: true
  });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await pages.getAllAdmin();
      setPageList(response.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Error al cargar páginas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPage) {
        await pages.update(editingPage._id, formData);
        toast.success('Página actualizada exitosamente');
      } else {
        await pages.create(formData);
        toast.success('Página creada exitosamente');
      }
      
      setShowForm(false);
      setEditingPage(null);
      setFormData({
        slug: '',
        title: '',
        metaDescription: '',
        content: '',
        isActive: true
      });
      fetchPages();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar página');
    }
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      metaDescription: page.metaDescription || '',
      content: page.content,
      isActive: page.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta página?')) {
      return;
    }

    try {
      await pages.delete(pageId);
      toast.success('Página eliminada exitosamente');
      fetchPages();
    } catch (error) {
      toast.error('Error al eliminar página');
    }
  };

  const handleToggle = async (pageId: string) => {
    try {
      await pages.toggle(pageId);
      toast.success('Estado de página actualizado');
      fetchPages();
    } catch (error) {
      toast.error('Error al cambiar estado de página');
    }
  };

  const handleNewPage = () => {
    setEditingPage(null);
    setFormData({
      slug: '',
      title: '',
      metaDescription: '',
      content: '',
      isActive: true
    });
    setShowForm(true);
  };

  const predefinedPages = [
    {
      slug: 'contact',
      title: 'Contáctanos',
      metaDescription: 'Información de contacto de Maison Fernanda',
      content: `# Contáctanos

## Información de Contacto

**Maison Fernanda**
- 📧 Email: info@maisonfernanda.com
- 📞 Teléfono: +1 (555) 123-4567
- 📍 Dirección: 123 Avenida de la Moda, Madrid, España

## Horarios de Atención

- **Lunes a Viernes**: 9:00 AM - 6:00 PM
- **Sábados**: 10:00 AM - 4:00 PM
- **Domingos**: Cerrado

## Formulario de Contacto

¿Tienes alguna pregunta? ¡Nos encantaría escucharte! Completa el formulario a continuación y nos pondremos en contacto contigo lo antes posible.

[Formulario de contacto se implementará aquí]

## Redes Sociales

Síguenos en nuestras redes sociales para estar al día con las últimas tendencias y novedades:

- Instagram: @maisonfernanda
- Facebook: Maison Fernanda
- Pinterest: Maison Fernanda`
    },
    {
      slug: 'shipping',
      title: 'Envíos y Devoluciones',
      metaDescription: 'Política de envíos y devoluciones de Maison Fernanda',
      content: `# Envíos y Devoluciones

## Política de Envíos

### Zonas de Envío
- **España Peninsular**: Envío gratuito en pedidos superiores a €100
- **Islas Baleares y Canarias**: Envío gratuito en pedidos superiores a €150
- **Europa**: Envío desde €15
- **Resto del mundo**: Consultar disponibilidad

### Tiempos de Envío
- **España**: 2-3 días laborables
- **Europa**: 5-7 días laborables
- **Resto del mundo**: 7-14 días laborables

### Seguimiento
Recibirás un email con el número de seguimiento una vez que tu pedido haya sido enviado.

## Política de Devoluciones

### Período de Devolución
Tienes **30 días** desde la fecha de entrega para devolver cualquier artículo.

### Condiciones
- Los artículos deben estar en su estado original
- Deben incluir todas las etiquetas y embalaje original
- Los artículos personalizados no son elegibles para devolución

### Proceso de Devolución
1. Contacta con nuestro servicio al cliente
2. Te enviaremos una etiqueta de devolución
3. Envía el paquete de vuelta
4. Procesaremos el reembolso en 5-7 días laborables

### Reembolsos
Los reembolsos se procesarán al método de pago original utilizado en la compra.`
    },
    {
      slug: 'size-guide',
      title: 'Guía de Tallas',
      metaDescription: 'Guía de tallas para ropa de Maison Fernanda',
      content: `# Guía de Tallas

## Cómo Medirte

### Medidas Necesarias
- **Pecho**: Mide alrededor de la parte más ancha del pecho
- **Cintura**: Mide alrededor de la parte más estrecha de la cintura
- **Cadera**: Mide alrededor de la parte más ancha de las caderas
- **Altura**: Mide desde la parte superior de la cabeza hasta los pies

## Tabla de Tallas

### Vestidos y Blusas
| Talla | Pecho (cm) | Cintura (cm) | Cadera (cm) |
|-------|------------|--------------|-------------|
| XS    | 80-84      | 60-64        | 86-90       |
| S     | 84-88      | 64-68        | 90-94       |
| M     | 88-92      | 68-72        | 94-98       |
| L     | 92-96      | 72-76        | 98-102      |
| XL    | 96-100     | 76-80        | 102-106     |

### Pantalones y Faldas
| Talla | Cintura (cm) | Cadera (cm) | Largo Interior (cm) |
|-------|--------------|-------------|-------------------|
| XS    | 60-64        | 86-90       | 75-77             |
| S     | 64-68        | 90-94       | 77-79             |
| M     | 68-72        | 94-98       | 79-81             |
| L     | 72-76        | 98-102      | 81-83             |
| XL    | 76-80        | 102-106     | 83-85             |

## Consejos de Medición

### Cómo Medir Correctamente
1. **Usa una cinta métrica flexible**
2. **Mide sobre ropa interior o ropa ajustada**
3. **Mantén la cinta paralela al suelo**
4. **No aprietes demasiado la cinta**

### Si Estás Entre Tallas
- **Para prendas ajustadas**: Elige la talla más grande
- **Para prendas holgadas**: Elige la talla más pequeña
- **Para vestidos**: Basa tu decisión en la medida del pecho

## Contacto

¿Necesitas ayuda para elegir tu talla? ¡Contáctanos!
- 📧 Email: tallas@maisonfernanda.com
- 📞 Teléfono: +1 (555) 123-4567`
    },
    {
      slug: 'faq',
      title: 'Preguntas Frecuentes',
      metaDescription: 'Preguntas frecuentes sobre Maison Fernanda',
      content: `# Preguntas Frecuentes

## Pedidos y Envíos

### ¿Cuánto tiempo tarda mi pedido?
- **España**: 2-3 días laborables
- **Europa**: 5-7 días laborables
- **Resto del mundo**: 7-14 días laborables

### ¿Ofrecen envío gratuito?
Sí, ofrecemos envío gratuito en pedidos superiores a €100 para España peninsular y €150 para las islas.

### ¿Puedo cambiar mi dirección de envío?
Sí, puedes cambiar tu dirección de envío antes de que el pedido sea procesado. Contacta con nuestro servicio al cliente.

## Devoluciones y Cambios

### ¿Cuánto tiempo tengo para devolver un artículo?
Tienes 30 días desde la fecha de entrega para devolver cualquier artículo.

### ¿Cómo puedo devolver un artículo?
1. Contacta con nuestro servicio al cliente
2. Te enviaremos una etiqueta de devolución
3. Envía el paquete de vuelta
4. Procesaremos el reembolso en 5-7 días laborables

### ¿Los artículos personalizados se pueden devolver?
No, los artículos personalizados no son elegibles para devolución.

## Productos

### ¿Qué materiales utilizan?
Utilizamos materiales de alta calidad como seda, algodón orgánico, lino y lana merino.

### ¿Dónde se fabrican los productos?
Nuestros productos se fabrican en talleres especializados en España y Portugal.

### ¿Ofrecen garantía en sus productos?
Sí, ofrecemos garantía de 1 año contra defectos de fabricación.

## Pagos

### ¿Qué métodos de pago aceptan?
Aceptamos tarjetas de crédito/débito, PayPal y transferencia bancaria.

### ¿Es seguro comprar en su sitio web?
Sí, utilizamos encriptación SSL y procesamiento seguro de pagos.

### ¿Puedo pagar a plazos?
Actualmente no ofrecemos opciones de pago a plazos.

## Contacto

¿No encuentras la respuesta que buscas? ¡Contáctanos!
- 📧 Email: info@maisonfernanda.com
- 📞 Teléfono: +1 (555) 123-4567`
    },
    {
      slug: 'care',
      title: 'Instrucciones de Cuidado',
      metaDescription: 'Instrucciones de cuidado para prendas de Maison Fernanda',
      content: `# Instrucciones de Cuidado

## Cuidado General

### Antes del Primer Uso
- **Lava a mano** las prendas delicadas antes del primer uso
- **Revisa las etiquetas** de cuidado en cada prenda
- **Guarda en un lugar fresco y seco**

## Por Tipo de Material

### Seda
- **Lavado**: Solo a mano con agua fría
- **Detergente**: Usa detergente específico para seda
- **Secado**: Colgar en lugar sombreado, nunca al sol directo
- **Planchado**: A temperatura baja, con paño protector

### Algodón Orgánico
- **Lavado**: Máquina a 30°C, programa delicado
- **Detergente**: Detergente ecológico recomendado
- **Secado**: Tender al aire, evitar secadora
- **Planchado**: Temperatura media

### Lino
- **Lavado**: Máquina a 40°C, programa normal
- **Detergente**: Detergente suave
- **Secado**: Tender al aire, se arruga naturalmente
- **Planchado**: Temperatura alta, con vapor

### Lana Merino
- **Lavado**: Solo a mano con agua fría
- **Detergente**: Detergente específico para lana
- **Secado**: Tender plano, nunca colgar
- **Planchado**: Con paño húmedo, temperatura baja

## Consejos de Almacenamiento

### Temporada de Uso
- **Cuelga** las prendas en perchas apropiadas
- **Usa fundas** para prendas especiales
- **Mantén** el armario ventilado

### Temporada de Guardado
- **Lava** todas las prendas antes de guardar
- **Guarda** en bolsas de algodón o papel
- **Evita** bolsas de plástico
- **Revisa** periódicamente para evitar polillas

## Manchas Comunes

### Manchas de Comida
- **Actúa rápido**: Trata la mancha inmediatamente
- **Agua fría**: Enjuaga con agua fría
- **Detergente suave**: Aplica detergente específico
- **No frotes**: Toca suavemente, no frotes

### Manchas de Maquillaje
- **Quita el exceso**: Con una cuchara o cuchillo
- **Detergente enzimático**: Para manchas de base
- **Alcohol**: Para manchas de lápiz labial
- **Lava inmediatamente**: Después del tratamiento

## Símbolos de Cuidado

### Lavado
- **30°C**: Temperatura máxima de lavado
- **Mano**: Solo lavado a mano
- **No lavar**: Limpieza en seco únicamente

### Blanqueado
- **No blanquear**: No usar lejía
- **Blanqueo permitido**: Se puede usar lejía

### Planchado
- **Plancha baja**: Temperatura baja
- **Plancha media**: Temperatura media
- **Plancha alta**: Temperatura alta
- **No planchar**: No planchar

### Secado
- **Tender**: Secar al aire
- **Secadora baja**: Secadora a temperatura baja
- **No secadora**: No usar secadora

## Contacto

¿Tienes dudas sobre el cuidado de tus prendas?
- 📧 Email: cuidado@maisonfernanda.com
- 📞 Teléfono: +1 (555) 123-4567`
    }
  ];

  const createPredefinedPages = async () => {
    try {
      for (const pageData of predefinedPages) {
        await pages.create(pageData);
      }
      toast.success('Páginas predefinidas creadas exitosamente');
      fetchPages();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear páginas predefinidas');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div>
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(false);
              setEditingPage(null);
            }}
            className="text-deep-taupe hover:text-deep-taupe/60 flex items-center gap-2"
          >
            ← Volver a la Lista
          </button>
        </div>

        <h2 className="font-playfair text-2xl mb-6">
          {editingPage ? 'Editar Página' : 'Nueva Página'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Slug (URL)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="input-field"
                placeholder="contact"
                required
              />
              <p className="text-xs text-deep-taupe/60 mt-1">
                URL de la página (ej: /contact, /shipping)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Contáctanos"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meta Descripción</label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="input-field min-h-[80px]"
              placeholder="Descripción para motores de búsqueda..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contenido (Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input-field min-h-[400px] font-mono text-sm"
              placeholder="Escribe el contenido en Markdown..."
              required
            />
            <p className="text-xs text-deep-taupe/60 mt-1">
              Puedes usar Markdown para formatear el contenido
            </p>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Página activa</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary">
              {editingPage ? '💾 Actualizar Página' : '➕ Crear Página'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingPage(null);
              }}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-playfair text-2xl">Gestión de Páginas</h2>
        <div className="flex gap-3">
          <button
            onClick={createPredefinedPages}
            className="btn-secondary"
          >
            📄 Crear Páginas Predefinidas
          </button>
          <button
            onClick={handleNewPage}
            className="btn-primary"
          >
            ➕ Nueva Página
          </button>
        </div>
      </div>

      <div className="bg-white border border-warm-taupe/20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm-taupe/20">
                <th className="text-left py-3 px-4">Título</th>
                <th className="text-left py-3 px-4">Slug</th>
                <th className="text-left py-3 px-4">Estado</th>
                <th className="text-left py-3 px-4">Última Modificación</th>
                <th className="text-left py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pageList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-deep-taupe/60">
                    No hay páginas creadas
                  </td>
                </tr>
              ) : (
                pageList.map((page) => (
                  <tr key={page._id} className="border-b border-warm-taupe/10">
                    <td className="py-3 px-4">
                      <div className="font-medium">{page.title}</div>
                      {page.metaDescription && (
                        <div className="text-xs text-deep-taupe/60 mt-1">
                          {page.metaDescription}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        /{page.slug}
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggle(page._id)}
                        className={`px-3 py-1 text-xs rounded ${
                          page.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {page.isActive ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-sm text-deep-taupe/60">
                      {new Date(page.lastModified).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(page)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(page._id)}
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
      </div>
    </div>
  );
};

export default PageManager;
