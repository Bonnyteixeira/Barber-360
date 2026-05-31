import React, { useState } from 'react';
import { 
  BarChart2, 
  MessageSquare, 
  Calendar, 
  Users, 
  Sliders, 
  Sparkles, 
  DollarSign, 
  FileText, 
  Settings, 
  ShieldAlert, 
  Smartphone, 
  Activity, 
  TrendingUp, 
  HelpCircle, 
  Lock, 
  LogOut, 
  Server, 
  Layers, 
  Users2, 
  CreditCard, 
  LifeBuoy, 
  LineChart, 
  Key, 
  FileSpreadsheet, 
  Database,
  Grid,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import All Reorganized Enterprise Domain Modules
import CoreModule from '../modules/core';
import CommunicationModule from '../modules/communication';
import SchedulingModule from '../modules/scheduling';
import CrmModule from '../modules/crm';
import AiModule from '../modules/ai';
import MarketingModule from '../modules/marketing';
import FinancialModule from '../modules/financial';
import OperationsModule from '../modules/operations';
import SettingsModule from '../modules/settings';

// Import All Individual SaaS Operations Modules
import CentralModule from '../modules/operations/central';
import ClientesSaasModule from '../modules/operations/clientes-saas';
import AssinaturasModule from '../modules/operations/assinaturas';
import FinanceiroSaasModule from '../modules/operations/financeiro-saas';
import MonitoramentoIaModule from '../modules/operations/monitoramento-ia';
import SessoesWhatsAppModule from '../modules/operations/sessoes';
import SuporteModule from '../modules/operations/suporte';
import EquipeModule from '../modules/operations/equipe';
import AnalyticsModule from '../modules/operations/analytics';
import LogsModule from '../modules/operations/logs';
import AdminModule from '../modules/operations/admin';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

type PlatformType = 'client' | 'operations';

export default function Dashboard({ userEmail, onLogout }: DashboardProps) {
  // Active unified module selection state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeSubTab, setActiveSubTab] = useState<string>('');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Collapsible sidebar state on desktop/tablet
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Local active barbearia name state stored in localStorage
  const [barbeariaName, setBarbeariaName] = useState<string>(() => {
    return localStorage.getItem('barber360_barbeariaName') || 'Barbearia Heitor';
  });

  const handleSaveBarbeariaName = (newName: string) => {
    setBarbeariaName(newName || 'Barbearia Heitor');
    localStorage.setItem('barber360_barbeariaName', newName || 'Barbearia Heitor');
  };

  // Client Platform Sidebar items definitions
  const clientSidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'conversas', name: 'Conversas & Chats', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'agenda', name: 'Agendas & Escalas', icon: <Calendar className="w-4 h-4" /> },
    { id: 'clientes', name: 'Relacionamento CRM', icon: <Users className="w-4 h-4" /> },
    { id: 'ia-assistente', name: 'Automação IA', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'campanhas', name: 'Marketing Retenção', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'financeiro', name: 'Fluxo Financeiro', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'configuracoes', name: 'Configurações', icon: <Settings className="w-4 h-4" /> }
  ];

  // Operations Platform Sidebar items definitions (consolidated operational console)
  const operationsSidebarItems = [
    { 
      id: 'op-central', 
      name: 'Central Operacional', 
      icon: <Server className="w-4 h-4" />, 
      subPages: [
        { id: 'dashboard-geral', name: 'Dashboard Geral' }, 
        { id: 'tempo-real', name: 'Tempo Real' }, 
        { id: 'alertas', name: 'Alertas' }
      ] 
    },
    { 
      id: 'op-clientes', 
      name: 'Clientes SaaS', 
      icon: <Users2 className="w-4 h-4" />, 
      subPages: [
        { id: 'todos', name: 'Todos' }, 
        { id: 'ativos', name: 'Ativos' }, 
        { id: 'trial', name: 'Trial' }, 
        { id: 'suspensos', name: 'Suspensos' }, 
        { id: 'cancelados', name: 'Cancelados' }
      ] 
    },
    { 
      id: 'op-assinaturas', 
      name: 'Assinaturas & Planos', 
      icon: <CreditCard className="w-4 h-4" />, 
      subPages: [
        { id: 'planos', name: 'Planos' }, 
        { id: 'cobrancas', name: 'Cobranças' }, 
        { id: 'inadimplentes', name: 'Inadimplentes' }, 
        { id: 'historico', name: 'Histórico' }, 
        { id: 'upgrade', name: 'Upgrade' }
      ] 
    },
    { 
      id: 'op-financeiro', 
      name: 'Financeiro SaaS', 
      icon: <DollarSign className="w-4 h-4" />, 
      subPages: [
        { id: 'receita', name: 'Receita' }, 
        { id: 'custos', name: 'Custos' }, 
        { id: 'ia', name: 'IA' }, 
        { id: 'assinaturas', name: 'Assinaturas' }, 
        { id: 'resultado', name: 'Resultado' }
      ] 
    },
    { 
      id: 'op-ia', 
      name: 'Monitoramento IA', 
      icon: <Sparkles className="w-4 h-4" />, 
      subPages: [
        { id: 'uso', name: 'Uso' }, 
        { id: 'custos', name: 'Custos' }, 
        { id: 'performance', name: 'Performance' }, 
        { id: 'erros', name: 'Erros' }, 
        { id: 'logs', name: 'Logs' }
      ] 
    },
    { 
      id: 'op-sessoes', 
      name: 'Sessões WhatsApp', 
      icon: <Activity className="w-4 h-4" />, 
      subPages: [
        { id: 'conectadas', name: 'Conectadas' }, 
        { id: 'desconectadas', name: 'Desconectadas' }, 
        { id: 'instaveis', name: 'Instáveis' }, 
        { id: 'historico', name: 'Histórico' }
      ] 
    },
    { 
      id: 'op-suporte', 
      name: 'Suporte & Tickets', 
      icon: <LifeBuoy className="w-4 h-4" />, 
      subPages: [
        { id: 'tickets', name: 'Tickets' }, 
        { id: 'em-atendimento', name: 'Em Atendimento' }, 
        { id: 'resolvidos', name: 'Resolvidos' }, 
        { id: 'base-conhecimento', name: 'Base Conhecimento' }
      ] 
    },
    { 
      id: 'op-equipe', 
      name: 'Equipe & Perfis', 
      icon: <Users className="w-4 h-4" />, 
      subPages: [
        { id: 'colaboradores', name: 'Colaboradores' }, 
        { id: 'permissoes', name: 'Permissões' }, 
        { id: 'cargos', name: 'Cargos' }, 
        { id: 'auditoria', name: 'Auditoria' }
      ] 
    },
    { 
      id: 'op-analytics', 
      name: 'Analytics & BI', 
      icon: <LineChart className="w-4 h-4" />, 
      subPages: [
        { id: 'mrr', name: 'MRR' }, 
        { id: 'churn', name: 'Churn' }, 
        { id: 'crescimento', name: 'Crescimento' }, 
        { id: 'retencao', name: 'Retenção' }, 
        { id: 'ltv', name: 'LTV' }
      ] 
    },
    { 
      id: 'op-logs', 
      name: 'Logs & Auditoria', 
      icon: <FileSpreadsheet className="w-4 h-4" />, 
      subPages: [
        { id: 'sistema', name: 'Sistema' }, 
        { id: 'conversas', name: 'Conversas' }, 
        { id: 'alteracoes', name: 'Alterações' }, 
        { id: 'seguranca', name: 'Segurança' }
      ] 
    },
    { 
      id: 'op-admin', 
      name: 'Configurações SaaS', 
      icon: <Settings className="w-4 h-4" />, 
      subPages: [
        { id: 'configuracoes', name: 'Configurações' }, 
        { id: 'planos', name: 'Planos' }, 
        { id: 'limites', name: 'Limites' }, 
        { id: 'integracoes', name: 'Integrações' }, 
        { id: 'feature-flags', name: 'Feature Flags' }, 
        { id: 'status-plataforma', name: 'Status Plataforma' }
      ] 
    }
  ];

  const renderActiveModule = () => {
    switch (activeTab) {
      // Client Platform Modules
      case 'dashboard': return <CoreModule />;
      case 'conversas': return <CommunicationModule />;
      case 'agenda': return <SchedulingModule />;
      case 'clientes': return <CrmModule />;
      case 'ia-assistente': return <AiModule />;
      case 'campanhas': return <MarketingModule />;
      case 'financeiro': return <FinancialModule />;
      case 'configuracoes': return <SettingsModule />;

      // Operations Platform Modules (11 Individual Modules)
      case 'op-central': 
        return <CentralModule activeSubPageId={activeSubTab} onSubPageChange={setActiveSubTab} />;
      case 'op-clientes': 
        return <ClientesSaasModule activeSubPageId={activeSubTab} onSubPageChange={setActiveSubTab} />;
      case 'op-assinaturas': 
        return <AssinaturasModule activeSubPageId={activeSubTab} onSubPageChange={setActiveSubTab} />;
      case 'op-financeiro': 
        return <FinanceiroSaasModule activeSubPageId={activeSubTab} onSubPageChange={setActiveSubTab} />;
      case 'op-ia': 
        return <MonitoramentoIaModule activeSubPageId={activeSubTab} onSubPageChange={setActiveSubTab} />;
      case 'op-sessoes': 
        return <SessoesWhatsAppModule activeSubPageId={activeSubTab} onSubPageChange={setActiveSubTab} />;
      case 'op-suporte': 
        return <SuporteModule activeSubPageId={activeSubTab} onSubPageChange={setActiveSubTab} />;
      case 'op-equipe': 
        return <EquipeModule activeSubPageId={activeSubTab} onSubPageChange={setActiveSubTab} />;
      case 'op-analytics': 
        return <AnalyticsModule activeSubPageId={activeSubTab} onSubPageChange={setActiveSubTab} />;
      case 'op-logs': 
        return <LogsModule activeSubPageId={activeSubTab} onSubPageChange={setActiveSubTab} />;
      case 'op-admin': 
        return <AdminModule activeSubPageId={activeSubTab} onSubPageChange={setActiveSubTab} />;

      // Legacy direct view
      case 'central': return <OperationsModule />;
      
      default: return <CoreModule />;
    }
  };

  return (
    <div id="barber360-container" className="min-h-screen bg-graphite-dark text-gray-200 font-sans flex flex-col md:flex-row h-screen overflow-hidden">
      
      {/* SIDEBAR: Left static pane */}
      <aside className={`hidden md:flex ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-[#141517] border-r border-graphite-border flex-col justify-between shrink-0 h-full transition-all duration-300`}>
        
        <div className="flex-1 flex flex-col min-h-0">
          
          {/* Logo brand and toggle panel */}
          <div className={`p-4 flex items-center justify-between border-b border-graphite-border/65 shrink-0 transition-all duration-300 ${sidebarCollapsed ? 'flex-col gap-4' : 'h-[72px]'}`}>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 border border-copper flex items-center justify-center rotate-45 shadow-md bg-graphite-dark shrink-0">
                <span className="-rotate-45 text-copper font-serif font-bold text-sm">360</span>
              </div>
              {!sidebarCollapsed && (
                <div className="transition-all duration-300">
                  <h1 className="text-xs font-bold tracking-widest text-white leading-none">
                    BARBER<span className="text-copper">360</span>
                  </h1>
                  <p className="text-[8px] text-gray-500 uppercase tracking-widest font-mono mt-1">Multi-tenant SaaS</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 border border-graphite-border/70 hover:border-copper/45 hover:bg-graphite-dark/60 text-copper rounded transition cursor-pointer shrink-0"
              title={sidebarCollapsed ? "Expandir Menu" : "Recolher Menu"}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Combined Scrollable menu containing both Client & Operation Sections */}
          <div className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-6">
            
            {/* SECTION 1: CLIENTS */}
            <div>
              <div className={`px-2.5 mb-2.5 flex flex-col ${sidebarCollapsed ? 'items-center border-b border-graphite-border/30 pb-2.5' : ''}`}>
                {!sidebarCollapsed ? (
                  <>
                    <span className="text-[10px] uppercase tracking-widest text-[#B29D88] font-mono font-bold truncate max-w-full block" title={barbeariaName}>
                      {barbeariaName}
                    </span>
                    <span className="text-[8px] text-gray-500 font-mono">USUÁRIO LOGADO</span>
                  </>
                ) : (
                  <span className="text-[9px] text-[#B29D88] font-bold font-mono" title={barbeariaName}>
                    {barbeariaName ? barbeariaName.slice(0, 3).toUpperCase() : 'CLI'}
                  </span>
                )}
              </div>
              <nav className="space-y-0.5">
                {clientSidebarItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-mono font-medium flex items-center ${
                        sidebarCollapsed ? 'justify-center py-2' : 'gap-2.5'
                      } transition cursor-pointer ${
                        isActive
                          ? 'bg-copper text-graphite-dark font-bold'
                          : 'text-gray-400 hover:text-white hover:bg-graphite-dark/50'
                      }`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <span className={isActive ? 'text-graphite-dark' : 'text-copper/70'}>{item.icon}</span>
                      {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* SECTION 2: OPERATIONS */}
            <div>
              <div className={`px-2.5 mb-2.5 flex flex-col ${sidebarCollapsed ? 'items-center border-b border-graphite-border/30 pb-2.5' : ''}`}>
                {!sidebarCollapsed ? (
                  <>
                    <span className="text-[10px] uppercase tracking-widest text-[#9c6e39] font-mono font-bold flex items-center gap-1.5">
                      Operação
                    </span>
                    <span className="text-[8px] text-gray-500 font-mono">EMPRESA DONA DO SAAS</span>
                  </>
                ) : (
                  <span className="text-[9px] text-[#9c6e39] font-bold font-mono" title="Operação">OPE</span>
                )}
              </div>
              <nav className="space-y-1">
                {operationsSidebarItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <div key={item.id} className="space-y-1">
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          if (item.subPages && item.subPages.length > 0) {
                            setActiveSubTab(item.subPages[0].id);
                          } else {
                            setActiveSubTab('');
                          }
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs font-mono font-medium flex items-center rounded-none justify-between transition cursor-pointer ${
                          isActive
                            ? 'bg-copper text-graphite-dark font-bold shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-graphite-dark/50'
                        }`}
                        title={sidebarCollapsed ? item.name : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={isActive ? 'text-graphite-dark' : 'text-copper/70'}>{item.icon}</span>
                          {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </nav>
            </div>

          </div>

        </div>

        {/* User context footer */}
        <div className="p-4 border-t border-graphite-border/60 shrink-0 bg-[#0F1011] transition-all duration-300">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center p-1.5' : 'gap-2.5 p-2.5'} bg-graphite-dark/50 border border-graphite-border/50`}>
            <div className="w-7.5 h-7.5 bg-copper text-graphite-dark font-mono text-center flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-200 truncate select-none">Admin Barber360</p>
                <p className="text-[8px] text-gray-500 font-mono truncate select-none">{userEmail}</p>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            className={`w-full text-left mt-3.5 ${sidebarCollapsed ? 'p-2 justify-center' : 'px-3 py-1.5 justify-center'} text-[9px] uppercase font-mono tracking-widest text-red-500 hover:text-red-400 transition flex items-center gap-1.5 border border-dashed border-red-950/40 hover:border-red-500/30 cursor-pointer`}
            title={sidebarCollapsed ? "Sair do Sistema" : undefined}
          >
            <LogOut className="w-3 h-3 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">Sair do Sistema</span>}
          </button>
        </div>

      </aside>

      {/* MOBILE HEADER & NAVIGATION DRAWER */}
      <div className="md:hidden bg-[#141517] border-b border-graphite-border p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 border border-copper flex items-center justify-center rotate-45">
            <span className="-rotate-45 text-copper font-serif font-bold text-xs">360</span>
          </div>
          <span className="text-xs font-mono font-bold tracking-widest text-white">BARBER 360</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 border border-graphite-border/70 hover:border-copper/40 text-gray-400 transition"
        >
          <Grid className="w-4 h-4 text-copper" />
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#141517] border-b border-graphite-border font-mono shrink-0 overflow-hidden z-40 max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4 space-y-6">

              {/* Seção Cliente */}
              <div>
                <span className="text-[10px] uppercase font-bold text-copper block mb-2 px-1 truncate" title={barbeariaName}>
                  {barbeariaName}
                </span>
                <div className="grid grid-cols-2 gap-2 bg-graphite-dark/30 p-1.5">
                  {clientSidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`p-2 text-[10px] text-left transition flex items-center gap-1.5 ${activeTab === item.id ? 'bg-copper text-graphite-dark font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      {item.icon}
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Seção Operação */}
              <div>
                <span className="text-[10px] uppercase font-bold text-copper block mb-2 px-1">Operação (Dona do SaaS)</span>
                <div className="grid grid-cols-2 gap-2 bg-graphite-dark/30 p-1.5 font-mono">
                  {operationsSidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        if (item.subPages && item.subPages.length > 0) {
                          setActiveSubTab(item.subPages[0].id);
                        } else {
                          setActiveSubTab('');
                        }
                        setMobileMenuOpen(false);
                      }}
                      className={`p-2 text-[10px] text-left transition flex items-center gap-1.5 ${activeTab === item.id ? 'bg-copper text-graphite-dark font-bold' : 'text-gray-400 hover:text-white'}`}
                    >
                      {item.icon}
                      <span className="truncate">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE FRAME CONTENT: Main scrollable stage */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto scrollbar-thin bg-graphite-dark p-4 sm:p-6 lg:p-8 xl:p-10 select-text">
        {renderActiveModule()}
      </main>

    </div>
  );
}
