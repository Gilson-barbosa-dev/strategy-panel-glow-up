
import { useState, useEffect } from 'react';
import { apiService, Strategy } from '@/services/apiService';

export const useStrategies = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dados mockados como fallback
  const mockStrategies: Strategy[] = [
    {
      id: 1,
      name: 'Magic Formula',
      symbol: 'PETR4',
      lucroTotal: 25.8,
      assertividade: 78,
      operacoes: 142,
      status: 'active',
      color: 'bg-emerald-500'
    },
    {
      id: 2,
      name: 'Momentum',
      symbol: 'VALE3',
      lucroTotal: 18.5,
      assertividade: 65,
      operacoes: 98,
      status: 'active',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Value Investing',
      symbol: 'ITUB4',
      lucroTotal: 31.2,
      assertividade: 82,
      operacoes: 76,
      status: 'paused',
      color: 'bg-purple-500'
    }
  ];

  const fetchStrategies = async () => {
    setLoading(true);
    setError(null);

    try {
      if (apiService.isConfigured()) {
        const data = await apiService.getStrategies();
        setStrategies(data);
      } else {
        // Usar dados mockados se API não estiver configurada
        setStrategies(mockStrategies);
      }
    } catch (err) {
      console.error('Erro ao carregar estratégias:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      // Fallback para dados mockados em caso de erro
      setStrategies(mockStrategies);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  return {
    strategies,
    loading,
    error,
    refetch: fetchStrategies,
    isUsingMockData: !apiService.isConfigured(),
  };
};
