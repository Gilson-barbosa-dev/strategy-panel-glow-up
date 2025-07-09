
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, CheckCircle, BarChart3, Moon, Sun, Plus, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StrategyCard from '@/components/StrategyCard';
import ChartModal from '@/components/ChartModal';
import StatisticsModal from '@/components/StatisticsModal';
import ApiConfig from '@/components/ApiConfig';
import { useStrategies } from '@/hooks/useStrategies';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState('lucro_total');
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const { strategies, loading, error, refetch, isUsingMockData } = useStrategies();

  const filteredStrategies = strategies
    .filter(strategy => 
      strategy.name.toLowerCase().includes(filtro.toLowerCase()) ||
      strategy.symbol.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => {
      switch(ordenacao) {
        case 'lucro_total': return b.lucroTotal - a.lucroTotal;
        case 'assertividade': return b.assertividade - a.assertividade;
        case 'operacoes': return b.operacoes - a.operacoes;
        default: return 0;
      }
    });

  const totalLucro = strategies.reduce((sum, s) => sum + s.lucroTotal, 0);
  const mediaAssertividade = strategies.length > 0 
    ? strategies.reduce((sum, s) => sum + s.assertividade, 0) / strategies.length 
    : 0;
  const totalOperacoes = strategies.reduce((sum, s) => sum + s.operacoes, 0);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleApiConfigChanged = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Carregando estratégias...</p>
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
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
              Gerencie e monitore suas estratégias de investimento
              {isUsingMockData && (
                <Badge variant="secondary" className="text-xs">
                  Dados de Demonstração
                </Badge>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <ApiConfig onConfigChanged={handleApiConfigChanged} />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">
              ⚠️ {error} - Exibindo dados de demonstração.
            </p>
          </div>
        )}

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
              <div className="text-3xl font-bold">{totalLucro.toFixed(1)}%</div>
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
              <div className="text-3xl font-bold">{mediaAssertividade.toFixed(0)}%</div>
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
                  placeholder="🔍 Buscar por estratégia ou ativo..."
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
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={refetch}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Nova Estratégia
              </Button>
            </div>
          </div>
        </div>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrategies.map((strategy) => (
            <StrategyCard
              key={strategy.id}
              strategy={strategy}
              onViewChart={() => {
                setSelectedStrategy(strategy);
                setShowChart(true);
              }}
              onViewStats={() => {
                setSelectedStrategy(strategy);
                setShowStats(true);
              }}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredStrategies.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma estratégia encontrada
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Tente ajustar seus filtros ou configurar sua API
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
