
import React from 'react';
import { TrendingUp, CheckCircle, BarChart3, Play, Pause, MoreVertical } from 'lucide-react';
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
  };
  onViewChart: () => void;
  onViewStats: () => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onViewChart, onViewStats }) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${strategy.color}`} />
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {strategy.name}
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
                Ver Gráfico
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onViewStats}>
                Ver Estatísticas
              </DropdownMenuItem>
              <DropdownMenuItem>
                Editar Estratégia
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {strategy.symbol}
          </Badge>
          <Badge 
            variant={strategy.status === 'active' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {strategy.status === 'active' ? (
              <>
                <Play className="h-3 w-3 mr-1" />
                Ativo
              </>
            ) : (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Pausado
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {strategy.lucroTotal.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Lucro Total
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {strategy.assertividade}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Assertividade
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
                Operações
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewChart}
              className="flex-1"
            >
              📈 Gráfico
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onViewStats}
              className="flex-1"
            >
              📊 Stats
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyCard;
