
import React from 'react';
import { TrendingUp, CheckCircle, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryCardsProps {
  totalLucro: number;
  mediaAssertividade: number;
  totalOperacoes: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalLucro,
  mediaAssertividade,
  totalOperacoes
}) => {
  return (
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
  );
};

export default SummaryCards;
