import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Sparkles, 
  DollarSign, 
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Activity,
  Shield,
  Briefcase
} from 'lucide-react';
import ModuleLayout, { SubPageSpec } from '../../components/ModuleLayout';

export const coreRoutes: SubPageSpec[] = [
  { id: 'dono', name: 'Painel do Dono', icon: <Briefcase className="w-3.5 h-3.5" /> },
  { id: 'barbeiro', name: 'Painel do Barbeiro', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'operacoes', name: 'Painel Operations SaaS', icon: <Activity className="w-3.5 h-3.5" /> }
];

export default function CoreModule() {
  const [selectedBarber, setSelectedBarber] = useState('Diego Barbear');
  const [mrrValue, setMrrValue] = useState(24900);
  const [activeTenants, setActiveTenants] = useState(148);

  const statsDono = [
    { label: 'Faturamento Mensal', value: 'R$ 18.450,00', change: '+12.4%', inc: true, icon: <DollarSign className="w-4 h-4 text-copper" /> },
    { label: 'Agendamentos Ativos', value: '342', change: '+8.3%', inc: true, icon: <Calendar className="w-4 h-4 text-copper" /> },
    { label: 'Clientes Retidos (CRM)', value: '1,450', change: '+5.1%', inc: true, icon: <Users className="w-4 h-4 text-copper" /> },
    { label: 'Taxa Conversão IA', value: '84.3%', change: 'Estável', inc: true, icon: <Sparkles className="w-4 h-4 text-copper" /> },
  ];

  return (
    <ModuleLayout
      moduleName="Core Dashboard"
      modulePath="Client & Ops"
      description="Painel unificado e inteligente para acompanhamento de métricas do negócio. Alterne entre visões de acordo com o nível hierárquico."
      subPages={coreRoutes}
      quickCards={[
        { title: 'Status do Estabelecimento', value: 'Ativo/Pro', change: 'Evoluindo', type: 'positive' },
        { title: 'Agentes Online', value: '4 Ativos', change: '100% Sinc', type: 'positive' },
        { title: 'Uptime Plataforma', value: '99.98%', change: 'Estável', type: 'neutral' },
        { title: 'Licenças Adquiridas', value: '12 cadeiras', change: 'Em Uso', type: 'positive' }
      ]}
      secondarySidebarHeader="Filtro de Escopos"
      secondarySidebarContent={
        <div className="space-y-4 text-xs font-sans text-gray-400">
          <div>
            <p className="font-bold text-gray-200 uppercase tracking-wider text-[9px] mb-1.5">Informações de Contexto</p>
            <p className="text-[11px] leading-relaxed">
              O Barber 360 se adapta de forma fluida de acordo com o login do usuário, separando estritamente os fluxos transacionais multi-tenant usando hashing de segurança de sessão no backend.
            </p>
          </div>
          <div className="bg-[#18191B] border border-graphite-border p-3 space-y-2">
            <span className="text-[9px] uppercase font-mono text-copper block font-semibold">Auditoria de Telemetria</span>
            <div className="flex justify-between text-[10px]">
              <span>Tenant ID:</span>
              <span className="font-mono text-gray-300">#b360-1498-8821</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>Role Context:</span>
              <span className="font-mono text-gray-300 font-bold uppercase">Multi-Access</span>
            </div>
          </div>
        </div>
      }
    >
      {(activeSubPageId) => {
        if (activeSubPageId === 'dono') {
          return (
            <div className="space-y-6">
              {/* Header Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsDono.map((stat, idx) => (
                  <div key={idx} className="bg-[#161719] border border-graphite-border p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">{stat.label}</span>
                      <p className="text-base font-bold font-mono text-gray-200 mt-1">{stat.value}</p>
                    </div>
                    <div className="p-2 bg-graphite-dark border border-graphite-border">
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Main row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Atividade Recente */}
                <div className="border border-graphite-border bg-[#141517] p-5">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3">Últimos Agendamentos via Conversação IA</h4>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-graphite-border/40">
                      <div>
                        <strong className="text-gray-300 block">Gabriel M. (Corte & Barba)</strong>
                        <span className="text-[10px] text-gray-500 font-mono">Realizado por: Diego Barbear • Agendado por: Atendente Virtual</span>
                      </div>
                      <span className="text-emerald-500 text-[10px] font-mono whitespace-nowrap bg-emerald-500/10 px-2 py-0.5 uppercase">Confirmado</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-graphite-border/40">
                      <div>
                        <strong className="text-gray-300 block">Rodrigo Alves (Coloração)</strong>
                        <span className="text-[10px] text-gray-500 font-mono">Realizado por: Lucas Navalha • Agendado por: Atendente Virtual</span>
                      </div>
                      <span className="text-emerald-500 text-[10px] font-mono whitespace-nowrap bg-emerald-500/10 px-2 py-0.5 uppercase">Confirmado</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pb-2 border-b border-graphite-border/40">
                      <div>
                        <strong className="text-gray-300 block">Vitor Lima (Corte Navalhado)</strong>
                        <span className="text-[10px] text-gray-500 font-mono">Realizado por: Diego Barbear • Canal: WhatsApp Reativação</span>
                      </div>
                      <span className="text-copper text-[10px] font-mono whitespace-nowrap bg-copper/10 px-2 py-0.5 uppercase">Aguardando Cliente</span>
                    </div>
                  </div>
                </div>

                {/* AI Performance */}
                <div className="border border-graphite-border bg-[#141517] p-5">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3">Produtividade de Campanhas de Engajamento</h4>
                  <div className="space-y-3.5 text-xs text-gray-400">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Reativação de Inativos (30d)</span>
                        <strong className="text-copper font-mono">72% de Conversão</strong>
                      </div>
                      <div className="w-full bg-graphite-dark h-2 border border-graphite-border">
                        <div className="bg-copper h-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Horários Ociosos Otimizados</span>
                        <strong className="text-copper font-mono">81% Ocupados</strong>
                      </div>
                      <div className="w-full bg-graphite-dark h-2 border border-graphite-border">
                        <div className="bg-copper h-full" style={{ width: '81%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Recuperação de Cancelamentos</span>
                        <strong className="text-copper font-mono">48% Reagendados</strong>
                      </div>
                      <div className="w-full bg-graphite-dark h-2 border border-graphite-border">
                        <div className="bg-copper h-full" style={{ width: '48%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'barbeiro') {
          return (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-graphite-dark p-3.5 border border-graphite-border">
                <span className="text-xs text-gray-400">Profissional Selecionado:</span>
                <select 
                  className="bg-graphite-panel border border-graphite-border text-xs px-2.5 py-1 text-gray-200 focus:outline-none focus:border-copper font-mono"
                  value={selectedBarber}
                  onChange={(e) => setSelectedBarber(e.target.value)}
                >
                  <option>Diego Barbear</option>
                  <option>Lucas Navalha</option>
                  <option>Rodrigo Cortes</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#141517] p-4.5 border border-graphite-border text-center">
                  <span className="text-[10px] text-gray-500 uppercase font-mono">Agenda do Dia</span>
                  <p className="text-xl font-bold font-mono text-gray-200 mt-1">8 agendados</p>
                  <span className="text-[9px] text-[#A28D78] block mt-1.5 font-mono">Sendo 5 via Atendente de IA</span>
                </div>
                <div className="bg-[#141517] p-4.5 border border-graphite-border text-center">
                  <span className="text-[10px] text-gray-500 uppercase font-mono">Ganhos de Comissão</span>
                  <p className="text-xl font-bold font-mono text-emerald-500 mt-1">R$ 540,00</p>
                  <span className="text-[9px] text-gray-500 block mt-1.5 font-mono">Alinhado à taxa de 50.00%</span>
                </div>
                <div className="bg-[#141517] p-4.5 border border-graphite-border text-center">
                  <span className="text-[10px] text-gray-500 uppercase font-mono">Avaliação Média</span>
                  <p className="text-xl font-bold font-mono text-copper mt-1">4.96 ★</p>
                  <span className="text-[9px] text-gray-500 block mt-1.5 font-mono">82 resenhas de clientes</span>
                </div>
              </div>

              <div className="border border-graphite-border bg-[#141517] p-5">
                <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3">Escala de Execuções do Turno de Hoje ({selectedBarber})</h4>
                <div className="space-y-2.5 text-xs text-gray-400 font-mono">
                  <div className="flex justify-between items-center pb-2 border-b border-graphite-border/30">
                    <span>09:00 - 09:45</span>
                    <strong className="text-gray-300">Corte Social + Barba</strong>
                    <span className="text-emerald-555">Concluído</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-graphite-border/30">
                    <span>10:00 - 10:30</span>
                    <strong className="text-gray-300">Corte Blindado Infantil</strong>
                    <span className="text-emerald-555">Concluído</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-graphite-border/30">
                    <span>11:15 - 12:00</span>
                    <strong className="text-gray-300">Selagem Térmica Capilar</strong>
                    <span className="text-amber-555">Ocupado</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span>14:00 - 14:30</span>
                    <strong className="text-gray-300">Tratamento de Alinhamento</strong>
                    <span className="text-gray-500">Agendado</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'operacoes') {
          return (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/20 p-4 font-sans text-xs text-amber-300 leading-relaxed">
                <strong>[Nível Admin Global]</strong> Esta view é restrita para o time de suporte e gerência do Barber 360. Nela você audita a telemetria agregada de todos os tenants conectados.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#141517] p-4.5 border border-graphite-border">
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">MRR Consolidado SaaS</span>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-bold font-mono text-copper">R$ {mrrValue.toLocaleString()}</p>
                    <div className="flex gap-1">
                      <button onClick={() => setMrrValue(prev => prev + 299)} className="p-1 bg-graphite-dark hover:bg-copper hover:text-graphite-dark text-[9px] font-mono border border-graphite-border">+</button>
                      <button onClick={() => setMrrValue(prev => Math.max(0, prev - 299))} className="p-1 bg-graphite-dark hover:bg-copper hover:text-graphite-dark text-[9px] font-mono border border-graphite-border">-</button>
                    </div>
                  </div>
                  <span className="text-[8px] text-gray-500 block mt-1">Somas reais de planos Starter, Pro e Enterprise</span>
                </div>

                <div className="bg-[#141517] p-4.5 border border-graphite-border">
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Tenants Ativos</span>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-bold font-mono text-gray-200">{activeTenants} Estabelecimentos</p>
                    <div className="flex gap-1">
                      <button onClick={() => setActiveTenants(prev => prev + 1)} className="p-1 bg-graphite-dark hover:bg-copper hover:text-graphite-dark text-[9px] font-mono border border-graphite-border">+</button>
                      <button onClick={() => setActiveTenants(prev => Math.max(0, prev - 1))} className="p-1 bg-graphite-dark hover:bg-copper hover:text-graphite-dark text-[9px] font-mono border border-graphite-border">-</button>
                    </div>
                  </div>
                  <span className="text-[8px] text-gray-500 block mt-1">Multi-tenant com isolamento total de esquemas</span>
                </div>

                <div className="bg-[#141517] p-4.5 border border-graphite-border">
                  <span className="text-[10px] text-gray-500 uppercase font-mono block">Inadimplência (Churn)</span>
                  <p className="text-lg font-bold font-mono text-red-500 mt-1">1.84%</p>
                  <span className="text-[8px] text-gray-500 block mt-1">Padrão extremamente reduzido</span>
                </div>
              </div>

              <div className="border border-graphite-border bg-[#141517] p-5">
                <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3">Faturamento por Tipo de Plano</h4>
                <div className="space-y-3.5 text-xs text-gray-400">
                  <div>
                    <div className="flex justify-between mb-1 font-mono">
                      <span>Plano Starter v1 (24 tenants)</span>
                      <strong>R$ 3.576 /mês</strong>
                    </div>
                    <div className="w-full bg-graphite-dark h-1.5 border border-graphite-border">
                      <div className="bg-copper h-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 font-mono">
                      <span>Plano Pro v2 (104 tenants)</span>
                      <strong>R$ 15.496 /mês</strong>
                    </div>
                    <div className="w-full bg-graphite-dark h-1.5 border border-graphite-border">
                      <div className="bg-copper h-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 font-mono">
                      <span>Plano Enterprise (20 tenants)</span>
                      <strong>R$ 5.828 /mês</strong>
                    </div>
                    <div className="w-full bg-graphite-dark h-1.5 border border-graphite-border">
                      <div className="bg-copper h-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return null;
      }}
    </ModuleLayout>
  );
}
