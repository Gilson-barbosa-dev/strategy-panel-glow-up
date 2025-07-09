
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: any;
}

const ChartModal: React.FC<ChartModalProps> = ({ isOpen, onClose, strategy }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && strategy && canvasRef.current) {
      // Check if dark mode is active
      const temaEscuro = document.documentElement.classList.contains('dark');
      
      // Simular dados do gráfico
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Limpar canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Configurar canvas
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        
        // Set colors based on theme
        const corTexto = temaEscuro ? "#ffffff" : "#111111";
        const corLinha = temaEscuro ? "#00ffb3" : "#00b89c";
        const corFundo = temaEscuro ? '#0e0e0e' : '#ffffff';
        
        // Fill background
        ctx.fillStyle = corFundo;
        ctx.fillRect(0, 0, width, height);
        
        // Desenhar gráfico de linha simples
        ctx.strokeStyle = corLinha;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Gerar dados mockados baseados na estratégia
        const dataPoints = 20;
        const baseValue = strategy.lucroTotal || strategy.lucro_total || 0;
        
        for (let i = 0; i < dataPoints; i++) {
          const x = (i / (dataPoints - 1)) * width;
          const variance = (Math.random() - 0.5) * 10;
          const y = height / 2 - (baseValue + variance) * 2;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        
        // Adicionar grid
        ctx.strokeStyle = temaEscuro ? '#333' : '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Linhas horizontais
        for (let i = 0; i <= 5; i++) {
          const y = (i / 5) * height;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        
        // Linhas verticais
        for (let i = 0; i <= 10; i++) {
          const x = (i / 10) * width;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
      }
    }
  }, [isOpen, strategy]);

  if (!strategy) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${strategy.color || 'bg-blue-500'}`} />
            Gráfico de Lucro - {strategy.name || `Magic ${strategy.magic}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <div className="mb-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {(strategy.lucroTotal || strategy.lucro_total || 0).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">Lucro Atual</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {strategy.assertividade || 0}%
              </div>
              <div className="text-sm text-gray-500">Assertividade</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {strategy.operacoes || strategy.total_operacoes || 0}
              </div>
              <div className="text-sm text-gray-500">Operações</div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-auto border rounded"
            />
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChartModal;
