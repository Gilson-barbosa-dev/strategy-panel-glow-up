
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, CheckCircle, BarChart3, Moon, Sun, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StrategyCard from '@/components/StrategyCard';
import ChartModal from '@/components/ChartModal';
import StatisticsModal from '@/components/StatisticsModal';
import { useStrategies } from '@/hooks/useStrategies';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando estratégias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Painel de Estratégias
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gerencie e monitore suas estratégias de investimento
            </p>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="self-start lg:self-center"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Lucro Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalLucro.toFixed(2)}</div>
              <p className="text-emerald-100 text-sm">Acumulado em todas as estratégias</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Assertividade Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mediaAssertividade.toFixed(1)}%</div>
              <p className="text-blue-100 text-sm">Taxa de sucesso das operações</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Total de Operações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalOperacoes}</div>
              <p className="text-purple-100 text-sm">Operações realizadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="🔍 Buscar por Magic ou Ativo..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={ordenacao} onValueChange={setOrdenacao}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lucro_total">📈 Lucro Total</SelectItem>
                  <SelectItem value="assertividade">✅ Assertividade</SelectItem>
                  <SelectItem value="operacoes">📊 Operações</SelectItem>
                  <SelectItem value="data">📅 Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrategies.map((strategy) => (
            <StrategyCard
              key={strategy.magic}
              strategy={{
                id: strategy.magic,
                name: `Magic ${strategy.magic}`,
                symbol: strategy.ativo,
                lucroTotal: strategy.lucro_total,
                assertividade: strategy.assertividade,
                operacoes: strategy.total_operacoes,
                status: 'active',
                color: 'bg-emerald-500',
                inicio: formatarData(strategy.inicio),
                vencedoras: strategy.vencedoras,
                perdedoras: strategy.perdedoras,
                magic: strategy.magic
              }}
              onViewChart={() => handleViewChart(strategy)}
              onViewStats={() => handleViewStats(strategy)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredStrategies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma estratégia encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Tente ajustar seus filtros ou aguarde o carregamento
            </p>
            <Button variant="outline" onClick={() => setFiltro('')}>
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Modals */}
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
