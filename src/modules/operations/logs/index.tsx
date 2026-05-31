import React from 'react';
import ModuleLayout, { SubPageSpec } from '../../../components/ModuleLayout';

export const logsRoutes: SubPageSpec[] = [
  { id: 'sistema', name: 'Sistema' },
  { id: 'conversas', name: 'Conversas' },
  { id: 'alteracoes', name: 'Alterações' },
  { id: 'seguranca', name: 'Segurança' }
];

interface SubModuleProps {
  activeSubPageId?: string;
  onSubPageChange?: (id: string) => void;
}

export default function LogsModule({ activeSubPageId, onSubPageChange }: SubModuleProps) {
  return (
    <ModuleLayout
      moduleName="Logs & Auditoria"
      modulePath="Operations Platform"
      description="Trilhas brutas de logs de sistema, alterações críticas cadastrais, conversas passadas integradas a agentes autônomos e segurança da informação."
      subPages={logsRoutes}
      quickCards={[
        { title: 'Logs de Eventos', value: '458.2k', change: '+12% sem', type: 'neutral' },
        { title: 'Alarmes Disparados', value: '0', change: 'Estável', type: 'positive' },
        { title: 'Alterações Banco', value: '1.2k', change: 'Auditado', type: 'neutral' },
        { title: 'IPs Bloqueados', value: '1', change: 'Firewall ativo', type: 'positive' }
      ]}
      secondarySidebarHeader="Trilhas e Telemetrias"
      externalActiveSubPage={activeSubPageId}
      onSubPageChange={onSubPageChange}
    >
      {(activeSubPageId) => (
        <div className="space-y-4">
          <div className="border border-graphite-border bg-graphite-dark/40 p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-305 uppercase">Ambiente: <strong className="text-copper">{activeSubPageId}</strong></span>
          </div>
          <p className="text-xs text-gray-400">
            Acompanhe o painel de auditorias em conformidade com as regras gerais de proteção a dados, garantindo privacidade a todos os inquilinos multi-tenant cadastrados.
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
