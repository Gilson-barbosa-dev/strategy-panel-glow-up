
import React, { useEffect, useRef } from 'react';
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
    if (isOpen && strategy && strategy.historicoData && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // Limpar canvas
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        
        // Processar dados do histórico
        const labels: string[] = [];
        const lucroAcumulado: number[] = [];
        let acumulado = 0;

        for (const item of strategy.historicoData) {
          let lucro = parseFloat(
            typeof item.lucro_total === "string" 
              ? item.lucro_total.replace(",", ".") 
              : item.lucro_total
          );
          if (isNaN(lucro)) lucro = 0;
          
          labels.push(item.data);
          acumulado += lucro;
          lucroAcumulado.push(acumulado);
        }

        const hasDados = labels.length > 0 && lucroAcumulado.some(l => l !== 0);
        
        if (hasDados) {
          // Determinar tema
          const temaEscuro = document.documentElement.classList.contains('dark');
          const corTexto = temaEscuro ? "#ffffff" : "#111111";
          const corLinha = temaEscuro ? "#00ffb3" : "#00b89c";
          
          // Configurar fundo
          ctx.fillStyle = temaEscuro ? '#0e0e0e' : '#ffffff';
          ctx.fillRect(0, 0, width, height);
          
          // Desenhar grid
          ctx.strokeStyle = temaEscuro ? '#333333' : '#e5e7eb';
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

          // Desenhar linha do gráfico
          if (lucroAcumulado.length > 0) {
            const minLucro = Math.min(...lucroAcumulado);
            const maxLucro = Math.max(...lucroAcumulado);
            const range = maxLucro - minLucro || 1;
            
            ctx.strokeStyle = corLinha;
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            for (let i = 0; i < lucroAcumulado.length; i++) {
              const x = (i / (lucroAcumulado.length - 1)) * width;
              const y = height - ((lucroAcumulado[i] - minLucro) / range) * height;
              
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.stroke();
            
            // Adicionar pontos
            ctx.fillStyle = corLinha;
            for (let i = 0; i < lucroAcumulado.length; i++) {
              const x = (i / (lucroAcumulado.length - 1)) * width;
              const y = height - ((lucroAcumulado[i] - minLucro) / range) * height;
              
              ctx.beginPath();
              ctx.arc(x, y, 4, 0, 2 * Math.PI);
              ctx.fill();
            }
          }
        } else {
          // Sem dados
          ctx.fillStyle = temaEscuro ? '#ffffff' : '#999999';
          ctx.font = '20px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Nenhum dado disponível', width / 2, height / 2);
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
            <div className="text-2xl">📊</div>
            Histórico: Magic {strategy.magic}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6">
          <div className="mb-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {strategy.lucro_total?.toFixed(2) || '0.00'}
              </div>
              <div className="text-sm text-gray-500">Lucro Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {strategy.assertividade?.toFixed(1) || '0.0'}%
              </div>
              <div className="text-sm text-gray-500">Assertividade</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {strategy.total_operacoes || 0}
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
