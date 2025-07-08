
import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: any;
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose, strategy }) => {
  const [zoom, setZoom] = useState(100);
  const [currentImage, setCurrentImage] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  const mockImages = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  if (!strategy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${strategy.color}`} />
            Estatísticas - {strategy.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          {/* Resumo das Estatísticas */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {strategy.lucroTotal.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Lucro Total</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {strategy.assertividade}%
              </div>
              <div className="text-sm text-gray-500">Assertividade</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {strategy.operacoes}
              </div>
              <div className="text-sm text-gray-500">Operações</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {(strategy.lucroTotal / strategy.operacoes).toFixed(2)}%
              </div>
              <div className="text-sm text-gray-500">Lucro/Op</div>
            </div>
          </div>

          {/* Controles de Zoom */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500 min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetZoom}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <Badge variant="secondary">
              {currentImage + 1} de {mockImages.length}
            </Badge>
          </div>

          {/* Imagem com Zoom */}
          <div className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto">
            <div className="flex justify-center">
              <img
                src={mockImages[currentImage]}
                alt={`Estatística ${currentImage + 1}`}
                style={{ transform: `scale(${zoom / 100})` }}
                className="max-w-full h-auto transition-transform duration-200"
              />
            </div>
          </div>

          {/* Navegação */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentImage(prev => Math.max(0, prev - 1))}
              disabled={currentImage === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            
            <div className="flex gap-2">
              {mockImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImage
                      ? 'bg-blue-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setCurrentImage(prev => Math.min(mockImages.length - 1, prev + 1))}
              disabled={currentImage === mockImages.length - 1}
            >
              Próxima
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatisticsModal;
