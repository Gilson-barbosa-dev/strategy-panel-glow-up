
import { useState, useEffect } from 'react';
import { apiService, Strategy } from '@/services/apiService';

export const useStrategies = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache key e tempo como na sua implementação
  const cacheKey = 'estrategias_cache';
  const cacheTimeKey = 'estrategias_cache_time';
  const cacheTime = 60000; // 60 segundos

  // Dados mockados como fallback
  const mockStrategies: Strategy[] = [
    {
      id: 1,
      name: 'Magic 1',
      symbol: 'PETR4',
      lucroTotal: 25.8,
      assertividade: 78,
      operacoes: 142,
      status: 'active',
      color: 'bg-emerald-500'
    },
    {
      id: 2,
      name: 'Magic 2',
      symbol: 'VALE3',
      lucroTotal: 18.5,
      assertividade: 65,
      operacoes: 98,
      status: 'active',
      color: 'bg-blue-500'
    }
  ];

  const fetchStrategies = async () => {
    setLoading(true);
    setError(null);

    // Verificar cache primeiro (como na sua implementação)
    const now = Date.now();
    const lastFetch = parseInt(localStorage.getItem(cacheTimeKey) || '0', 10);
    
    if (now - lastFetch < cacheTime) {
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        if (cached && cached.length > 0) {
          console.log('Usando cache de estratégias');
          setStrategies(cached);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.log('Erro ao ler cache, buscando da API');
      }
    }

    // Buscar da API
    try {
      const data = await apiService.getStrategies();
      
      // Salvar no cache como na sua implementação
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheTimeKey, now.toString());
      
      setStrategies(data);
      console.log('Estratégias carregadas da API:', data);
    } catch (err) {
      console.error('Erro ao carregar estratégias:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      
      // Tentar usar cache antigo em caso de erro
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        if (cached && cached.length > 0) {
          setStrategies(cached);
          console.log('Usando cache antigo devido ao erro');
        } else {
          setStrategies(mockStrategies);
        }
      } catch {
        setStrategies(mockStrategies);
      }
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
    isUsingMockData: false, // Agora sempre usa dados reais ou cache
  };
};
