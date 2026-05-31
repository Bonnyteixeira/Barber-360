import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  MessageSquare, 
  Sliders, 
  Play, 
  Settings2, 
  Smile, 
  Award,
  Zap,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import ModuleLayout, { SubPageSpec } from '../../components/ModuleLayout';

export const aiRoutes: SubPageSpec[] = [
  { id: 'agents', name: 'Atendentes Virtuais', icon: <Cpu className="w-3.5 h-3.5" /> },
  { id: 'personalidades', name: 'Personalidades', icon: <Smile className="w-3.5 h-3.5" /> },
  { id: 'simulator', name: 'Simulador IA Workbench', icon: <Play className="w-3.5 h-3.5" /> }
];

export default function AiModule() {
  const [personality, setPersonality] = useState('friendly');
  const [activePrompt, setActivePrompt] = useState(
    'Você é "Heitor AI", atendente virtual da barbearia do Heitor. Responda sempre de forma amistosa, use gírias leves de barbeações e promova descontos do CRM se o cliente estiver inativo há muito tempo.'
  );

  const [simulatorInput, setSimulatorInput] = useState('');
  const [simulatorLog, setSimulatorLog] = useState<any[]>([
    { sender: 'user', text: 'Quais horários vocês têm livres amanhã?' },
    { sender: 'ai', text: 'Fala! Tudo firme? Amanhã temos vagas incríveis com o Diego às 14h, e com o Lucas às 15:15. Algum desses encaixa na sua régua?' }
  ]);

  const [showPromptSaveAlert, setShowPromptSaveAlert] = useState(false);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatorInput.trim()) return;

    const userMsg = { sender: 'user', text: simulatorInput };
    let responseText = 'Entendi! Só um segundo enquanto busco essa informação na nossa agenda...';

    if (simulatorInput.toLowerCase().includes('corte') || simulatorInput.toLowerCase().includes('horário') || simulatorInput.toLowerCase().includes('vaga')) {
      responseText = 'Temos vagas com Diego às 17h ou 18h amanhã. Quer que eu reserve para você?';
    } else if (simulatorInput.toLowerCase().includes('preço') || simulatorInput.toLowerCase().includes('valor')) {
      responseText = 'O corte degradê social custa R$ 60,00 e leva em média 45 minutos. Vamos agendar?';
    } else if (simulatorInput.toLowerCase().includes('vip') || simulatorInput.toLowerCase().includes('desconto')) {
      responseText = 'Como você é um cliente VIP super especial da barbearia, posso aplicar um bônus especial de 10% no seu próximo serviço. Que tal amanhã às 14h?';
    }

    setSimulatorLog([...simulatorLog, userMsg, { sender: 'ai', text: responseText }]);
    setSimulatorInput('');
  };

  return (
    <ModuleLayout
      moduleName="Inteligência Artificial Engine"
      modulePath="Client Platform"
      description="Gerencie os robôs autônomos que atendem o WhatsApp do salão. Configure tonalidades linguísticas, ajuste prompts estruturais e simule o comportamento dialógico."
      subPages={aiRoutes}
      quickCards={[
        { title: 'Taxa Autonomia', value: '88.4%', change: '+3.1%', type: 'positive' },
        { title: 'Conversão em Agendas', value: '34 %', change: '+2.8%', type: 'positive' },
        { title: 'Custos Gemini Token', value: 'R$ 12,45', change: 'Econômico', type: 'positive' },
        { title: 'Modelo Utilizado', value: 'Gemini 2.5 Flash', change: 'Ultra-rápido', type: 'positive' }
      ]}
      secondarySidebarHeader="Configurar Gateway de IA"
      secondarySidebarContent={
        <div className="space-y-4 text-xs font-sans text-gray-450">
          <div>
            <span className="text-[10px] uppercase font-mono text-copper font-bold block mb-1.5">Afinamento de Diálogos</span>
            <p className="text-[11px] leading-relaxed">
              O Barber 360 utiliza o LLM mais avançado da Google para realizar agendamentos dinâmicos interpretando a linguagem cotidiana do cliente.
            </p>
          </div>

          <div className="bg-[#151618] border border-graphite-border p-3 space-y-2 font-mono text-[10px]">
            <span className="text-[9px] uppercase font-bold text-copper block">Automações Ativas</span>
            <div className="flex gap-2 items-center">
              <input type="checkbox" defaultChecked className="accent-copper cursor-pointer" />
              <span>Agendamento autônomo</span>
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" defaultChecked className="accent-copper cursor-pointer" />
              <span>Oferecer ociosidades</span>
            </div>
          </div>
        </div>
      }
    >
      {(activeSubPageId) => {
        if (activeSubPageId === 'agents') {
          return (
            <div className="space-y-6">
              {showPromptSaveAlert && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3.5 text-xs font-mono">
                  ✓ Prompt do sistema atualizado com sucesso no banco de dados do tenant. O agente começará a utilizar o novo comportamento nas próximas conversas imediatamente.
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Rules details */}
                <div className="border border-graphite-border bg-[#141517] p-5 space-y-4">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 block">System Instructions (Prompt de Contexto)</h4>
                  <div className="space-y-2">
                    <p className="text-[11px] text-gray-500">Este prompt dita as regras fundamentais pelas quais o agente virtual irá sanar dúvidas, negociar preços e efetuar marcações de horários.</p>
                    <textarea 
                      value={activePrompt}
                      onChange={(e) => setActivePrompt(e.target.value)}
                      className="w-full bg-[#101112] min-h-[150px] text-xs font-mono p-3 text-gray-300 border border-graphite-border focus:outline-none focus:border-copper select-all leading-relaxed"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={() => {
                          setShowPromptSaveAlert(true);
                          setTimeout(() => setShowPromptSaveAlert(false), 4000);
                        }}
                        className="px-4 py-1.5 bg-copper text-graphite-dark font-sans font-bold text-xs hover:bg-copper/90 transition"
                      >
                        Salvar Instruções
                      </button>
                    </div>
                  </div>
                </div>

                {/* Automation triggers */}
                <div className="border border-graphite-border bg-[#141517] p-5 space-y-4">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 block">Trigger de Inteligência de Retenção</h4>
                  <div className="space-y-3.5 font-sans text-xs text-gray-400">
                    <div className="flex justify-between items-center bg-[#111214] p-3 border border-graphite-border">
                      <div>
                        <strong className="text-gray-300 block">Reativação Automática</strong>
                        <span className="text-[10px] text-gray-500">Dispara campanha se o cliente não comparecer por mais de X dias</span>
                      </div>
                      <select className="bg-graphite-panel border border-graphite-border p-1 text-gray-300 font-mono text-[11px]">
                        <option>30 dias</option>
                        <option>45 dias</option>
                        <option>60 dias</option>
                      </select>
                    </div>

                    <div className="flex justify-between items-center bg-[#111214] p-3 border border-graphite-border">
                      <div>
                        <strong className="text-gray-300 block">Recuperação de Cancelamentos</strong>
                        <span className="text-[10px] text-gray-500">Manda oferta de reagendamento em menos de 1 minuto</span>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-copper cursor-pointer" />
                    </div>

                    <div className="flex justify-between items-center bg-[#111214] p-3 border border-graphite-border">
                      <div>
                        <strong className="text-gray-300 block">Horários Ociosos Otimizados</strong>
                        <span className="text-[10px] text-gray-500">Detecta janelas vagas e localiza clientes de alta propensão</span>
                      </div>
                      <input type="checkbox" defaultChecked className="accent-copper cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'personalidades') {
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div 
                  onClick={() => setPersonality('friendly')}
                  className={`p-4 border text-center transition cursor-pointer ${personality === 'friendly' ? 'border-copper bg-copper/5 text-copper' : 'border-graphite-border text-gray-400 hover:border-gray-700'}`}
                >
                  <Smile className="w-5 h-5 mx-auto mb-2 text-copper" />
                  <strong className="text-xs font-mono uppercase block">Amistosa</strong>
                  <span className="text-[9px] text-gray-500 font-sans block mt-1">Usa emojis, hospitalidade, tom caloroso de boas-vindas.</span>
                </div>

                <div 
                  onClick={() => setPersonality('professional')}
                  className={`p-4 border text-center transition cursor-pointer ${personality === 'professional' ? 'border-copper bg-copper/5 text-copper' : 'border-graphite-border text-gray-400 hover:border-gray-700'}`}
                >
                  <Award className="w-5 h-5 mx-auto mb-2 text-copper" />
                  <strong className="text-xs font-mono uppercase block">Formal</strong>
                  <span className="text-[9px] text-gray-500 font-sans block mt-1">Linguagem lapidada, formal, precisa e objetiva.</span>
                </div>

                <div 
                  onClick={() => setPersonality('urban')}
                  className={`p-4 border text-center transition cursor-pointer ${personality === 'urban' ? 'border-copper bg-copper/5 text-copper' : 'border-graphite-border text-gray-400 hover:border-gray-700'}`}
                >
                  <Zap className="w-5 h-5 mx-auto mb-2 text-copper" />
                  <strong className="text-xs font-mono uppercase block">Moderna (Urban)</strong>
                  <span className="text-[9px] text-gray-500 font-sans block mt-1">Gírias urbanas de corte, ritmos breves e casuais.</span>
                </div>

                <div 
                  onClick={() => setPersonality('classic')}
                  className={`p-4 border text-center transition cursor-pointer ${personality === 'classic' ? 'border-copper bg-copper/5 text-copper' : 'border-graphite-border text-gray-400 hover:border-gray-700'}`}
                >
                  <Sliders className="w-5 h-5 mx-auto mb-2 text-copper" />
                  <strong className="text-xs font-mono uppercase block">Retrô/Classic</strong>
                  <span className="text-[9px] text-gray-500 font-sans block mt-1">Inspira o respeito de barbearias tradicionais das antigas.</span>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'simulator') {
          return (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 text-xs font-sans">
                <strong>[Simulador Workbench]</strong> Teste as respostas da Inteligência Artificial em tempo real com base no prompt e na personalidade de tom selecionada acima.
              </div>

              <div className="border border-graphite-border bg-[#101112] max-h-[350px] overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                {simulatorLog.map((log, i) => (
                  <div key={i} className={`flex ${log.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] p-3 border font-sans text-xs ${
                      log.sender === 'user' ? 'bg-[#161719] border-graphite-border text-gray-200' : 'bg-[#C37A4C]/10 border-copper/30 text-gray-200'
                    }`}>
                      <span className="text-[9px] text-[#A28D78] font-mono block mb-1 uppercase font-bold">
                        {log.sender === 'user' ? 'Gatilho de Entrada (Mensagem do Cliente)' : 'Resposta Gerada (Atendente IA)'}
                      </span>
                      <p className="leading-relaxed whitespace-pre-wrap">{log.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSimulate} className="flex gap-2 bg-[#141517] p-2.5 border border-graphite-border">
                <input 
                  type="text" 
                  value={simulatorInput}
                  onChange={(e) => setSimulatorInput(e.target.value)}
                  placeholder="Simule uma dúvida de cliente here (ex: Quero ver preço de corte, ou vaga para amanhã)" 
                  className="flex-1 bg-[#101112] text-xs px-3.5 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper font-sans"
                  required
                />
                <button type="submit" className="px-4.5 py-2 bg-copper text-graphite-dark font-sans font-bold text-xs hover:bg-copper/90 transition flex items-center gap-1 cursor-pointer">
                  <Play className="w-3.5 h-3.5" />
                  Testar Diálogo
                </button>
              </form>
            </div>
          );
        }

        return null;
      }}
    </ModuleLayout>
  );
}
