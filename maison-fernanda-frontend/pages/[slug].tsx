import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { pages } from '@/lib/api';
import toast from 'react-hot-toast';

const DynamicPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [pageContent, setPageContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPageContent();
    }
  }, [slug]);

  const fetchPageContent = async () => {
    try {
      const response = await pages.getBySlug(slug as string);
      setPageContent(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.error('Página no encontrada');
        router.push('/');
      } else {
        toast.error('Error al cargar la página');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="Cargando...">
        <div className="flex justify-center py-12">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  if (!pageContent) {
    return (
      <Layout title="Página no encontrada">
        <div className="container-custom py-24 text-center">
          <h1 className="heading-lg mb-4">Página no encontrada</h1>
          <p className="text-body mb-8">La página que buscas no existe.</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Volver al Inicio
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={pageContent.title}
      description={pageContent.metaDescription}
    >
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 border border-warm-taupe/20">
            <MarkdownRenderer content={pageContent.content} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DynamicPage;

