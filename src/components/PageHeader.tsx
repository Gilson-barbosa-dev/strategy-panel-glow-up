
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

interface PageHeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ darkMode, onToggleDarkMode }) => {
  return (
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
        onClick={onToggleDarkMode}
        className="self-start lg:self-center"
      >
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default PageHeader;
