import React, { useState, useEffect } from 'react';
import { siteContent } from '@/lib/api';
import toast from 'react-hot-toast';

const FooterEditor: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await siteContent.get();
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Error al cargar el contenido');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFooter = async () => {
    setSaving(true);
    try {
      await siteContent.updateFooter(content.footer);
      toast.success('Footer actualizado exitosamente');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const updateFooterField = (section: string, field: string, value: any) => {
    setContent({
      ...content,
      footer: {
        ...content.footer,
        [section]: {
          ...content.footer[section],
          [field]: value
        }
      }
    });
  };

  const updateSocialMedia = (platform: string, value: string) => {
    setContent({
      ...content,
      footer: {
        ...content.footer,
        socialMedia: {
          ...content.footer.socialMedia,
          [platform]: value
        }
      }
    });
  };

  const addLink = (section: 'shop' | 'customerService') => {
    const newLink = { name: '', url: '', order: content.footer[section].links.length };
    setContent({
      ...content,
      footer: {
        ...content.footer,
        [section]: {
          ...content.footer[section],
          links: [...content.footer[section].links, newLink]
        }
      }
    });
  };

  const updateLink = (section: 'shop' | 'customerService', index: number, field: string, value: string) => {
    const newLinks = [...content.footer[section].links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setContent({
      ...content,
      footer: {
        ...content.footer,
        [section]: {
          ...content.footer[section],
          links: newLinks
        }
      }
    });
  };

  const removeLink = (section: 'shop' | 'customerService', index: number) => {
    const newLinks = content.footer[section].links.filter((_: any, i: number) => i !== index);
    setContent({
      ...content,
      footer: {
        ...content.footer,
        [section]: {
          ...content.footer[section],
          links: newLinks
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-playfair text-2xl mb-6">Editor del Footer</h2>
      
      <div className="space-y-8">
        {/* Brand Section */}
        <div className="bg-white p-6 border border-warm-taupe/20">
          <h3 className="text-xl font-playfair mb-4">Marca</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de la Marca</label>
              <input
                type="text"
                value={content?.footer?.brand?.name || ''}
                onChange={(e) => updateFooterField('brand', 'name', e.target.value)}
                className="input-field"
                placeholder="Maison Fernanda"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tagline</label>
              <textarea
                value={content?.footer?.brand?.tagline || ''}
                onChange={(e) => updateFooterField('brand', 'tagline', e.target.value)}
                className="input-field min-h-[80px]"
                placeholder="Curando elegancia atemporal y moda de lujo para la mujer moderna."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Logo (URL)</label>
              <input
                type="url"
                value={content?.footer?.brand?.logo || ''}
                onChange={(e) => updateFooterField('brand', 'logo', e.target.value)}
                className="input-field"
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>
          </div>
        </div>

        {/* Shop Links */}
        <div className="bg-white p-6 border border-warm-taupe/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-playfair">Enlaces de Tienda</h3>
            <button
              onClick={() => addLink('shop')}
              className="btn-secondary text-sm py-2"
            >
              ➕ Agregar Enlace
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Título de la Sección</label>
            <input
              type="text"
              value={content?.footer?.shop?.title || ''}
              onChange={(e) => updateFooterField('shop', 'title', e.target.value)}
              className="input-field"
              placeholder="Tienda"
            />
          </div>

          <div className="space-y-4">
            {content?.footer?.shop?.links?.map((link: any, index: number) => (
              <div key={index} className="p-4 border border-warm-taupe/20 bg-warm-taupe/5">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">Enlace {index + 1}</h4>
                  <button
                    onClick={() => removeLink('shop', index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Nombre</label>
                    <input
                      type="text"
                      value={link.name || ''}
                      onChange={(e) => updateLink('shop', index, 'name', e.target.value)}
                      className="input-field"
                      placeholder="Vestidos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">URL</label>
                    <input
                      type="text"
                      value={link.url || ''}
                      onChange={(e) => updateLink('shop', index, 'url', e.target.value)}
                      className="input-field"
                      placeholder="/collection?category=dresses"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Service Links */}
        <div className="bg-white p-6 border border-warm-taupe/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-playfair">Atención al Cliente</h3>
            <button
              onClick={() => addLink('customerService')}
              className="btn-secondary text-sm py-2"
            >
              ➕ Agregar Enlace
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Título de la Sección</label>
            <input
              type="text"
              value={content?.footer?.customerService?.title || ''}
              onChange={(e) => updateFooterField('customerService', 'title', e.target.value)}
              className="input-field"
              placeholder="Atención al Cliente"
            />
          </div>

          <div className="space-y-4">
            {content?.footer?.customerService?.links?.map((link: any, index: number) => (
              <div key={index} className="p-4 border border-warm-taupe/20 bg-warm-taupe/5">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium">Enlace {index + 1}</h4>
                  <button
                    onClick={() => removeLink('customerService', index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Nombre</label>
                    <input
                      type="text"
                      value={link.name || ''}
                      onChange={(e) => updateLink('customerService', index, 'name', e.target.value)}
                      className="input-field"
                      placeholder="Contáctanos"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">URL</label>
                    <input
                      type="text"
                      value={link.url || ''}
                      onChange={(e) => updateLink('customerService', index, 'url', e.target.value)}
                      className="input-field"
                      placeholder="/contact"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-white p-6 border border-warm-taupe/20">
          <h3 className="text-xl font-playfair mb-4">Newsletter</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input
                type="text"
                value={content?.footer?.newsletter?.title || ''}
                onChange={(e) => updateFooterField('newsletter', 'title', e.target.value)}
                className="input-field"
                placeholder="Mantente Conectada"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={content?.footer?.newsletter?.description || ''}
                onChange={(e) => updateFooterField('newsletter', 'description', e.target.value)}
                className="input-field min-h-[80px]"
                placeholder="Suscríbete para recibir actualizaciones sobre nuevos llegados y ofertas exclusivas."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Placeholder del Input</label>
                <input
                  type="text"
                  value={content?.footer?.newsletter?.placeholder || ''}
                  onChange={(e) => updateFooterField('newsletter', 'placeholder', e.target.value)}
                  className="input-field"
                  placeholder="Tu correo electrónico"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Texto del Botón</label>
                <input
                  type="text"
                  value={content?.footer?.newsletter?.buttonText || ''}
                  onChange={(e) => updateFooterField('newsletter', 'buttonText', e.target.value)}
                  className="input-field"
                  placeholder="SUSCRIBIRSE"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white p-6 border border-warm-taupe/20">
          <h3 className="text-xl font-playfair mb-4">Redes Sociales</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Facebook</label>
              <input
                type="url"
                value={content?.footer?.socialMedia?.facebook || ''}
                onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                className="input-field"
                placeholder="https://facebook.com/maisonfernanda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Instagram</label>
              <input
                type="url"
                value={content?.footer?.socialMedia?.instagram || ''}
                onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                className="input-field"
                placeholder="https://instagram.com/maisonfernanda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Twitter</label>
              <input
                type="url"
                value={content?.footer?.socialMedia?.twitter || ''}
                onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                className="input-field"
                placeholder="https://twitter.com/maisonfernanda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pinterest</label>
              <input
                type="url"
                value={content?.footer?.socialMedia?.pinterest || ''}
                onChange={(e) => updateSocialMedia('pinterest', e.target.value)}
                className="input-field"
                placeholder="https://pinterest.com/maisonfernanda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">TikTok</label>
              <input
                type="url"
                value={content?.footer?.socialMedia?.tiktok || ''}
                onChange={(e) => updateSocialMedia('tiktok', e.target.value)}
                className="input-field"
                placeholder="https://tiktok.com/@maisonfernanda"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-white p-6 border border-warm-taupe/20">
          <h3 className="text-xl font-playfair mb-4">Copyright</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Texto de Copyright</label>
            <input
              type="text"
              value={content?.footer?.copyright?.text || ''}
              onChange={(e) => updateFooterField('copyright', 'text', e.target.value)}
              className="input-field"
              placeholder="© 2025 Maison Fernanda. Todos los derechos reservados."
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveFooter}
            disabled={saving}
            className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '💾 Guardando...' : '💾 Guardar Footer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterEditor;

