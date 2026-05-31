import React from 'react';
import ModuleLayout, { SubPageSpec } from '../../../components/ModuleLayout';

export const financeiroSaasRoutes: SubPageSpec[] = [
  { id: 'receita', name: 'Receita' },
  { id: 'custos', name: 'Custos' },
  { id: 'ia', name: 'IA' },
  { id: 'assinaturas', name: 'Assinaturas' },
  { id: 'resultado', name: 'Resultado' }
];

interface SubModuleProps {
  activeSubPageId?: string;
  onSubPageChange?: (id: string) => void;
}

export default function FinanceiroSaasModule({ activeSubPageId, onSubPageChange }: SubModuleProps) {
  return (
    <ModuleLayout
      moduleName="Gestão Financeira SaaS"
      modulePath="Operations Platform"
      description="Relatório de demonstração de fluxo de caixa, custos de infraestrutura operacional, faturamento líquido e deduções gateway."
      subPages={financeiroSaasRoutes}
      quickCards={[
        { title: 'Faturamento Anual', value: 'R$ 1.3M', change: 'Projetado', type: 'positive' },
        { title: 'Custo de Servidores', value: 'R$ 8.420', change: '0.6% fatur.', type: 'positive' },
        { title: 'Dedução gateway', value: 'R$ 4.250', change: 'Estável', type: 'neutral' },
        { title: 'Margem Líquida', value: '88%', change: 'Altamente Saudável', type: 'positive' }
      ]}
      secondarySidebarHeader="Demonstrativos Corporativos"
      externalActiveSubPage={activeSubPageId}
      onSubPageChange={onSubPageChange}
    >
      {(activeSubPageId) => (
        <div className="space-y-4">
          <div className="border border-graphite-border bg-graphite-dark/40 p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-305 uppercase">Filtro Financeiro: <strong className="text-copper">{activeSubPageId}</strong></span>
          </div>
          <p className="text-xs text-gray-400">
            Estatísticas financeiras voltadas a tomadas de decisão da gerência executiva do Barber 360.
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
