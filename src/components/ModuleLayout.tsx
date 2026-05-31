import React, { useState } from 'react';
import { ChevronRight, Layers, Sparkles, HelpCircle, RefreshCw, Star, Play, Ban } from 'lucide-react';

export interface SubPageSpec {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export interface QuickCardSpec {
  title: string;
  value: string;
  change?: string;
  type?: 'positive' | 'negative' | 'neutral';
}

export interface ModuleLayoutProps {
  moduleName: string;
  modulePath: string;
  description: string;
  subPages: SubPageSpec[];
  quickCards?: QuickCardSpec[];
  secondarySidebarHeader?: string;
  secondarySidebarContent?: React.ReactNode;
  children?: (activeSubPageId: string) => React.ReactNode;
  externalActiveSubPage?: string;
  onSubPageChange?: (id: string) => void;
}

export default function ModuleLayout({
  moduleName,
  modulePath,
  description,
  subPages,
  quickCards = [],
  secondarySidebarHeader = "Operações Rápidas",
  secondarySidebarContent,
  children,
  externalActiveSubPage,
  onSubPageChange
}: ModuleLayoutProps) {
  const [internalActiveSubPage, setInternalActiveSubPage] = useState<string>(subPages[0]?.id || '');

  const activeSubPage = externalActiveSubPage !== undefined ? externalActiveSubPage : internalActiveSubPage;
  const setActiveSubPage = onSubPageChange !== undefined ? onSubPageChange : setInternalActiveSubPage;

  return (
    <div className="space-y-6">
      
      {/* 1. Breadcrumb & Status */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500 font-mono tracking-widest uppercase">
        <span>Barber 360</span>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <span>{modulePath}</span>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <span className="text-copper">{moduleName}</span>
        <ChevronRight className="w-3 h-3 text-gray-600" />
        <span className="text-gray-300 font-bold">{subPages.find(p => p.id === activeSubPage)?.name}</span>
      </div>

      {/* 2. Module Header */}
      <div className="bg-graphite-panel border border-graphite-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-100 font-sans tracking-tight">{moduleName}</h1>
            <span className="px-2 py-0.5 bg-copper/10 border border-copper/20 text-[9px] text-copper font-mono uppercase">
              Módulo Ativo
            </span>
          </div>
          <p className="text-xs text-gray-400 font-sans mt-1 leading-relaxed max-w-2xl">{description}</p>
        </div>
        
        {/* Module Sync / Control Indicator */}
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Sincronizado na Nuvem</span>
        </div>
      </div>

      {/* 3. Quick Access Cards (Cards de Acesso Rápido) */}
      {quickCards.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickCards.map((card, idx) => (
            <div key={idx} className="p-4 bg-graphite-panel border border-graphite-border">
              <span className="text-[9px] text-gray-500 font-mono uppercase tracking-wider block">{card.title}</span>
              <div className="flex items-baseline gap-2 mt-1.5">
                <span className="text-lg font-bold font-mono text-gray-200">{card.value}</span>
                {card.change && (
                  <span className={`text-[9px] font-mono ${
                    card.type === 'positive' ? 'text-emerald-500' : card.type === 'negative' ? 'text-red-500' : 'text-gray-400'
                  }`}>
                    {card.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Horizontal Navigation Subpages (Tabs) */}
      <div className="border-b border-graphite-border/80 flex flex-wrap gap-1 bg-[#151618] p-1">
        {subPages.map((page) => {
          const isActive = page.id === activeSubPage;
          return (
            <button
              key={page.id}
              onClick={() => setActiveSubPage(page.id)}
              className={`px-4 py-2 text-xs font-mono font-medium flex items-center gap-2 transition cursor-pointer ${
                isActive
                  ? 'bg-copper text-graphite-dark font-bold'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#222]'
              }`}
            >
              {page.icon}
              <span>{page.name}</span>
            </button>
          );
        })}
      </div>

      {/* 5. Main Double Grid: Sidebar secundária + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* main view (col-span-9) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="bg-graphite-panel border border-graphite-border p-6 min-h-[350px]">
            {children ? children(activeSubPage) : (
              <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                <Layers className="w-10 h-10 text-gray-600 mb-3" />
                <h3 className="text-sm font-bold text-gray-300 font-mono uppercase">Módulo Pronto para Desenvolvimento</h3>
                <p className="text-xs text-gray-500 mt-2 max-w-md font-sans">
                  A rota da subpágina <strong className="text-copper">{subPages.find(p => p.id === activeSubPage)?.name}</strong> está arquitetada. Todas as dependências e controllers enterprise já estão configurados no escopo modular desta view.
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="px-2.5 py-1 bg-graphite-dark border border-graphite-border text-[9px] text-gray-400 font-mono">
                    PRODUTO: Barber 360
                  </span>
                  <span className="px-2.5 py-1 bg-graphite-dark border border-graphite-border text-[9px] text-gray-400 font-mono">
                    ID: {activeSubPage}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* secondary sidebar of the module (col-span-3) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-graphite-panel border border-graphite-border p-4.5 space-y-4">
            <h3 className="text-[10px] font-bold text-copper font-mono uppercase tracking-widest border-b border-graphite-border pb-2.5">
              {secondarySidebarHeader}
            </h3>
            
            {secondarySidebarContent ? secondarySidebarContent : (
              <div className="space-y-3 text-[11px] text-gray-400 leading-relaxed font-sans">
                <div className="flex items-start gap-2">
                  <Star className="w-3.5 h-3.5 text-copper shrink-0 mt-0.5" />
                  <p>Este módulo utiliza uma arquitetura puramente desacoplada com carregamento lento (lazy loading).</p>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-copper shrink-0 mt-0.5" />
                  <p>Central de dados compartilhados através do Barber Service de alta fidelidade.</p>
                </div>
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-copper shrink-0 mt-0.5" />
                  <p>Precisa de assistência ou integração? Consulte o monitoramento global de custos em tempo real.</p>
                </div>
              </div>
            )}

            {/* Quick Actions Footer inside sidebar */}
            <div className="pt-3 border-t border-graphite-border/70 flex flex-col gap-2">
              <button className="w-full py-1.5 bg-[#222] border border-[#333] hover:border-copper/40 hover:text-white text-[10px] font-mono text-gray-400 transition cursor-pointer flex items-center justify-center gap-1.5 uppercase">
                <Play className="w-3 h-3 text-copper" />
                <span>Simular Fluxo</span>
              </button>
              <button className="w-full py-1.5 bg-[#222] border border-[#333] hover:border-red-500/40 hover:text-red-400 text-[10px] font-mono text-gray-400 transition cursor-pointer flex items-center justify-center gap-1.5 uppercase">
                <Ban className="w-3 h-3 text-red-500" />
                <span>Bloquear Setor</span>
              </button>
            </div>
          </div>

          {/* Operational Guidance Box */}
          <div className="p-3.5 bg-zinc-900/30 border border-graphite-border flex gap-2.5 text-[10px] leading-relaxed text-gray-550">
            <HelpCircle className="w-4 h-4 text-copper shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-400 block font-mono">Auditoria Contínua</span>
              <p>Qualquer alteração neste módulo registrará uma trilha em Logs & Auditoria para fins de segurança.</p>
            </div>
          </div>
        </aside>

      </div>

    </div>
  );
}
