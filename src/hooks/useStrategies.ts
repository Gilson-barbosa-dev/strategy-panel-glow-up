
import { useState, useEffect } from 'react';

interface Strategy {
  magic: number;
  inicio: string;
  ativo: string;
  total_operacoes: number;
  vencedoras: number;
  perdedoras: number;
  assertividade: number;
  lucro_total: number;
}

interface HistoricoItem {
  data: string;
  lucro_total: string | number;
}

export const useStrategies = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStrategies = async () => {
    const cacheKey = 'estrategias_cache';
    const cacheTimeKey = 'estrategias_cache_time';
    const cacheTime = 60000;
    const now = Date.now();
    const lastFetch = parseInt(localStorage.getItem(cacheTimeKey) || '0', 10);

    // Tentar carregar do cache primeiro
    if (now - lastFetch < cacheTime) {
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        if (cached.length > 0) {
          setStrategies(cached);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error('Erro ao carregar cache:', e);
      }
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://apirobos-production.up.railway.app/dados');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheTimeKey, now.toString());
      setStrategies(data);
      setLoading(false);
    } catch (erro) {
      console.error('Erro ao carregar estratégias:', erro);
      setError('Erro ao carregar estratégias. Verifique sua conexão.');
      setLoading(false);
      
      // Tentar carregar dados em cache mesmo que expirado
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]');
        if (cached.length > 0) {
          setStrategies(cached);
          setError('Dados em cache. Conexão com servidor indisponível.');
        }
      } catch (e) {
        console.error('Erro ao carregar cache como fallback:', e);
      }
    }
  };

  const loadHistorico = async (magic: number): Promise<HistoricoItem[]> => {
    try {
      const response = await fetch(`https://apirobos-production.up.railway.app/historico_detalhado/${magic}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return [];
    }
  };

  const formatarData = (dataGMT: string) => {
    if (!dataGMT) return '—';
    try {
      const data = new Date(dataGMT);
      return data.toLocaleString('pt-BR', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false, 
        timeZone: 'UTC'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '—';
    }
  };

  useEffect(() => {
    loadStrategies();
  }, []);

  return {
    strategies,
    loading,
    error,
    loadHistorico,
    formatarData,
    refetch: loadStrategies
  };
};
