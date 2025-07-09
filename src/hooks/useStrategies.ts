
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

  // Dados mockados como fallback - usando estrutura similar à sua API
  const mockStrategies: Strategy[] = [
    {
      id: 1,
      name: 'Magic 1',
      symbol: 'PETR4',
      lucroTotal: 25.8,
      assertividade: 78.5,
      operacoes: 142,
      status: 'active',
      color: 'bg-emerald-500',
      magic: 1,
      inicio: '2024-01-15',
      ativo: 'PETR4',
      total_operacoes: 142,
      vencedoras: 111,
      perdedoras: 31,
      lucro_total: 25.8
    },
    {
      id: 2,
      name: 'Magic 2',
      symbol: 'VALE3',
      lucroTotal: 18.5,
      assertividade: 65.2,
      operacoes: 98,
      status: 'active',
      color: 'bg-blue-500',
      magic: 2,
      inicio: '2024-02-01',
      ativo: 'VALE3',
      total_operacoes: 98,
      vencedoras: 64,
      perdedoras: 34,
      lucro_total: 18.5
    },
    {
      id: 3,
      name: 'Magic 3',
      symbol: 'ITUB4',
      lucroTotal: 32.1,
      assertividade: 82.3,
      operacoes: 156,
      status: 'active',
      color: 'bg-purple-500',
      magic: 3,
      inicio: '2024-01-08',
      ativo: 'ITUB4',
      total_operacoes: 156,
      vencedoras: 128,
      perdedoras: 28,
      lucro_total: 32.1
    }
  ];

  const fetchStrategies = async () => {
    setLoading(true);
    setError(null);

    // Verificar cache primeiro
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
        console.log('Erro ao ler cache, tentando API');
      }
    }

    // Tentar buscar da API
    try {
      console.log('Tentando conectar com a API...');
      const data = await apiService.getStrategies();
      
      // Salvar no cache
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheTimeKey, now.toString());
      
      setStrategies(data);
      console.log('Estratégias carregadas da API:', data);
    } catch (err) {
      console.error('Erro ao carregar estratégias:', err);
      
      // Definir mensagem de erro mais clara
      if (err instanceof Error && err.message.includes('Failed to fetch')) {
        setError('Erro de CORS: Sua API precisa permitir requisições do domínio atual');
      } else {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      }
      
      // Tentar usar cache antigo em caso de erro
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        if (cached && cached.length > 0) {
          console.log('Usando cache antigo devido ao erro');
          setStrategies(cached);
        } else {
          console.log('Usando dados de demonstração');
          setStrategies(mockStrategies);
        }
      } catch {
        console.log('Usando dados de demonstração como fallback final');
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
    isUsingMockData: strategies === mockStrategies,
  };
};
