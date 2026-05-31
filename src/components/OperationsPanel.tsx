import React, { useState } from 'react';
import { ShieldCheck, Server, AlertTriangle, MessageSquare, TrendingUp, DollarSign, Users, CheckCircle, Search, HelpCircle, Activity, Play, Pause, Ban, TicketCheck, RefreshCw, Plus } from 'lucide-react';

interface SaaSClient {
  id: string;
  salonName: string;
  ownerName: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  status: 'Ativo' | 'Inadimplente' | 'Bloqueado';
  mrr: number;
  messageCount: number;
  iaPercentage: number;
  waConnected: boolean;
}

const INITIAL_SAAS_CLIENTS: SaaSClient[] = [
  { id: 'saas-1', salonName: 'Barbearia Imperador', ownerName: 'Fábio Teixeira', plan: 'Pro', status: 'Ativo', mrr: 199.00, messageCount: 4230, iaPercentage: 92, waConnected: true },
  { id: 'saas-2', salonName: 'El Patron Barbería', ownerName: 'Carlos M.', plan: 'Starter', status: 'Ativo', mrr: 99.00, messageCount: 1540, iaPercentage: 88, waConnected: true },
  { id: 'saas-3', salonName: 'Barba Luxo SP', ownerName: 'Arnaldo Silva', plan: 'Enterprise', status: 'Ativo', mrr: 499.00, messageCount: 12480, iaPercentage: 96, waConnected: true },
  { id: 'saas-4', salonName: 'Cortes Radicais', ownerName: 'Gelson Dias', plan: 'Pro', status: 'Inadimplente', mrr: 199.00, messageCount: 890, iaPercentage: 45, waConnected: false },
  { id: 'saas-5', salonName: 'Viking Cut Club', ownerName: 'Pedro Martins', plan: 'Starter', status: 'Bloqueado', mrr: 99.00, messageCount: 0, iaPercentage: 0, waConnected: false }
];

interface SupportTicket {
  id: string;
  salonName: string;
  topic: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  status: 'Aberto' | 'Resolvido';
  date: string;
  desc: string;
}

const INITIAL_TICKETS: SupportTicket[] = [
  { id: 'tkt-1', salonName: 'Barbearia Imperador', topic: 'Configuração de Pix', priority: 'Média', status: 'Aberto', date: 'Hoje', desc: 'Cliente deseja saber como configurar oPix da StarkBank na automação final de garantia.' },
  { id: 'tkt-2', salonName: 'Cortes Radicais', topic: 'Instância Desconectada', priority: 'Alta', status: 'Aberto', date: 'Ontem', desc: 'O celular do barbeiro descarregou e a instância Evolution caiu. Não está reconectando.' },
  { id: 'tkt-3', salonName: 'El Patron Barbería', topic: 'Dúvida faturamento', priority: 'Baixa', status: 'Resolvido', date: '28/05/2026', desc: 'Como gerar extrato em PDF da divisão de comissão.' }
];

export default function OperationsPanel() {
  const [clients, setClients] = useState<SaaSClient[]>(INITIAL_SAAS_CLIENTS);
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Operational Metrics
  const [mrrIncrement, setMrrIncrement] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states to add new SaaS client
  const [showAddClient, setShowAddClient] = useState(false);
  const [newSalon, setNewSalon] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newPlan, setNewPlan] = useState<'Starter' | 'Pro' | 'Enterprise'>('Pro');

  const filteredClients = clients.filter(c => 
    c.salonName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleClientStatus = (id: string, currentStatus: SaaSClient['status']) => {
    let nextStatus: SaaSClient['status'] = 'Ativo';
    if (currentStatus === 'Ativo') nextStatus = 'Bloqueado';
    else if (currentStatus === 'Bloqueado') nextStatus = 'Inadimplente';
    
    setClients(clients.map(c => c.id === id ? { ...c, status: nextStatus, waConnected: nextStatus === 'Ativo' } : c));
    showSystemNotification(`Status da barbearia alterado para ${nextStatus}.`);
  };

  const changeClientPlan = (id: string, newPlan: SaaSClient['plan']) => {
    let mrrValue = 99.00;
    if (newPlan === 'Pro') mrrValue = 199.00;
    if (newPlan === 'Enterprise') mrrValue = 499.00;

    setClients(clients.map(c => c.id === id ? { ...c, plan: newPlan, mrr: mrrValue } : c));
    showSystemNotification(`Plano da barbearia migrado para ${newPlan}.`);
  };

  const handleResolveTicket = (id: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Resolvido' } : t));
    showSystemNotification(`Ticket #${id} marcado como resolvido.`);
  };

  const handleCreateSaaSClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSalon || !newOwner) return;

    let mrrValue = 99.00;
    if (newPlan === 'Pro') mrrValue = 199.00;
    if (newPlan === 'Enterprise') mrrValue = 499.00;

    const newC: SaaSClient = {
      id: 'saas-' + (clients.length + 1),
      salonName: newSalon,
      ownerName: newOwner,
      plan: newPlan,
      status: 'Ativo',
      mrr: mrrValue,
      messageCount: 150,
      iaPercentage: 100,
      waConnected: true
    };

    setClients([...clients, newC]);
    setShowAddClient(false);
    setNewSalon('');
    setNewOwner('');
    showSystemNotification(`Barbearia "${newSalon}" credenciada no Barber 360.`);
  };

  const showSystemNotification = (txt: string) => {
    setSuccessMsg(txt);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  // SaaS KPIs Calculations
  const totalMRR = clients
    .filter(c => c.status === 'Ativo')
    .reduce((acc, c) => acc + c.mrr, 0);

  const activeClientsCount = clients.filter(c => c.status === 'Ativo').length;
  const churnRate = "4.2%"; // Mock strategic pricing churn index
  const globalWAApiVolume = clients.reduce((acc, c) => acc + c.messageCount, 0);

  return (
    <div id="saas-operations-platform" className="space-y-6">
      
      {/* Visual top bar warning notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between animate-in slide-in-from-top-4 duration-150 rounded-none">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span className="font-mono">{successMsg}</span>
          </div>
          <span className="text-[9px] uppercase font-mono text-emerald-500">Operação Segura</span>
        </div>
      )}

      {/* OPERATIONS PLATFORM KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 bg-graphite-panel border border-[#C37A4C]/35 rounded-none flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest block">MRR Consolidado SaaS</span>
            <h4 className="text-xl font-bold font-mono text-gray-200 mt-1">R$ {totalMRR.toFixed(2)}</h4>
            <span className="text-[9px] text-[#C37A4C] font-mono flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> +12.4% vs mês anterior
            </span>
          </div>
          <div className="p-3 bg-copper/10 border border-copper/15 rounded-none text-copper">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-graphite-panel border border-[#222] rounded-none flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest block">Barbearias Clientes</span>
            <h4 className="text-xl font-bold font-mono text-gray-200 mt-1">{activeClientsCount} Ativas</h4>
            <span className="text-[9px] text-gray-400 font-mono block mt-1">{clients.length} registradas</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-[#333] rounded-none text-gray-500">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-graphite-panel border border-[#222] rounded-none flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest block">Churn Rate (Perda)</span>
            <h4 className="text-xl font-bold font-mono text-gray-200 mt-1">{churnRate}</h4>
            <span className="text-[9px] text-[#C37A4C] font-mono block mt-1">Garantindo alta fidelidade</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-[#333] rounded-none text-gray-500">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-graphite-panel border border-[#222] rounded-none flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest block">Volume Mensagens (API)</span>
            <h4 className="text-xl font-bold font-mono text-gray-200 mt-1">{globalWAApiVolume}</h4>
            <span className="text-[9px] text-gray-400 font-mono block mt-1">94% automatizado via IA</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-[#333] rounded-none text-gray-500">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT/MID: Barbearias Clients List (2/3 space) */}
        <div className="xl:col-span-2 space-y-4">
          
          <div className="bg-graphite-panel border border-graphite-border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Buscar barbearias por nome ou gestor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-graphite-dark border border-[#333] text-xs text-gray-200 focus:outline-none focus:border-copper font-sans"
              />
            </div>
            
            <button
              onClick={() => setShowAddClient(!showAddClient)}
              className="w-full sm:w-auto px-4 py-2 bg-copper hover:bg-copper-light text-graphite-dark font-bold font-mono text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Cadastro SaaS</span>
            </button>
          </div>

          {/* Add Client mini form popup inline */}
          {showAddClient && (
            <form onSubmit={handleCreateSaaSClient} className="bg-graphite-panel border border-copper p-5 space-y-4 animate-in duration-100">
              <h4 className="text-xs uppercase font-mono font-bold text-copper border-b border-graphite-border pb-2">Nova Barbearia Credenciada</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="text-[10px] text-gray-500 font-mono block mb-1">Nome Fantasia</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Barber Club Zona Sul"
                    value={newSalon}
                    onChange={(e) => setNewSalon(e.target.value)}
                    className="w-full px-3 py-2 bg-graphite-dark border border-graphite-border text-gray-200 focus:outline-none focus:border-copper"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-mono block mb-1">Nome do Proprietário</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Marcelo Medeiros"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-3 py-2 bg-graphite-dark border border-graphite-border text-gray-200 focus:outline-none focus:border-copper"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-mono block mb-1">Plano Adquirido</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as SaaSClient['plan'])}
                    className="w-full py-2 bg-graphite-dark border border-graphite-border text-gray-200 focus:outline-none cursor-pointer"
                  >
                    <option value="Starter">Starter (R$ 99/mês)</option>
                    <option value="Pro">Pro (R$ 199/mês)</option>
                    <option value="Enterprise">Enterprise (R$ 499/mês)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button type="button" onClick={() => setShowAddClient(false)} className="px-2 py-1 text-gray-500 hover:text-gray-300 font-mono">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-copper text-graphite-dark font-bold font-mono">Homologar na Nuvem</button>
              </div>
            </form>
          )}

          <div className="bg-graphite-panel border border-graphite-border">
            <div className="p-4 bg-black/20 border-b border-graphite-border">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#b87333]/90 font-mono">Controle de Clientes Homologados</h3>
            </div>

            <div className="divide-y divide-[#333]">
              {filteredClients.map(cli => (
                <div key={cli.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-black/5 hover:bg-black/10 transition">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4 className="text-xs sm:text-xs font-bold text-gray-200">{cli.salonName}</h4>
                      <p className="text-[10.5px] text-gray-500 font-sans italic">Prop: {cli.ownerName}</p>
                      <span className={`px-2 py-0.5 text-[8px] font-mono border uppercase tracking-wider ${cli.waConnected ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                        {cli.waConnected ? 'WhatsApp Ativo' : 'Wsp Desconectado'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-mono">
                      <span>Plano: <strong>{cli.plan}</strong> (R$ {cli.mrr}/mês)</span>
                      <span>Msg/Mês: <strong>{cli.messageCount}</strong></span>
                      <span>Assertividade IA: <strong className="text-copper">{cli.iaPercentage}%</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center text-xs font-mono">
                    
                    {/* Status selection */}
                    <span className={`px-2 py-0.5 text-[10px] border ${cli.status === 'Ativo' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : cli.status === 'Bloqueado' ? 'bg-red-500/15 text-red-400 border-red-500/30' : 'bg-yellow-500/15 text-yellow-500 border-yellow-500/30'}`}>
                      {cli.status}
                    </span>

                    {/* Change plan logic simulation */}
                    <select
                      value={cli.plan}
                      onChange={(e) => changeClientPlan(cli.id, e.target.value as SaaSClient['plan'])}
                      className="text-[10px] bg-graphite-dark border border-[#333] text-gray-400 px-1 py-1 focus:outline-none cursor-pointer"
                    >
                      <option value="Starter">Starter</option>
                      <option value="Pro">Pro</option>
                      <option value="Enterprise">Enterprise</option>
                    </select>

                    <button
                      onClick={() => toggleClientStatus(cli.id, cli.status)}
                      className={`p-1.5 border border-graphite-border hover:bg-neutral-800 text-[10px] ${cli.status === 'Ativo' ? 'text-red-400 hover:text-red-300' : 'text-emerald-400 hover:text-emerald-300'}`}
                      title={cli.status === 'Ativo' ? 'Bloquear Cliente' : 'Desbloquear / Ativar'}
                    >
                      {cli.status === 'Ativo' ? <Ban className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Server logs and API traffic simulated telemetries */}
          <div className="bg-graphite-panel border border-graphite-border p-5 space-y-3">
            <h4 className="text-[10px] font-bold font-mono tracking-widest text-emerald-400 uppercase flex items-center gap-2">
              <Server className="w-3.5 h-3.5 animate-pulse" />
              Barber 360 - Cluster Telemetry Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-black/35 p-3.5 border border-graphite-border space-y-1">
                <span className="text-[9px] text-gray-500 font-mono uppercase block">WebSocket Server</span>
                <span className="text-[11px] font-mono text-emerald-500 font-bold">🟢 ONLINE · 3000ms ping</span>
              </div>
              <div className="bg-black/35 p-3.5 border border-graphite-border space-y-1">
                <span className="text-[9px] text-gray-500 font-mono uppercase block">API Gateway Response</span>
                <span className="text-[11px] font-mono text-emerald-500 font-bold">⏱️ Avg 1.1s</span>
              </div>
              <div className="bg-black/35 p-3.5 border border-graphite-border space-y-1">
                <span className="text-[9px] text-gray-500 font-mono uppercase block">Docker Containers</span>
                <span className="text-[11px] font-mono text-gray-400">🐳 Port 3000 mapped</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Support Tickets queue (1/3 space) */}
        <div className="bg-graphite-panel border border-graphite-border p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-graphite-border pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#b87333]/90 font-mono flex items-center gap-1.5">
                <TicketCheck className="w-4 h-4 text-copper" />
                Central de Suporte Operacional ({tickets.filter(t => t.status === 'Aberto').length})
              </h3>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">Tickets de barbearias em trânsito no SaaS</p>
            </div>

            <div className="space-y-4 pt-4">
              {tickets.map(ticket => (
                <div key={ticket.id} className="p-3.5 bg-graphite-dark/50 border border-graphite-border space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-500">#{ticket.id} · {ticket.salonName}</span>
                    <span className={`px-1.5 py-0.2 border ${ticket.priority === 'Alta' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ticket.priority === 'Média' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                      {ticket.priority} Priority
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-gray-300 font-sans leading-tight">{ticket.topic}</h4>
                    <p className="text-[10.5px] text-gray-500 font-sans mt-1 leading-snug">{ticket.desc}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-[#333]/40 text-xs">
                    <span className={`text-[10px] uppercase font-mono ${ticket.status === 'Aberto' ? 'text-yellow-400' : 'text-gray-500'}`}>
                      {ticket.status}
                    </span>

                    {ticket.status === 'Aberto' && (
                      <button
                        onClick={() => handleResolveTicket(ticket.id)}
                        className="px-2 py-1 bg-[#C37A4C]/10 hover:bg-[#C37A4C]/20 text-copper border border-copper/15 font-mono text-[9px] tracking-wider uppercase cursor-pointer"
                      >
                        Marcar Resolvido
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-zinc-900/40 border border-graphite-border font-sans text-xs text-gray-550 leading-relaxed mt-6">
            <span className="font-bold text-gray-400 block font-mono">Operação Segura Interna</span>
            Como suporte técnico, você pode reiniciar as conexões ou simular as requisições de API no painel sandbox de canais a qualquer momento para auditar as conversas.
          </div>

        </div>

      </div>

    </div>
  );
}
