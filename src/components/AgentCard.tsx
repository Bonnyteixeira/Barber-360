import { Agent, SectorType } from '../types';
import { 
  Scissors, 
  DollarSign, 
  Share2, 
  PackageOpen, 
  TrendingUp, 
  Bot, 
  MessageCircle, 
  Settings, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';

interface AgentCardProps {
  key?: string;
  agent: Agent;
  onChat: (agent: Agent) => void;
  onEdit: (agent: Agent) => void;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function getSectorColor(sector: SectorType): string {
  switch (sector) {
    case 'Atendimento/Recepção':
      return 'border-copper/45 text-copper bg-copper/10';
    case 'Financeiro/Contabilidade':
      return 'border-emerald-600/45 text-emerald-400 bg-emerald-500/10';
    case 'Marketing/Redes Sociais':
      return 'border-purple-600/45 text-purple-400 bg-purple-500/10';
    case 'Estoque/Fornecedores':
      return 'border-blue-600/45 text-blue-400 bg-blue-500/10';
    case 'Gerência/Estratégia':
      return 'border-amber-600/45 text-amber-400 bg-amber-500/10';
    default:
      return 'border-gray-600/45 text-gray-400 bg-gray-500/10';
  }
}

export function getSectorIcon(sector: SectorType) {
  switch (sector) {
    case 'Atendimento/Recepção':
      return <Scissors className="w-4 h-4 rotate-45" />;
    case 'Financeiro/Contabilidade':
      return <DollarSign className="w-4 h-4" />;
    case 'Marketing/Redes Sociais':
      return <Share2 className="w-4 h-4" />;
    case 'Estoque/Fornecedores':
      return <PackageOpen className="w-4 h-4" />;
    case 'Gerência/Estratégia':
      return <TrendingUp className="w-4 h-4" />;
    default:
      return <Bot className="w-4 h-4" />;
  }
}

export default function AgentCard({ agent, onChat, onEdit, onToggleStatus, onDelete }: AgentCardProps) {
  const isOnline = agent.status === 'online';

  return (
    <div id={`agent-${agent.id}`} className="bg-graphite-panel border border-graphite-border hover:border-copper/40 rounded-none p-5 relative overflow-hidden transition-all duration-300 group shadow-lg flex flex-col justify-between">
      {/* Decorative gradient corner glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-copper/10 to-transparent rounded-bl-full pointer-events-none group-hover:from-copper/18 transition duration-300" />
      
      <div>
        {/* Header sector pill and status */}
        <div className="flex items-center justify-between mb-4">
          <div className={`px-2.5 py-1 rounded-sm text-xs font-mono font-medium border flex items-center gap-1.5 ${getSectorColor(agent.sector)}`}>
            {getSectorIcon(agent.sector)}
            <span>{agent.sector}</span>
          </div>
          <button 
            onClick={() => onToggleStatus(agent.id)}
            className="text-gray-400 hover:text-copper cursor-pointer transition flex items-center gap-1"
            title={isOnline ? "Desativar agente" : "Ativar agente"}
          >
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Ativo
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                Inativo
              </span>
            )}
          </button>
        </div>

        {/* Agent Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-sm bg-gradient-to-tr from-[#222] to-graphite-dark border border-[#333] flex items-center justify-center text-xl shadow-inner text-gray-300 font-serif">
            {agent.avatarSeed}
          </div>
          <div>
            <h3 className="font-bold text-gray-100 group-hover:text-copper transition duration-200">{agent.name}</h3>
            <p className="text-xs text-gray-500 font-sans mt-1 leading-relaxed line-clamp-2">
              {agent.instructions || "Nenhuma instrução especial configurada."}
            </p>
          </div>
        </div>
      </div>

      {/* Actions split footer */}
      <div className="border-t border-graphite-border pt-4 mt-2 flex items-center justify-between">
        <button
          onClick={() => onEdit(agent)}
          className="text-xs text-gray-400 hover:text-gray-200 font-mono flex items-center gap-1 cursor-pointer transition"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Configurar</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onDelete(agent.id)}
            className="text-xs text-red-500/70 hover:text-red-400 font-mono px-2 py-1 rounded hover:bg-neutral-900 transition cursor-pointer"
          >
            Excluir
          </button>
          
          <button
            onClick={() => onChat(agent)}
            className="text-xs bg-copper/10 text-copper hover:bg-copper hover:text-graphite-dark px-3.5 py-1.5 rounded-none border border-copper/20 transition flex items-center gap-1.5 cursor-pointer font-bold font-mono uppercase"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Testar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
