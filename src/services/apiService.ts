
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
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
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
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const config = this.getConfig();
    if (!config) {
      throw new Error('API não configurada');
    }

    const headers: Record<string, string> = {
      ...config.headers,
    };

    if (config.apiKey) {
      headers['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const url = `${config.baseUrl}${endpoint}`;
    console.log(`Fazendo requisição para: ${url}`);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
        mode: 'cors',
      });

      console.log(`Resposta da API: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados JSON recebidos:', data);
      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  async getStrategies(): Promise<Strategy[]> {
    try {
      // Usar o endpoint /dados da sua API
      const data = await this.makeRequest('/dados');
      
      console.log('Dados recebidos da API:', data);
      
      if (!Array.isArray(data)) {
        console.error('API não retornou um array:', data);
        throw new Error('Formato de dados inválido da API');
      }
      
      // Mapear os dados da sua API para o formato esperado pelo painel
      return data.map((item: any, index: number) => {
        const assertividade = item.total_operacoes > 0 
          ? (item.vencedoras / item.total_operacoes) * 100 
          : 0;
          
        return {
          id: item.magic || index + 1,
          name: `Magic ${item.magic}`,
          symbol: item.ativo || 'N/A',
          lucroTotal: parseFloat(item.lucro_total) || 0,
          assertividade: parseFloat(assertividade.toFixed(2)) || 0,
          operacoes: parseInt(item.total_operacoes) || 0,
          status: 'active',
          color: this.getRandomColor(),
          // Manter campos originais para referência
          magic: item.magic,
          inicio: item.inicio,
          ativo: item.ativo,
          total_operacoes: item.total_operacoes,
          vencedoras: item.vencedoras,
          perdedoras: item.perdedoras,
          lucro_total: item.lucro_total,
        };
      });
    } catch (error) {
      console.error('Erro detalhado ao buscar estratégias:', error);
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
