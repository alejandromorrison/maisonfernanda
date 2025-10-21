import React, { useState, useEffect } from 'react';
import { siteContent } from '@/lib/api';
import toast from 'react-hot-toast';

const ContentEditor: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
      toast.error('Error al cargar contenido');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await siteContent.update(content);
      toast.success('Contenido actualizado exitosamente');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Error al guardar contenido');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-playfair text-2xl mb-6">Editor de Contenido del Sitio</h2>
      
      <div className="bg-white p-6 border border-warm-taupe/20">
        <h3 className="text-xl font-playfair mb-4">Contenido Principal</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Título Principal</label>
            <input
              type="text"
              value={content?.heroTitle || ''}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Subtítulo</label>
            <textarea
              value={content?.heroSubtitle || ''}
              onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
              className="input-field min-h-[100px]"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Descripción de la Empresa</label>
            <textarea
              value={content?.aboutText || ''}
              onChange={(e) => setContent({ ...content, aboutText: e.target.value })}
              className="input-field min-h-[120px]"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
        >
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </div>
  );
};

export default ContentEditor;