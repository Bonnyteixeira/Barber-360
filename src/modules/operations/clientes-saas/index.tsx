import React from 'react';
import ModuleLayout, { SubPageSpec } from '../../../components/ModuleLayout';

export const clientesSaasRoutes: SubPageSpec[] = [
  { id: 'todos', name: 'Todos' },
  { id: 'ativos', name: 'Ativos' },
  { id: 'trial', name: 'Trial' },
  { id: 'suspensos', name: 'Suspensos' },
  { id: 'cancelados', name: 'Cancelados' }
];

interface SubModuleProps {
  activeSubPageId?: string;
  onSubPageChange?: (id: string) => void;
}

export default function ClientesSaasModule({ activeSubPageId, onSubPageChange }: SubModuleProps) {
  return (
    <ModuleLayout
      moduleName="Gestão de Tenants (Clientes)"
      modulePath="Operations Platform"
      description="Consulte e gerencie o estado de todos os inquilinos (barbearias assinantes) cadastrados no ecossistema Barber 360, aplique suspensões manuais ou mude limiares de franquia."
      subPages={clientesSaasRoutes}
      quickCards={[
        { title: 'Total Barbearias', value: '452 cadastros', change: '+24 esse mês', type: 'positive' },
        { title: 'Total Ativos', value: '384', change: '85%', type: 'neutral' },
        { title: 'Em Período Trial', value: '54', change: '+5', type: 'neutral' },
        { title: 'Inadimplência', value: '1.4%', change: '-0.3%', type: 'positive' }
      ]}
      secondarySidebarHeader="Controles SaaS"
      externalActiveSubPage={activeSubPageId}
      onSubPageChange={onSubPageChange}
    >
      {(activeSubPageId) => (
        <div className="space-y-4">
          <div className="border border-graphite-border bg-graphite-dark/40 p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-305 uppercase">Filtro de Inquilinos: <strong className="text-copper">{activeSubPageId}</strong></span>
          </div>
          <p className="text-xs text-gray-400">
            Mantenha controle total sob o ciclo de vida dos inquilinos corporativos do CRM. Contas suspensas perdem acesso imediato aos atendentes virtuais e roteamento de webhook do WhatsApp.
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
