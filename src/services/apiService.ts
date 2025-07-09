
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
  // Campos específicos da sua API
  magic?: number;
  inicio?: string;
  ativo?: string;
  total_operacoes?: number;
  vencedoras?: number;
  perdedoras?: number;
  lucro_total?: number;
}

class ApiService {
  private config: ApiConfig | null = null;

  constructor() {
    // Configuração padrão com sua API
    this.setConfig({
      baseUrl: 'https://apirobos-production.up.railway.app',
      headers: {}
    });
  }

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
    
    // Fallback para sua API
    return {
      baseUrl: 'https://apirobos-production.up.railway.app',
      headers: {}
    };
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
      // Usar o endpoint /dados da sua API
      const data = await this.makeRequest('/dados');
      
      // Mapear os dados da sua API para o formato esperado pelo painel
      return data.map((item: any, index: number) => ({
        id: item.magic || index + 1,
        name: `Magic ${item.magic}`,
        symbol: item.ativo || 'N/A',
        lucroTotal: item.lucro_total || 0,
        assertividade: item.assertividade || 0,
        operacoes: item.total_operacoes || 0,
        status: 'active', // Assumindo que todas estão ativas
        color: this.getRandomColor(),
        // Manter campos originais para referência
        magic: item.magic,
        inicio: item.inicio,
        ativo: item.ativo,
        total_operacoes: item.total_operacoes,
        vencedoras: item.vencedoras,
        perdedoras: item.perdedoras,
        lucro_total: item.lucro_total,
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
