
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FilterControlsProps {
  filtro: string;
  onFiltroChange: (value: string) => void;
  ordenacao: string;
  onOrdenacaoChange: (value: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filtro,
  onFiltroChange,
  ordenacao,
  onOrdenacaoChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="🔍 Buscar por Magic ou Ativo..."
              value={filtro}
              onChange={(e) => onFiltroChange(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={ordenacao} onValueChange={onOrdenacaoChange}>
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
  );
};

export default FilterControls;
