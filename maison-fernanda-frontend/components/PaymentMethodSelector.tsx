import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PaymentMethodSelectorProps {
  onPaymentMethodSelect: (method: string) => void;
  selectedMethod: string;
  loading: boolean;
}

interface PaymentMethodType {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  type: string;
  instructions?: {
    customer?: string;
  };
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onPaymentMethodSelect,
  selectedMethod,
  loading
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodType[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${API_URL}/api/payment-methods/public`);
      
      if (response.data.success && response.data.data.length > 0) {
        setPaymentMethods(response.data.data);
        
        // Seleccionar el primer método por defecto
        const defaultMethod = response.data.data.find((m: any) => m.isDefault);
        const firstMethod = defaultMethod || response.data.data[0];
        onPaymentMethodSelect(firstMethod.name);
      } else {
        toast.error('No hay métodos de pago disponibles. Por favor contacta al administrador.');
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Error al cargar métodos de pago');
    } finally {
      setLoadingMethods(false);
    }
  };

  if (loadingMethods) {
    return (
      <div className="space-y-6">
        <h2 className="font-playfair text-2xl mb-6">Método de Pago</h2>
        <div className="text-center py-8">
          <div className="spinner mx-auto"></div>
          <p className="text-sm text-deep-taupe/60 mt-4">Cargando métodos de pago...</p>
        </div>
      </div>
    );
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="font-playfair text-2xl mb-6">Método de Pago</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">No hay métodos de pago disponibles en este momento.</p>
          <p className="text-sm text-yellow-600 mt-2">Por favor contacta al administrador.</p>
        </div>
      </div>
    );
  }

  const getColorClasses = (type: string) => {
    const colors: Record<string, { base: string; selected: string }> = {
      cash_on_delivery: {
        base: 'border-green-200 hover:border-green-400',
        selected: 'border-green-500 bg-green-50'
      },
      stripe: {
        base: 'border-blue-200 hover:border-blue-400',
        selected: 'border-blue-500 bg-blue-50'
      },
      bank_transfer: {
        base: 'border-purple-200 hover:border-purple-400',
        selected: 'border-purple-500 bg-purple-50'
      }
    };
    
    return colors[type] || {
      base: 'border-gray-200 hover:border-gray-400',
      selected: 'border-gray-500 bg-gray-50'
    };
  };

  const selectedPaymentMethod = paymentMethods.find(m => m.name === selectedMethod);

  return (
    <div className="space-y-6">
      <h2 className="font-playfair text-2xl mb-6">Método de Pago</h2>

      {/* Selección de método de pago */}
      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const colors = getColorClasses(method.type);
          return (
            <div
              key={method.name}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedMethod === method.name
                  ? colors.selected
                  : colors.base
              }`}
              onClick={() => onPaymentMethodSelect(method.name)}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">{method.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{method.displayName}</h3>
                  <p className="text-sm text-deep-taupe/60">{method.description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 ${
                  selectedMethod === method.name
                    ? 'border-deep-taupe bg-deep-taupe'
                    : 'border-warm-taupe'
                }`}>
                  {selectedMethod === method.name && (
                    <div className="w-full h-full rounded-full bg-white scale-50"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mostrar instrucciones del método seleccionado */}
      {selectedPaymentMethod && selectedPaymentMethod.instructions?.customer && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-playfair text-xl mb-4">{selectedPaymentMethod.icon} {selectedPaymentMethod.displayName}</h3>
          <div 
            className="text-sm text-blue-700 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedPaymentMethod.instructions.customer }}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
