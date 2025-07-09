
import React, { useState } from 'react';
import { Settings, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/apiService';

interface ApiConfigProps {
  onConfigChanged: () => void;
}

const ApiConfig: React.FC<ApiConfigProps> = ({ onConfigChanged }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [customHeaders, setCustomHeaders] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const currentConfig = apiService.getConfig();

  const handleSave = () => {
    const headers: Record<string, string> = {};
    
    if (customHeaders.trim()) {
      try {
        const parsed = JSON.parse(customHeaders);
        Object.assign(headers, parsed);
      } catch (error) {
        alert('Headers inválidos. Use formato JSON válido.');
        return;
      }
    }

    apiService.setConfig({
      baseUrl: baseUrl.replace(/\/$/, ''), // Remove trailing slash
      apiKey: apiKey || undefined,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });

    setIsOpen(false);
    onConfigChanged();
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      // Temporarily set config for testing
      const tempHeaders: Record<string, string> = {};
      if (customHeaders.trim()) {
        Object.assign(tempHeaders, JSON.parse(customHeaders));
      }

      const testConfig = {
        baseUrl: baseUrl.replace(/\/$/, ''),
        apiKey: apiKey || undefined,
        headers: Object.keys(tempHeaders).length > 0 ? tempHeaders : undefined,
      };

      const originalConfig = apiService.getConfig();
      apiService.setConfig(testConfig);

      await apiService.getStrategies();
      setTestResult('success');

      // Restore original config if test was successful but user hasn't saved
      if (originalConfig) {
        apiService.setConfig(originalConfig);
      }
    } catch (error) {
      console.error('Teste da API falhou:', error);
      setTestResult('error');
    } finally {
      setTesting(false);
    }
  };

  const resetForm = () => {
    if (currentConfig) {
      setBaseUrl(currentConfig.baseUrl);
      setApiKey(currentConfig.apiKey || '');
      setCustomHeaders(currentConfig.headers ? JSON.stringify(currentConfig.headers, null, 2) : '');
    } else {
      // Valores padrão com sua API
      setBaseUrl('https://apirobos-production.up.railway.app');
      setApiKey('');
      setCustomHeaders('');
    }
    setTestResult(null);
  };

  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          API Configurada
          <Badge variant="default" className="ml-1 bg-green-500">
            Conectado
          </Badge>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configuração da API</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-green-50 p-4 rounded-md">
            <h4 className="font-medium text-green-900 mb-2">✅ API Conectada</h4>
            <p className="text-sm text-green-800">
              Sua API está configurada e funcionando: <br/>
              <code className="bg-green-100 px-2 py-1 rounded">
                https://apirobos-production.up.railway.app/dados
              </code>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              URL Base da API *
            </label>
            <Input
              placeholder="https://apirobos-production.up.railway.app"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              URL base da sua API (sem a barra final)
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Chave da API (opcional)
            </label>
            <Input
              type="password"
              placeholder="sua-api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Será enviada como Bearer token no header Authorization
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Headers Customizados (JSON)
            </label>
            <textarea
              className="w-full min-h-[100px] p-3 text-sm border rounded-md"
              placeholder='{"X-Custom-Header": "valor", "Another-Header": "valor"}'
              value={customHeaders}
              onChange={(e) => setCustomHeaders(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Headers adicionais em formato JSON (opcional)
            </p>
          </div>

          {testResult && (
            <div className={`p-3 rounded-md flex items-center gap-2 ${
              testResult === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {testResult === 'success' ? (
                <Check className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {testResult === 'success' 
                ? 'Conexão com a API funcionando! Dados carregados.' 
                : 'Erro ao conectar com a API. Verifique as configurações.'
              }
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Formato da Sua API</h4>
            <p className="text-sm text-blue-800 mb-2">
              Sua API retorna dados no endpoint <code>/dados</code> com esta estrutura:
            </p>
            <pre className="text-xs bg-blue-100 p-2 rounded overflow-x-auto">
{`[
  {
    "magic": 123,
    "inicio": "2024-01-01",
    "ativo": "PETR4",
    "total_operacoes": 50,
    "vencedoras": 35,
    "perdedoras": 15,
    "assertividade": 70.5,
    "lucro_total": 25.8
  }
]`}
            </pre>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={!baseUrl || testing}
          >
            {testing ? 'Testando...' : 'Testar Conexão'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!baseUrl}
          >
            Salvar Configuração
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiConfig;
