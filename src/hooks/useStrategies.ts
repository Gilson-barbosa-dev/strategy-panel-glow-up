
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
      const response = await fetch('https://apirobos-production.up.railway.app/dados');
      const data = await response.json();
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(cacheTimeKey, now.toString());
      setStrategies(data);
      setLoading(false);
    } catch (erro) {
      console.error('Erro ao carregar estratégias:', erro);
      setError('Erro ao carregar estratégias');
      setLoading(false);
    }
  };

  const loadHistorico = async (magic: number): Promise<HistoricoItem[]> => {
    const response = await fetch(`https://apirobos-production.up.railway.app/historico_detalhado/${magic}`);
    return await response.json();
  };

  const formatarData = (dataGMT: string) => {
    if (!dataGMT) return '—';
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
