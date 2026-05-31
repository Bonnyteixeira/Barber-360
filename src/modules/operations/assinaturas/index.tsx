import React from 'react';
import ModuleLayout, { SubPageSpec } from '../../../components/ModuleLayout';

export const assinaturasRoutes: SubPageSpec[] = [
  { id: 'planos', name: 'Planos' },
  { id: 'cobrancas', name: 'Cobranças' },
  { id: 'inadimplentes', name: 'Inadimplentes' },
  { id: 'historico', name: 'Histórico' },
  { id: 'upgrade', name: 'Upgrade' }
];

interface SubModuleProps {
  activeSubPageId?: string;
  onSubPageChange?: (id: string) => void;
}

export default function AssinaturasModule({ activeSubPageId, onSubPageChange }: SubModuleProps) {
  return (
    <ModuleLayout
      moduleName="Faturamento & Assinaturas"
      modulePath="Operations Platform"
      description="Audite planos de assinatura recorrente (SaaS), gerencie cobranças ativas integradas a processadores de pagamentos digitais e controle inadimplentes."
      subPages={assinaturasRoutes}
      quickCards={[
        { title: 'Recorrência Mensal', value: 'R$ 114.890', change: '+14%', type: 'positive' },
        { title: 'Faturas Vencidas', value: '8 faturas', change: 'Sob controle', type: 'neutral' },
        { title: 'Taxa Churn MRR', value: '1.2%', change: '-0.3%', type: 'positive' },
        { title: 'Custos Gateway', value: 'R$ 3.450', change: '3% médio', type: 'negative' }
      ]}
      secondarySidebarHeader="Regras Financeiras SaaS"
      externalActiveSubPage={activeSubPageId}
      onSubPageChange={onSubPageChange}
    >
      {(activeSubPageId) => (
        <div className="space-y-4">
          <div className="border border-graphite-border bg-graphite-dark/40 p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-305 uppercase">Filtro de Faturamento: <strong className="text-copper">{activeSubPageId}</strong></span>
          </div>
          <p className="text-xs text-gray-400">
            Ajuste regras de suspensão automática (ex: após 5 dias de atraso na fatura, bloquear as credenciais API de agendamento e notificação dos inquilinos).
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
