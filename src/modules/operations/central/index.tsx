import React from 'react';
import ModuleLayout, { SubPageSpec } from '../../../components/ModuleLayout';

export const centralRoutes: SubPageSpec[] = [
  { id: 'dashboard-geral', name: 'Dashboard Geral' },
  { id: 'tempo-real', name: 'Tempo Real' },
  { id: 'alertas', name: 'Alertas' }
];

interface SubModuleProps {
  activeSubPageId?: string;
  onSubPageChange?: (id: string) => void;
}

export default function CentralModule({ activeSubPageId, onSubPageChange }: SubModuleProps) {
  return (
    <ModuleLayout
      moduleName="Central Operacional"
      modulePath="Operations Platform"
      description="Painel de controle macro da sustentação do SaaS. Monitore conexões, incidentes automatizados e instabilidades de microsserviços."
      subPages={centralRoutes}
      quickCards={[
        { title: 'Inquilinos (Tenants)', value: '342 ativos', change: '+12 essa sem', type: 'positive' },
        { title: 'Conexões Ativas', value: '318 online', change: '93%', type: 'neutral' },
        { title: 'Chamadas de API / h', value: '45.2k', change: '+8%', type: 'neutral' },
        { title: 'Incidentes Abertos', value: '0', change: 'Estável', type: 'positive' }
      ]}
      secondarySidebarHeader="Status Operacional"
      externalActiveSubPage={activeSubPageId}
      onSubPageChange={onSubPageChange}
    >
      {(activeSubPageId) => (
        <div className="space-y-4">
          <div className="border border-graphite-border bg-graphite-dark/40 p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-350 uppercase">Monitoramento: <strong className="text-copper">{activeSubPageId}</strong></span>
          </div>
          <p className="text-xs text-gray-450">
            Acompanhe a atividade instantânea de todos os servidores. A Central de Orquestração garante que o banco de dados principal esteja isolado em esquemas multi-tenant seguros.
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
