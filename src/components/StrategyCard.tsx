
import React from 'react';
import { TrendingUp, CheckCircle, BarChart3, Play, Pause, MoreVertical, Trophy, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StrategyCardProps {
  strategy: {
    id: number;
    name: string;
    symbol: string;
    lucroTotal: number;
    assertividade: number;
    operacoes: number;
    status: string;
    color: string;
    magic?: number;
    inicio?: string;
    ativo?: string;
    vencedoras?: number;
    perdedoras?: number;
  };
  onViewChart: () => void;
  onViewStats: () => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onViewChart, onViewStats }) => {
  const formatarData = (dataString?: string) => {
    if (!dataString) return 'N/A';
    try {
      return new Date(dataString).toLocaleDateString('pt-BR');
    } catch {
      return dataString;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${strategy.color}`} />
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              🧠 Magic {strategy.magic || strategy.id}
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onViewChart}>
                📊 Ver Gráfico
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewStats}>
                📷 Estatísticas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            📊 {strategy.ativo || strategy.symbol}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            🕒 {formatarData(strategy.inicio)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {strategy.lucroTotal.toFixed(2)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                💰 Lucro Total
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Target className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {strategy.assertividade.toFixed(2)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                🎯 Assertividade
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <BarChart3 className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {strategy.operacoes}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ✅ Operações
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Trophy className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {strategy.vencedoras || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                🏆 Vencedoras
              </div>
            </div>
          </div>
          
          {strategy.perdedoras !== undefined && (
            <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
              <span className="text-sm text-red-600 dark:text-red-400">
                ❌ Perdedoras: {strategy.perdedoras}
              </span>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewChart}
              className="flex-1"
            >
              📊 Gráfico
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewStats}
              className="flex-1"
            >
              📷 Stats
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyCard;
