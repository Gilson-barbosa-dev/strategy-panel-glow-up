
import React from 'react';
import StrategyCard from './StrategyCard';

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

interface StrategyGridProps {
  strategies: Strategy[];
  formatarData: (date: string) => string;
  onViewChart: (strategy: Strategy) => void;
  onViewStats: (strategy: Strategy) => void;
}

const StrategyGrid: React.FC<StrategyGridProps> = ({
  strategies,
  formatarData,
  onViewChart,
  onViewStats
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {strategies.map((strategy) => (
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
          onViewChart={() => onViewChart(strategy)}
          onViewStats={() => onViewStats(strategy)}
        />
      ))}
    </div>
  );
};

export default StrategyGrid;
