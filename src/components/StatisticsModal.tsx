
import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: any;
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose, strategy }) => {
  const [zoom, setZoom] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const images = strategy ? [
    `./img/estatisticas/${strategy.magic}_1.png`,
    `./img/estatisticas/${strategy.magic}_2.png`,
    `./img/estatisticas/${strategy.magic}_3.png`
  ] : [];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 1));
    if (zoom <= 1.2) {
      setPosX(0);
      setPosY(0);
    }
  };
  const handleResetZoom = () => {
    setZoom(1);
    setPosX(0);
    setPosY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setStartX(e.clientX - posX);
    setStartY(e.clientY - posY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    
    const newX = e.clientX - startX;
    const newY = e.clientY - startY;
    
    setPosX(newX);
    setPosY(newY);
  };

  const resetImageState = () => {
    setZoom(1);
    setPosX(0);
    setPosY(0);
    setIsDragging(false);
  };

  useEffect(() => {
    if (isOpen) {
      resetImageState();
    }
  }, [isOpen, currentImage]);

  if (!strategy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="text-2xl">📷</div>
            Estatísticas: Magic {strategy.magic}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          {/* Resumo das Estatísticas */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {strategy.lucroTotal.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">Lucro Total</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {strategy.assertividade.toFixed(1)}%
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
              <div className="text-2xl font-bold text-green-600">
                {strategy.vencedoras}
              </div>
              <div className="text-sm text-gray-500">Vencedoras</div>
            </div>
          </div>

          {/* Controles de Zoom */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 1}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500 min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
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
              {currentImage + 1} de {images.length}
            </Badge>
          </div>

          {/* Imagem com Zoom */}
          <div 
            className="mb-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-hidden relative cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
          >
            <div className="flex justify-center items-center h-full">
              <img
                src={images[currentImage]}
                alt={`Estatística ${currentImage + 1}`}
                style={{ 
                  transform: `translate(${posX}px, ${posY}px) scale(${zoom})`,
                  cursor: isDragging ? 'grabbing' : zoom > 1 ? 'grab' : 'default'
                }}
                className="max-w-full h-auto transition-transform duration-200 select-none"
                draggable={false}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
          </div>

          {/* Navegação */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentImage(prev => Math.max(0, prev - 1));
              }}
              disabled={currentImage === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            
            <div className="flex gap-2">
              {images.map((_, index) => (
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
              onClick={() => {
                setCurrentImage(prev => Math.min(images.length - 1, prev + 1));
              }}
              disabled={currentImage === images.length - 1}
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
