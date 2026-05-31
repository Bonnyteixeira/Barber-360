import React from 'react';
import ModuleLayout, { SubPageSpec } from '../../../components/ModuleLayout';

export const analyticsSaasRoutes: SubPageSpec[] = [
  { id: 'mrr', name: 'MRR' },
  { id: 'churn', name: 'Churn' },
  { id: 'crescimento', name: 'Crescimento' },
  { id: 'retencao', name: 'Retenção' },
  { id: 'ltv', name: 'LTV' }
];

interface SubModuleProps {
  activeSubPageId?: string;
  onSubPageChange?: (id: string) => void;
}

export default function AnalyticsModule({ activeSubPageId, onSubPageChange }: SubModuleProps) {
  return (
    <ModuleLayout
      moduleName="BI & Analytics SaaS"
      modulePath="Operations Platform"
      description="Consolidado estratégico de métricas SaaS de faturamento de recorrência (MRR), abandono de inquilinos (Churn), ticket médio, retenção e valor do ciclo de vida do cliente (LTV)."
      subPages={analyticsSaasRoutes}
      quickCards={[
        { title: 'MRR Consolidado', value: 'R$ 114.890', change: '+14.5%', type: 'positive' },
        { title: 'Churn Taxa', value: '1.2%', change: 'Altamente retido', type: 'positive' },
        { title: 'Crescimento SaaS', value: '+18%', change: 'Trimestral', type: 'positive' },
        { title: 'LTV Médio', value: 'R$ 3.590', change: 'Evolução +8%', type: 'positive' }
      ]}
      secondarySidebarHeader="Projeções SaaS"
      externalActiveSubPage={activeSubPageId}
      onSubPageChange={onSubPageChange}
    >
      {(activeSubPageId) => (
        <div className="space-y-4">
          <div className="border border-graphite-border bg-graphite-dark/40 p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-305 uppercase">Aba Analítica: <strong className="text-copper">{activeSubPageId}</strong></span>
          </div>
          <p className="text-xs text-gray-400">
            Fidelidade total de dados. Painéis matemáticos de controle calculados com base no faturamento real captado via adquirentes e processadores de Pix.
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
