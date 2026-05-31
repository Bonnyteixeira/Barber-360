import React from 'react';
import ModuleLayout, { SubPageSpec } from '../../../components/ModuleLayout';

export const adminRoutes: SubPageSpec[] = [
  { id: 'configuracoes', name: 'Configurações' },
  { id: 'planos', name: 'Planos' },
  { id: 'limites', name: 'Limites' },
  { id: 'integracoes', name: 'Integrações' },
  { id: 'feature-flags', name: 'Feature Flags' },
  { id: 'status-plataforma', name: 'Status Plataforma' }
];

interface SubModuleProps {
  activeSubPageId?: string;
  onSubPageChange?: (id: string) => void;
}

export default function AdminModule({ activeSubPageId, onSubPageChange }: SubModuleProps) {
  return (
    <ModuleLayout
      moduleName="Administração Global"
      modulePath="Operations Platform"
      description="Centro de controle absoluto do ecossistema SaaS. Altere os planos globais da empresa, configure limites rígidos por inquilinos, monitore integrações e controle Feature Flags."
      subPages={adminRoutes}
      quickCards={[
        { title: 'Feature Flags', value: '12 Ativas', change: 'Estável', type: 'neutral' },
        { title: 'Conexões API Ext', value: '4 Ativas', change: 'Ok', type: 'positive' },
        { title: 'SLA Plataforma', value: '99.98%', change: 'Últimos 30d', type: 'positive' },
        { title: 'Limiares Travados', value: '3 Tenants', change: 'Sob controle', type: 'neutral' }
      ]}
      secondarySidebarHeader="Configuração Root"
      externalActiveSubPage={activeSubPageId}
      onSubPageChange={onSubPageChange}
    >
      {(activeSubPageId) => (
        <div className="space-y-4">
          <div className="border border-graphite-border bg-graphite-dark/40 p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-305 uppercase">Comutador Global: <strong className="text-copper">{activeSubPageId}</strong></span>
          </div>
          <p className="text-xs text-gray-400">
            Aba de controle restrita aos administradores principais da Barber 360. Qualquer alteração aqui reflete em todos os inquilinos multi-tenant cadastrados.
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
