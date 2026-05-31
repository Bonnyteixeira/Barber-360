import React, { useState, useRef, useEffect } from 'react';
import { Agent, Message, SalonSettings } from '../types';
import { 
  Send, 
  Bot, 
  User, 
  Trash2, 
  Sparkles, 
  Scissors, 
  AlertCircle, 
  RefreshCcw,
  CheckCircle2,
  Terminal,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSectorColor, getSectorIcon } from './AgentCard';

interface ChatSandboxProps {
  agents: Agent[];
  salonSettings: SalonSettings;
}

const TEMPLATE_PROMPTS: Record<string, string[]> = {
  'Atendimento/Recepção': [
    'Preciso agendar barba e corte para sexta-feira às 18h com algum barbeiro.',
    'Quais serviços vocês oferecem na barbearia e quais são os horários?',
    'Quem são os barbeiros experientes trabalhando no momento?'
  ],
  'Financeiro/Contabilidade': [
    'Se eu fizer 35 cortes de R$ 60 esse mês, pagando 50% de comissão, quanto sobra para a casa?',
    'Quais são as melhores dicas para reduzir o desperdício de insumos como pomadas e giletes?',
    'Como posso planejar o capital de giro ideal para pagar o aluguel de R$1.800?'
  ],
  'Marketing/Redes Sociais': [
    'Gere ideias criativas de posts de Instagram para promover o corte degradê em dias fracos.',
    'Escreva uma mensagem magnética para Whatsapp chamando clientes sumidos há 30 dias para voltar.',
    'Elabore uma campanha "Traga um amigo e comemore o aniversário com um combo promocional".'
  ],
  'Estoque/Fornecedores': [
    'Como posso calcular a quantidade ideal de pomadas secas e modeladoras para comprar mês que vem?',
    'Se o meu lote de óleos de barba custou R$ 15 e vendo por R$ 40, qual a minha margem de lucro real?',
    'Quais insumos de higienização essenciais eu preciso comprar de forma preventiva para as bancadas?'
  ],
  'Gerência/Estratégia': [
    'Quero aumentar o corte em R$10 porque a luz subiu. Como comunico isso de forma profissional?',
    'Vale a pena oferecer cerveja artesanal artesanal cortesia? Qual o retorno médio esperado?',
    'Crie um plano de metas de satisfação do cliente para motivar meus profissionais de cabelo.'
  ]
};

export default function ChatSandbox({ agents, salonSettings }: ChatSandboxProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(agents[0] || null);
  
  // Keep threads persistent state during dashboard sessions
  const [threads, setThreads] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  // Sync selected agent if empty initially but agents loaded
  useEffect(() => {
    if (!selectedAgent && agents.length > 0) {
      setSelectedAgent(agents[0]);
    }
  }, [agents, selectedAgent]);

  // Scroll to bottom every time messages or loading updates
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, selectedAgent, loading]);

  // Get current messages list
  const currentMessages = selectedAgent ? (threads[selectedAgent.id] || [
    {
      id: 'greeting',
      role: 'model',
      content: selectedAgent.greetingMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]) : [];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || !selectedAgent) return;
    setError('');

    const userMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    // Update current thread locally
    const currentThreadMessages = threads[selectedAgent.id] || [
      {
        id: 'greeting',
        role: 'model',
        content: selectedAgent.greetingMessage,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ];

    const updatedThread = [...currentThreadMessages, userMsg];
    setThreads({
      ...threads,
      [selectedAgent.id]: updatedThread
    });

    setInput('');
    setLoading(true);

    try {
      // Call Express server-side Gemini API Proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: {
            name: selectedAgent.name,
            sector: selectedAgent.sector,
            instructions: selectedAgent.instructions
          },
          messages: updatedThread.map(m => ({
            role: m.role,
            content: m.content
          })),
          salonSettings
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Erro ao conectar-se ao agente de IA.');
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: Math.random().toString(),
        role: 'model',
        content: data.content || 'Instruções processadas, porém o agente retornou resposta vazia.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev => ({
        ...prev,
        [selectedAgent.id]: [...updatedThread, assistantMsg]
      }));

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro de comunicação de rede com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (!selectedAgent) return;
    setThreads({
      ...threads,
      [selectedAgent.id]: [
        {
          id: 'greeting',
          role: 'model',
          content: selectedAgent.greetingMessage,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]
    });
    setError('');
  };

  const selectActiveAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setError('');
  };

  return (
    <div id="sandbox-container" className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-graphite-panel border border-graphite-border rounded-none overflow-hidden shadow-xl min-h-[580px] h-[72vh]">
      
      {/* LEFT: Agent Selector Bar (1/4 space) */}
      <div className="lg:col-span-1 border-r border-graphite-border bg-black/10 p-4 flex flex-col justify-between h-full overflow-y-auto">
        <div>
          <h3 className="text-[10px] font-bold tracking-widest text-[#b87333]/90 uppercase font-mono mb-4 flex items-center justify-between border-b border-graphite-border pb-2.5">
            <span>Selecione o Agente</span>
            <span className="px-1.5 py-0.5 rounded-none bg-black/40 border border-[#333] text-gray-500 text-[9px]">{agents.length} Criados</span>
          </h3>
          
          <div className="space-y-2">
            {agents.map((agent) => {
              const isSelected = selectedAgent?.id === agent.id;
              const online = agent.status === 'online';

              return (
                <button
                  key={agent.id}
                  onClick={() => selectActiveAgent(agent)}
                  className={`w-full p-3.5 text-left rounded-none flex items-center gap-3 cursor-pointer border transition-all duration-200 ${
                    isSelected 
                      ? 'bg-copper/10 border-copper/60 text-white shadow-md shadow-black/25 font-bold font-mono' 
                      : 'bg-graphite-dark/50 border-transparent hover:bg-neutral-800/25 hover:border-graphite-border text-gray-400'
                  }`}
                >
                  <div className="w-9 h-9 rounded-none bg-graphite-dark border border-[#333] flex items-center justify-center text-base shadow-inner">
                    {agent.avatarSeed}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold leading-tight truncate ${isSelected ? 'text-gray-100' : 'text-gray-300'}`}>{agent.name}</h4>
                      <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-emerald-500' : 'bg-gray-600'}`} />
                    </div>
                    <span className="text-[9px] uppercase font-mono tracking-wider mt-1 block truncate text-[#b87333]/90">
                      {agent.sector}
                    </span>
                  </div>
                </button>
              );
            })}

            {agents.length === 0 && (
              <p className="text-xs text-gray-600 italic py-6 text-center font-sans">Nenhum agente ativo. Vá no painel principal criá-los!</p>
            )}
          </div>
        </div>

        {/* Knowledge injections indicator list */}
        <div className="pt-4 border-t border-graphite-border mt-4 space-y-2.5">
          <div className="flex items-center gap-2 text-[10px] text-gray-505 font-mono uppercase tracking-widest">
            <CheckCircle2 className="w-3.5 h-3.5 text-copper" />
            <span>Conhecimento Ativo</span>
          </div>
          <div className="text-[10px] text-gray-400 leading-snug space-y-1.5 bg-black/20 p-3 border border-graphite-border rounded-none">
            <p>✂️ {salonSettings.name || 'Barbearia local'}</p>
            <p>🏷️ {salonSettings.services?.length || 0} Serviços Catalogados</p>
            <p>💈 {salonSettings.barbers?.length || 0} Barbeiros Escalados</p>
          </div>
        </div>

      </div>

      {/* RIGHT: Messenger layout (3/4 space) */}
      <div className="lg:col-span-3 flex flex-col justify-between h-full bg-graphite-dark">
        
        {/* Chat Header details */}
        {selectedAgent ? (
          <div className="p-4 bg-graphite-panel border-b border-graphite-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-graphite-dark border border-[#333] flex items-center justify-center text-lg">
                {selectedAgent.avatarSeed}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-gray-100">{selectedAgent.name}</h3>
                  <div className={`px-2 py-0.5 text-[9px] font-mono rounded-none border flex items-center gap-1 ${getSectorColor(selectedAgent.sector)}`}>
                    {getSectorIcon(selectedAgent.sector)}
                    <span>{selectedAgent.sector}</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 font-sans truncate mt-1 max-w-[280px] sm:max-w-md">
                  Instrução ativa: {selectedAgent.instructions}
                </p>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="text-gray-500 hover:text-red-400 p-2 rounded-none bg-graphite-dark border border-graphite-border hover:border-red-500/20 transition cursor-pointer"
              title="Resetar conversa"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-600 font-sans italic flex-1 flex flex-col items-center justify-center">
            Selecione um agente à esquerda para iniciar o sandbox.
          </div>
        )}

        {/* Messages feed area */}
        {selectedAgent && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
            
            {/* Warning banner if Gemini key simulated default */}
            {error && (
              <div className="p-4 bg-red-950/40 border border-red-500/30 rounded-none text-red-300 text-xs flex items-start gap-2.5 w-full">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Falha no servidor de IA</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Visual sender badge */}
                <div className={`w-8 h-8 rounded-none flex items-center justify-center text-xs flex-shrink-0 border ${
                  msg.role === 'user' 
                    ? 'bg-[#1C1E21] border-[#333] text-gray-400' 
                    : 'bg-copper/10 border-copper/35 text-copper'
                }`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div className="space-y-1">
                  <div className={`p-3.5 rounded-none text-xs sm:text-sm leading-relaxed overflow-hidden ${
                    msg.role === 'user'
                      ? 'bg-copper text-graphite-dark font-bold'
                      : 'bg-graphite-panel border border-graphite-border text-gray-200 font-sans'
                  }`}>
                    {/* Preserve line breaks */}
                    {msg.content.split('\n').map((para, i) => (
                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>{para}</p>
                    ))}
                  </div>
                  <span className={`text-[9px] text-gray-400 font-mono tracking-wider block ${
                    msg.role === 'user' ? 'text-right' : 'text-left'
                  }`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Simulated Typist Indicator */}
            {loading && (
              <div className="flex gap-3 mr-auto max-w-[80%]">
                <div className="w-8 h-8 rounded-none flex items-center justify-center text-xs flex-shrink-0 border bg-copper/10 border-copper/35 text-copper">
                  <Bot className="w-3.5 h-3.5 animate-bounce" />
                </div>
                <div className="bg-graphite-panel border border-graphite-border p-3.5 rounded-none flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={threadEndRef} />
          </div>
        )}

        {/* Suggestion prompt chips container and form input footer */}
        {selectedAgent && (
          <div className="p-4 bg-graphite-panel border-t border-graphite-border space-y-4">
            
            {/* Quick Testing Suggestions Cloud */}
            <div>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono flex items-center gap-1.5 mb-2.5">
                <HelpCircle className="w-3.5 h-3.5 text-copper" />
                Perguntas Rápidas de Teste ({selectedAgent.sector})
              </span>
              <div className="flex flex-wrap gap-2 max-h-[75px] overflow-y-auto">
                {TEMPLATE_PROMPTS[selectedAgent.sector]?.map((promptStr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={loading}
                    onClick={() => handleSend(promptStr)}
                    className="px-3 py-1.5 bg-graphite-dark hover:bg-copper/10 border border-[#333] hover:border-copper/35 text-gray-400 hover:text-copper rounded-none text-[10px] text-left transition duration-150 cursor-pointer disabled:opacity-50 font-mono font-medium"
                  >
                    "{promptStr}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Mande sua mensagem ou simulação para ${selectedAgent.name}...`}
                disabled={loading}
                className="flex-1 bg-graphite-dark border border-[#333] focus:border-copper rounded-none px-4 py-3 text-xs sm:text-sm text-gray-200 placeholder-gray-600 focus:outline-none transition duration-150 disabled:opacity-75 font-sans"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-3 bg-copper hover:bg-copper-light disabled:bg-[#222] disabled:border-graphite-border border border-transparent disabled:text-gray-600 text-graphite-dark rounded-none transition cursor-pointer flex-shrink-0 flex items-center justify-center active:scale-95 duration-150"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

      </div>

    </div>
  );
}
