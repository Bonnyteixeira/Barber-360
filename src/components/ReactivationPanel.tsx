import React, { useState } from 'react';
import { Sparkles, Calendar, TrendingUp, Users, Send, CheckCircle, AlertCircle, Bot, MessageSquare, Plus, Trash2 } from 'lucide-react';

interface ReactivationCampaign {
  id: string;
  name: string;
  triggerType: 'ausente_30' | 'sexta_vaga' | 'promocao' | 'pos_atendimento';
  enabled: boolean;
  messageTemplate: string;
  targetCount: number;
}

const INITIAL_CAMPAIGNS: ReactivationCampaign[] = [
  {
    id: 'camp-1',
    name: 'Cliente Ausente há 30 dias',
    triggerType: 'ausente_30',
    enabled: true,
    messageTemplate: 'Fala {NOME}! Já faz um mês que você deu aquele trato no degradê. Que tal reservar um horário hoje com o {BARBEIRO_PREFERIDO}? Temos vagas acessíveis no Barber 360.',
    targetCount: 18
  },
  {
    id: 'camp-2',
    name: 'Sexta-feira à Tarde Vazia',
    triggerType: 'sexta_vaga',
    enabled: true,
    messageTemplate: 'Fala irmão {NOME}, de boa? O fim de semana tá batendo e pintaram 2 horários vagos com o mestre {BARBEIRO_PREFERIDO} agora à tarde. Quer garantir o seu?',
    targetCount: 12
  },
  {
    id: 'camp-3',
    name: 'Agradecimento & Avaliação pós-corte',
    triggerType: 'pos_atendimento',
    enabled: true,
    messageTemplate: 'Chefe {NOME}! Passando para agradecer a preferência de hoje. De 0 a 10, o que achou do trato dado pelo {BARBEIRO_PREFERIDO}? Responda aqui!',
    targetCount: 45
  }
];

interface EligibleClient {
  id: string;
  name: string;
  phone: string;
  lastVisitDays: number;
  barber: string;
}

const ELIGIBLE_CLIENTS: EligibleClient[] = [
  { id: 'cli-1', name: 'Rodrigo Fontes', phone: '(21) 98122-4455', lastVisitDays: 34, barber: 'Diego Barbear' },
  { id: 'cli-2', name: 'Marcos Paulo', phone: '(21) 97001-3311', lastVisitDays: 45, barber: 'Lucas Navalha' },
  { id: 'cli-3', name: 'Gustavo Santos', phone: '(21) 99112-2342', lastVisitDays: 31, barber: 'Rodrigo Cortes' },
  { id: 'cli-4', name: 'Arthur Henrique', phone: '(21) 98822-1199', lastVisitDays: 30, barber: 'Lucas Navalha' }
];

export default function ReactivationPanel() {
  const [campaigns, setCampaigns] = useState<ReactivationCampaign[]>(INITIAL_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<ReactivationCampaign>(INITIAL_CAMPAIGNS[0]);
  const [simulationSentCount, setSimulationSentCount] = useState<number>(142);
  const [sentSuccessId, setSentSuccessId] = useState<string | null>(null);
  
  // Custom form state to add campaigns
  const [showAddForm, setShowAddForm] = useState(false);
  const [campName, setCampName] = useState('');
  const [campTemplate, setCampTemplate] = useState('');
  const [campTrigger, setCampTrigger] = useState<ReactivationCampaign['triggerType']>('promocao');

  const handleToggleCampaign = (id: string) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };

  const handleSaveCampaignDetail = (e: React.FormEvent) => {
    e.preventDefault();
    setCampaigns(campaigns.map(c => c.id === selectedCampaign.id ? selectedCampaign : c));
    alert('Configurações da campanha atualizadas com sucesso!');
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName || !campTemplate) return;

    const newCamp: ReactivationCampaign = {
      id: 'camp-' + Math.random().toString(36).substr(2, 9),
      name: campName,
      triggerType: campTrigger,
      enabled: true,
      messageTemplate: campTemplate,
      targetCount: Math.floor(Math.random() * 25) + 5
    };

    setCampaigns([...campaigns, newCamp]);
    setSelectedCampaign(newCamp);
    setShowAddForm(false);
    
    setCampName('');
    setCampTemplate('');
  };

  const handleDeleteCampaign = (id: string) => {
    if (campaigns.length === 1) {
      alert('Você precisa manter pelo menos uma campanha ativa.');
      return;
    }
    const filtered = campaigns.filter(c => c.id !== id);
    setCampaigns(filtered);
    setSelectedCampaign(filtered[0]);
  };

  const executeBulkReactivation = (id: string, count: number) => {
    setSentSuccessId(id);
    setSimulationSentCount(prev => prev + count);
    setTimeout(() => {
      setSentSuccessId(null);
    }, 3000);
  };

  return (
    <div id="reactivation-ai-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: Campaign Manager */}
      <div className="space-y-6 lg:col-span-1">
        <div className="bg-graphite-panel border border-graphite-border p-5 rounded-none flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#b87333]/90 font-mono">Automações de Reação</h3>
            <p className="text-[10px] text-gray-400 font-sans mt-0.5">Disparos de engajamento no WhatsApp</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-1 px-2.5 bg-copper text-graphite-dark hover:bg-copper-light text-xs font-mono font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Criar
          </button>
        </div>

        {/* Create Campaign Popup */}
        {showAddForm && (
          <form onSubmit={handleCreateCampaign} className="bg-graphite-panel border border-copper p-4 space-y-3.5">
            <h4 className="text-xs uppercase tracking-widest text-copper font-mono font-bold">Nova Campanha Inteligente</h4>
            
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-mono block">Nome amigável</label>
              <input
                type="text"
                required
                placeholder="Ex: Campanha Dia dos Namorados"
                value={campName}
                onChange={(e) => setCampName(e.target.value)}
                className="w-full px-3 py-2 bg-graphite-dark border border-graphite-border text-xs text-gray-200 focus:outline-none focus:border-copper"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-mono block">Gatilho de Ação</label>
              <select
                value={campTrigger}
                onChange={(e) => setCampTrigger(e.target.value as ReactivationCampaign['triggerType'])}
                className="w-full text-xs bg-graphite-dark border border-graphite-border text-gray-200 px-1 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="promocao">🏷️ Disparo Promocional Customizado</option>
                <option value="ausente_30">⏱️ Inatividade por mais de 30 dias</option>
                <option value="sexta_vaga">🔥 Horário Ocioso Sexta-feira</option>
                <option value="pos_atendimento">💬 Pós-atendimento / Feedback</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-mono block">Template de Mensagem</label>
              <textarea
                required
                placeholder="Ex: Fala {NOME}, no clima de romance, que tal dar aquele corte hoje..."
                value={campTemplate}
                onChange={(e) => setCampTemplate(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-graphite-dark border border-graphite-border text-xs text-gray-200 focus:outline-none focus:border-copper resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 text-xs pt-1 border-t border-graphite-border">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-2 py-1 text-gray-500 hover:text-gray-300 font-mono">Cancelar</button>
              <button type="submit" className="px-3 py-1 bg-copper text-graphite-dark font-bold font-mono">Ativar Campanha</button>
            </div>
          </form>
        )}

        <div className="space-y-2.5">
          {campaigns.map(camp => {
            const isSelected = selectedCampaign.id === camp.id;
            return (
              <div
                key={camp.id}
                onClick={() => { setSelectedCampaign(camp); setShowAddForm(false); }}
                className={`p-4 border cursor-pointer transition ${isSelected ? 'bg-copper/5 border-copper/60' : 'bg-graphite-panel border-graphite-border hover:border-[#444]'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 text-[9px] uppercase font-mono border ${camp.enabled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-gray-600/10 border-gray-600/30 text-gray-500'}`}>
                    {camp.enabled ? 'Ativo' : 'Inativo'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCampaign(camp.id);
                      }}
                      className="text-[9px] uppercase font-bold font-mono tracking-wider text-gray-500 hover:text-gray-300 px-1.5 py-0.5 bg-black/30 border border-graphite-border"
                    >
                      {camp.enabled ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCampaign(camp.id);
                      }}
                      className="text-gray-500 hover:text-red-400"
                      title="Excluir campanha"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h4 className="text-xs font-bold font-sans text-gray-200 truncate">{camp.name}</h4>
                <p className="text-[10px] text-gray-500 font-mono mt-1 font-medium">{camp.targetCount} Clientes Elegíveis Hoje</p>
              </div>
            );
          })}
        </div>

        {/* Global Statistics */}
        <div className="p-5 bg-graphite-panel border border-graphite-border rounded-none space-y-3">
          <h4 className="text-[10px] font-bold font-mono uppercase text-gray-500 tracking-widest border-b border-graphite-border pb-1.5">Métricas de Reativação</h4>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-black/25 p-3 border border-graphite-border">
              <span className="text-[9px] text-gray-500 block uppercase font-mono">Disparos Feitos</span>
              <span className="text-xl font-bold font-mono text-copper">{simulationSentCount}</span>
            </div>
            <div className="bg-black/25 p-3 border border-graphite-border">
              <span className="text-[9px] text-gray-500 block uppercase font-mono">Retorno Agendado</span>
              <span className="text-xl font-bold font-mono text-emerald-400">42.2%</span>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Selected Campaign Settings & Simulation (2/3 space) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Campaign Editing Form */}
        <div className="bg-graphite-panel border border-graphite-border p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-graphite-border pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-copper font-mono">Parâmetros de Disparo IA</h3>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">Campanha: {selectedCampaign.name}</p>
            </div>
            <span className="px-2.5 py-1 bg-[#C37A4C]/10 border border-copper/15 text-xs text-copper font-mono uppercase tracking-wider">
              {selectedCampaign.triggerType}
            </span>
          </div>

          <form onSubmit={handleSaveCampaignDetail} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400 font-mono">Nome de Exibição Corporativa</label>
              <input
                type="text"
                value={selectedCampaign.name}
                onChange={(e) => setSelectedCampaign({ ...selectedCampaign, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-graphite-dark border border-graphite-border text-xs text-gray-200 focus:outline-none focus:border-copper font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-gray-400 font-mono">Estrutura de Redação (Template)</label>
                <span className="text-[9px] text-gray-500 font-mono">Suporta Tags: {'{NOME}'}, {'{BARBEIRO_PREFERIDO}'}</span>
              </div>
              <textarea
                value={selectedCampaign.messageTemplate}
                onChange={(e) => setSelectedCampaign({ ...selectedCampaign, messageTemplate: e.target.value })}
                rows={4}
                className="w-full px-3.5 py-2.5 bg-graphite-dark border border-graphite-border text-xs text-gray-200 focus:outline-none focus:border-copper font-sans resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-gray-500 italic flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-copper" />
                Variáveis dinâmicas de grounding são unificadas com a base de dados.
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-graphite-dark border border-[#444] text-gray-300 hover:text-copper transition font-mono text-xs cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>

        {/* Simulated Eligible Clients list from database - Bulk Dispatch trigger */}
        <div className="bg-graphite-panel border border-graphite-border p-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-graphite-border pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#b87333]/90 font-mono flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Clientes Elegíveis para essa Campanha ({selectedCampaign.targetCount})
              </h3>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">Identificados hoje pelo robô Barber 360 no banco de dados.</p>
            </div>

            {sentSuccessId === selectedCampaign.id ? (
              <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> Disparado!
              </span>
            ) : (
              <button
                type="button"
                onClick={() => executeBulkReactivation(selectedCampaign.id, selectedCampaign.targetCount)}
                className="px-4 py-1.5 bg-copper hover:bg-copper-light text-graphite-dark font-bold font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer duration-150"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simular Envio WhatsApp</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ELIGIBLE_CLIENTS.map(cli => {
              // Simulate parsed message preview matching the template variables
              const previewMessage = selectedCampaign.messageTemplate
                .replace('{NOME}', cli.name)
                .replace('{BARBEIRO_PREFERIDO}', cli.barber);

              return (
                <div key={cli.id} className="bg-graphite-dark/50 border border-graphite-border p-3.5 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-gray-200">{cli.name}</h4>
                      <p className="text-[10px] text-gray-500 font-sans">{cli.phone}</p>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-red-950/20 text-red-400 border border-red-500/15">
                      Ausente há {cli.lastVisitDays} dias
                    </span>
                  </div>
                  <div className="bg-black/20 p-2.5 border border-[#333] text-[10px] text-gray-400 font-sans italic leading-relaxed">
                    "{previewMessage}"
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-gray-500 font-sans leading-snug">
            📌 <strong>Como funciona o disparo inteligente?</strong> O Barber 360 não é invasivo. Ele verifica se o cliente possui agendamentos futuros antes de disparar. O envio ocorre através da inteligência artificial simulando uma atendente tradicional preocupada com o visual de seu cliente preferido, garantindo 100% de elegibilidade e conformidade com o WhatsApp Business Policy.
          </p>
        </div>

      </div>

    </div>
  );
}
