
interface ApiConfig {
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

interface Strategy {
  id: number;
  name: string;
  symbol: string;
  lucroTotal: number;
  assertividade: number;
  operacoes: number;
  status: string;
  color: string;
}

class ApiService {
  private config: ApiConfig | null = null;

  setConfig(config: ApiConfig) {
    this.config = config;
    localStorage.setItem('apiConfig', JSON.stringify(config));
  }

  getConfig(): ApiConfig | null {
    if (this.config) return this.config;
    
    const stored = localStorage.getItem('apiConfig');
    if (stored) {
      this.config = JSON.parse(stored);
      return this.config;
    }
    
    return null;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const config = this.getConfig();
    if (!config) {
      throw new Error('API não configurada');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const response = await fetch(`${config.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getStrategies(): Promise<Strategy[]> {
    try {
      const data = await this.makeRequest('/strategies');
      
      // Normalizar os dados da API para o formato esperado
      return data.map((item: any) => ({
        id: item.id || Math.random(),
        name: item.name || item.strategy_name || 'Estratégia',
        symbol: item.symbol || item.ticker || 'N/A',
        lucroTotal: item.lucroTotal || item.profit || item.total_profit || 0,
        assertividade: item.assertividade || item.accuracy || item.win_rate || 0,
        operacoes: item.operacoes || item.operations || item.total_operations || 0,
        status: item.status || (item.active ? 'active' : 'paused'),
        color: item.color || this.getRandomColor(),
      }));
    } catch (error) {
      console.error('Erro ao buscar estratégias:', error);
      throw error;
    }
  }

  private getRandomColor(): string {
    const colors = [
      'bg-emerald-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-teal-500',
      'bg-indigo-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  isConfigured(): boolean {
    return this.getConfig() !== null;
  }
}

export const apiService = new ApiService();
export type { Strategy, ApiConfig };
