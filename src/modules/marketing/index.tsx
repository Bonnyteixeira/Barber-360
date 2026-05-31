import React, { useState } from 'react';
import { 
  TrendingUp, 
  Send, 
  Clock, 
  Users, 
  Sparkles, 
  Award, 
  Plus, 
  Percent,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import ModuleLayout, { SubPageSpec } from '../../components/ModuleLayout';

export const marketingRoutes: SubPageSpec[] = [
  { id: 'reativacao', name: 'Reativação de Clientes', icon: <Clock className="w-3.5 h-3.5" /> },
  { id: 'ociosidade', name: 'Horários Ociosos (Vagos)', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'cancelamentos', name: 'Recuperação Cancelamento', icon: <Percent className="w-3.5 h-3.5" /> },
  { id: 'referral', name: 'Indique e Ganhe', icon: <Award className="w-3.5 h-3.5" /> }
];

export default function MarketingModule() {
  const [activeCampaigns, setActiveCampaigns] = useState([
    { id: '1', type: 'Reativação (30d)', status: 'active', sentCount: 148, conversions: 42, rate: '28.3%' },
    { id: '2', type: 'Ociosidade Quinta Tarde', status: 'paused', sentCount: 35, conversions: 18, rate: '51.4%' },
    { id: '3', type: 'Recuperador Remarcação', status: 'active', sentCount: 12, conversions: 6, rate: '50.0%' }
  ]);

  const [simulatedReactions, setSimulatedReactions] = useState<string[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const triggerReactivationCampaign = (days: number) => {
    setLoadingAction(`reactivate-${days}`);
    setTimeout(() => {
      setSimulatedReactions(prev => [
        ...prev, 
        `[Disparo Autônomo] Campanha de Reativação de ${days} dias enviada para 28 contatos inativos. Taxa de retorno projetada: 35%.`
      ]);
      setLoadingAction(null);
    }, 1500);
  };

  const triggerOciosidadeOffers = () => {
    setLoadingAction('ociosidade');
    setTimeout(() => {
      setSimulatedReactions(prev => [
        ...prev, 
        `[Otimização Inteligente] Grade identificou ociosidade amanhã de 14h às 16:30. IA localizou 4 clientes elegíveis do CRM e disparou ofertas direcionadas.`
      ]);
      setLoadingAction(null);
    }, 1500);
  };

  const triggerRecoveryTemplateTest = () => {
    setLoadingAction('recovery');
    setTimeout(() => {
      setSimulatedReactions(prev => [
        ...prev, 
        `[Recuperação Imediata] Fluxo configurado. No momento em que um cliente solicitar cancelamento, a IA enviará imediata remarcação dinâmica.`
      ]);
      setLoadingAction(null);
    }, 1200);
  };

  return (
    <ModuleLayout
      moduleName="Marketing e Retenção Ativa"
      modulePath="Client Platform"
      description="Potencialize o faturamento da sua barbearia com inteligência reativa. Programe disparos automatizados de reativação de clientes inativos, venda horários ociosos de barbeiros e previna evasão em cancelamentos."
      subPages={marketingRoutes}
      quickCards={[
        { title: 'Retorno de Investimento', value: '18.4x ROI', change: '+3.5%', type: 'positive' },
        { title: 'Reativados via IA', value: '64 clientes', change: 'Evoluindo', type: 'positive' },
        { title: 'Faturamento Extra', value: 'R$ 3.840,00', change: '+15.2%', type: 'positive' },
        { title: 'Conversão Média', value: '38.5%', change: 'Ultra-alta', type: 'positive' }
      ]}
      secondarySidebarHeader="Configurar Campanhas"
      secondarySidebarContent={
        <div className="space-y-4 text-xs font-sans text-gray-450">
          <div>
            <span className="text-[10px] uppercase font-mono text-copper font-bold block mb-1.5 font-semibold">Motor de Retenção Ativa</span>
            <p className="text-[11px] leading-relaxed">
              Diferente de campanhas em massa (spam), o Barber 360 utiliza micro-segmentos comportamentais inteligentes do CRM de modo a disparar mensagens apenas para clientes com alta probabilidade de fechamento.
            </p>
          </div>

          <div className="bg-[#151618] border border-graphite-border p-3 space-y-1.5 text-[9px] font-mono">
            <span className="text-[9px] uppercase text-copper block select-none">Uptime Disparador</span>
            <div>Status: <strong className="text-emerald-555">Pronto para Disparo</strong></div>
            <div>Dotação limite: <strong className="text-gray-300">Ilimitado (Plano Pro)</strong></div>
          </div>
        </div>
      }
    >
      {(activeSubPageId) => {
        if (activeSubPageId === 'reativacao') {
          return (
            <div className="space-y-6">
              <div className="bg-copper/5 border border-copper/20 p-4 font-sans text-xs text-copper/90 leading-relaxed">
                <strong>[Estratégia de Reativação]</strong> Recupere clientes que costumavam vir à barbearia mas estão há dias ausentes. A IA cria drafts customizados de texto com base no histórico do cliente.
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-[#141517] border border-graphite-border p-4 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-gray-200">Clientes Ausentes 30 Dias</h5>
                    <p className="text-[10px] text-gray-500 mt-1 font-sans">Total Elegível: 28 contatos</p>
                  </div>
                  <button 
                    onClick={() => triggerReactivationCampaign(30)}
                    disabled={loadingAction !== null}
                    className="mt-4 w-full py-1.5 bg-copper hover:bg-copper/90 text-graphite-dark font-sans font-bold hover:text-graphite-dark transition"
                  >
                    {loadingAction === 'reactivate-30' ? 'Invocando IA...' : 'Disparar Campanha 30d'}
                  </button>
                </div>

                <div className="bg-[#141517] border border-graphite-border p-4 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-gray-200">Clientes Ausentes 45 Dias</h5>
                    <p className="text-[10px] text-gray-500 mt-1 font-sans">Total Elegível: 12 contatos</p>
                  </div>
                  <button 
                    onClick={() => triggerReactivationCampaign(45)}
                    disabled={loadingAction !== null}
                    className="mt-4 w-full py-1.5 bg-copper hover:bg-copper/90 text-graphite-dark font-sans font-bold hover:text-graphite-dark transition"
                  >
                    {loadingAction === 'reactivate-45' ? 'Invocando IA...' : 'Disparar Campanha 45d'}
                  </button>
                </div>

                <div className="bg-[#141517] border border-graphite-border p-4 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-gray-200">Clientes Ausentes 60 Dias+</h5>
                    <p className="text-[10px] text-gray-500 mt-1 font-sans">Total Elegível: 34 contatos</p>
                  </div>
                  <button 
                    onClick={() => triggerReactivationCampaign(60)}
                    disabled={loadingAction !== null}
                    className="mt-4 w-full py-1.5 bg-copper hover:bg-copper/90 text-graphite-dark font-sans font-bold hover:text-graphite-dark transition"
                  >
                    {loadingAction === 'reactivate-60' ? 'Invocando IA...' : 'Disparar Campanha 60d'}
                  </button>
                </div>
              </div>

              {simulatedReactions.length > 0 && (
                <div className="border border-graphite-border bg-[#101112] p-4.5 space-y-2">
                  <h5 className="text-xs font-bold text-emerald-400 font-mono uppercase">Log de Execuções Recentes</h5>
                  <div className="space-y-1.5 text-xs text-gray-400 font-mono">
                    {simulatedReactions.map((react, i) => (
                      <p key={i}>✓ {react}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        if (activeSubPageId === 'ociosidade') {
          return (
            <div className="space-y-6">
              <div className="border border-graphite-border bg-[#141517] p-5 space-y-4">
                <div className="flex justify-between items-start border-b border-graphite-border pb-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-gray-200 font-mono uppercase">Venda de Horários Ociosos (Vagos)</h4>
                    <p className="text-[11px] text-gray-500 font-sans mt-0.5">Permita que a IA audite os buracos livres da agenda dos profissionais e envie ofertas inteligentes para preencher os profissionais ociosos.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#111214] border border-graphite-border p-4 text-xs font-mono">
                    <span className="text-copper block font-bold mb-1">Próximas Vagas Ociosas Identificadas</span>
                    <div className="space-y-1.5 mt-2 text-gray-400">
                      <div>• Terça-feira (Amanhã) às 14:00 - Profissional: Diego Barbear</div>
                      <div>• Terça-feira (Amanhã) às 15:45 - Profissional: Lucas Navalha</div>
                    </div>
                  </div>

                  <div className="bg-[#111214] border border-graphite-border p-4 font-mono text-xs flex flex-col justify-between">
                    <div>
                      <span className="text-gray-200 block font-bold mb-1">Gatilho Otimizador Autônomo</span>
                      <p className="text-[10px] text-gray-500 font-sans mt-0.5">Ao pressionar, a IA localizará contatos vizinhos ausentes adequados a estes horários.</p>
                    </div>
                    <button 
                      onClick={triggerOciosidadeOffers}
                      disabled={loadingAction !== null}
                      className="mt-4 w-full py-2 bg-copper hover:bg-copper/90 text-graphite-dark font-sans font-bold hover:text-graphite-dark transition"
                    >
                      {loadingAction === 'ociosidade' ? 'Processando Filtros...' : 'Escanear e Disparar Ofertas'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'cancelamentos') {
          return (
            <div className="space-y-6">
              <div className="border border-graphite-border bg-[#141517] p-5 space-y-4 font-mono text-xs">
                <div className="border-b border-graphite-border pb-2">
                  <h4 className="text-xs font-bold text-gray-200 uppercase">Recuperador de Cancelamentos Dinâmicos</h4>
                  <p className="text-[11px] text-gray-500 font-sans mt-0.5">Se um cliente de celular cancelar, a IA entra em ação em menos de 1 minuto enviando opções dinâmicas de remarcações semanais.</p>
                </div>

                <div className="bg-[#111214] p-4.5 border border-graphite-border space-y-3">
                  <span className="text-copper block font-bold">Mensagem Recuperadora de IA</span>
                  <p className="text-[11px] italic font-sans text-gray-400 leading-relaxed bg-[#101112] p-3 border border-graphite-border/60">
                    {"Sentiremos de fato sua falta, {{CLIENTE_NOME}}! Que tal garantirmos seu visual para esta semana e reagendarmos em poucos segundos? Aqui estão meus horários de abertura livres na agenda com {{BARBEIRO_NOME}}: [b360.cc/remarcar]"}
                  </p>
                  <button 
                    onClick={triggerRecoveryTemplateTest} 
                    disabled={loadingAction !== null}
                    className="px-4 py-1.5 bg-copper text-graphite-dark font-sans font-bold hover:bg-copper/90 text-[11px] transition"
                  >
                    {loadingAction === 'recovery' ? 'Testando Conector...' : 'Salvar e Validar Fluxo IA'}
                  </button>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'referral') {
          return (
            <div className="border border-graphite-border bg-[#141517] p-5 space-y-4 text-xs font-mono">
              <div className="border-b border-graphite-border pb-2.5">
                <h4 className="text-xs font-bold text-gray-200 uppercase">Programa "Indique e Ganhe" (Referral SaaS)</h4>
                <p className="text-[11px] text-gray-550 font-sans mt-0.5 font-light">Ofereça cashback ou incentivos cumulativos para clientes que trouxerem amigos para cortarem cabelos na barbearia.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-[#111214] p-4 border border-graphite-border">
                  <span className="text-[10px] text-gray-500 block uppercase">Indicações Completadas</span>
                  <strong className="text-lg text-copper mt-1 block">42 indicações</strong>
                </div>
                <div className="bg-[#111214] p-4 border border-graphite-border">
                  <span className="text-[10px] text-gray-500 block uppercase">Bônus Concedido Bruto</span>
                  <strong className="text-lg text-gray-200 mt-1 block">R$ 420.00</strong>
                </div>
                <div className="bg-[#111214] p-4 border border-graphite-border">
                  <span className="text-[10px] text-gray-500 block uppercase">Faturamento Referenciado</span>
                  <strong className="text-lg text-emerald-500 mt-1 block">R$ 2.520.00</strong>
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
