
import React, { useState, useEffect } from 'react';
import { useStrategies } from '@/hooks/useStrategies';
import PageHeader from '@/components/PageHeader';
import SummaryCards from '@/components/SummaryCards';
import FilterControls from '@/components/FilterControls';
import StrategyGrid from '@/components/StrategyGrid';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import ChartModal from '@/components/ChartModal';
import StatisticsModal from '@/components/StatisticsModal';

const Index = () => {
  const { strategies, loading, error, loadHistorico, formatarData } = useStrategies();
  const [darkMode, setDarkMode] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('lucro_total');
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [showChart, setShowChart] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Carregar tema salvo
  useEffect(() => {
    const temaSalvo = localStorage.getItem("temaEscolhido") || "tema-escuro";
    const isDark = temaSalvo === "tema-escuro";
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Salvar tema
  useEffect(() => {
    const novoTema = darkMode ? "tema-escuro" : "tema-claro";
    localStorage.setItem("temaEscolhido", novoTema);
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Função para ordenar estratégias
  const ordenarEstrategias = (lista: any[]) => {
    const copia = [...lista];
    switch(ordenacao) {
      case 'assertividade': 
        return copia.sort((a, b) => b.assertividade - a.assertividade);
      case 'operacoes': 
        return copia.sort((a, b) => b.total_operacoes - a.total_operacoes);
      case 'data': 
        return copia.sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime());
      default: 
        return copia.sort((a, b) => b.lucro_total - a.lucro_total);
    }
  };

  // Filtrar e ordenar estratégias
  const filteredStrategies = ordenarEstrategias(
    strategies.filter(strategy => 
      strategy.magic.toString().includes(filtro.toLowerCase()) ||
      (strategy.ativo || '').toLowerCase().includes(filtro.toLowerCase())
    )
  );

  // Calcular estatísticas
  const totalLucro = strategies.reduce((sum, s) => sum + s.lucro_total, 0);
  const mediaAssertividade = strategies.length > 0 
    ? strategies.reduce((sum, s) => sum + s.assertividade, 0) / strategies.length 
    : 0;
  const totalOperacoes = strategies.reduce((sum, s) => sum + s.total_operacoes, 0);

  const handleViewChart = async (strategy: any) => {
    try {
      const historicoData = await loadHistorico(strategy.magic);
      setSelectedStrategy({ ...strategy, historicoData });
      setShowChart(true);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const handleViewStats = (strategy: any) => {
    setSelectedStrategy(strategy);
    setShowStats(true);
  };

  const handleClearFilters = () => {
    setFiltro('');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <PageHeader darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
        
        <SummaryCards
          totalLucro={totalLucro}
          mediaAssertividade={mediaAssertividade}
          totalOperacoes={totalOperacoes}
        />

        <FilterControls
          filtro={filtro}
          onFiltroChange={setFiltro}
          ordenacao={ordenacao}
          onOrdenacaoChange={setOrdenacao}
        />

        {filteredStrategies.length === 0 ? (
          <EmptyState onClearFilters={handleClearFilters} />
        ) : (
          <StrategyGrid
            strategies={filteredStrategies}
            formatarData={formatarData}
            onViewChart={handleViewChart}
            onViewStats={handleViewStats}
          />
        )}

        <ChartModal
          isOpen={showChart}
          onClose={() => setShowChart(false)}
          strategy={selectedStrategy}
        />
        
        <StatisticsModal
          isOpen={showStats}
          onClose={() => setShowStats(false)}
          strategy={selectedStrategy}
        />
      </div>
    </div>
  );
};

export default Index;
