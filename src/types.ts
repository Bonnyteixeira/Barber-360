export type SectorType = 
  | 'Atendimento/Recepção' 
  | 'Financeiro/Contabilidade' 
  | 'Marketing/Redes Sociais' 
  | 'Estoque/Fornecedores' 
  | 'Gerência/Estratégia';

export interface Agent {
  id: string;
  name: string;
  sector: SectorType;
  instructions: string;
  avatarSeed: string; // Used to seed custom visual indicators or unique icons
  createdAt: string;
  status: 'online' | 'offline';
  greetingMessage: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
}

export interface SalonSettings {
  name: string;
  address: string;
  phone: string;
  hours: string;
  services: ServiceItem[];
  barbers: string[];
}

export interface ChatThread {
  agentId: string;
  messages: Message[];
}
