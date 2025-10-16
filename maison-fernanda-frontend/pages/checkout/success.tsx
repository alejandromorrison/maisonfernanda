import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useStore from '@/store/useStore';

const CheckoutSuccessPage = () => {
  const router = useRouter();
  const { clearCart } = useStore();
  const { session_id } = router.query;

  useEffect(() => {
    // Clear cart on successful checkout
    clearCart();
  }, []);

  return (
    <Layout title="Pedido Confirmado - Maison Fernanda">
      <div className="container-custom py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <svg
              className="w-20 h-20 mx-auto text-gold"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="heading-lg mb-4">¡Gracias por tu Pedido!</h1>
          <p className="text-body mb-8">
            Tu pedido ha sido confirmado y será enviado pronto. Recibirás un correo de confirmación en breve.
          </p>

          {session_id && (
            <p className="text-sm text-deep-taupe/60 mb-8">
              ID del Pedido: {session_id}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account" className="btn-primary">
              Ver Pedidos
            </Link>
            <Link href="/collection" className="btn-secondary">
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccessPage;

