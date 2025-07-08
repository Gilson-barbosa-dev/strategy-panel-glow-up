
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onClearFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 dark:text-gray-600 text-6xl mb-4">📊</div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Nenhuma estratégia encontrada
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Tente ajustar seus filtros ou aguarde o carregamento
      </p>
      <Button variant="outline" onClick={onClearFilters}>
        Limpar Filtros
      </Button>
    </div>
  );
};

export default EmptyState;
