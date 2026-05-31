import React from 'react';
import ModuleLayout, { SubPageSpec } from '../../../components/ModuleLayout';

export const equipeRoutes: SubPageSpec[] = [
  { id: 'colaboradores', name: 'Colaboradores' },
  { id: 'permissoes', name: 'Permissões' },
  { id: 'cargos', name: 'Cargos' },
  { id: 'auditoria', name: 'Auditoria' }
];

interface SubModuleProps {
  activeSubPageId?: string;
  onSubPageChange?: (id: string) => void;
}

export default function EquipeModule({ activeSubPageId, onSubPageChange }: SubModuleProps) {
  return (
    <ModuleLayout
      moduleName="Gestão de Equipe & Permissões"
      modulePath="Operations Platform"
      description="Gerencie os membros internos da operação SaaS. Ajuste permissões de acesso (RBAC), herança de grupos e configure politicas de auditoria de segurança."
      subPages={equipeRoutes}
      quickCards={[
        { title: 'Colaboradores', value: '14 Ativos', change: 'Estável', type: 'neutral' },
        { title: 'Permissões RBAC', value: '5 Perfis', change: 'Seguro', type: 'positive' },
        { title: 'Tentativas Incorretas', value: '0', change: 'Sem incidentes', type: 'positive' },
        { title: 'Auditorias Críticas', value: '184 logs', change: 'Estável', type: 'neutral' }
      ]}
      secondarySidebarHeader="Controles do Pessoal"
      externalActiveSubPage={activeSubPageId}
      onSubPageChange={onSubPageChange}
    >
      {(activeSubPageId) => (
        <div className="space-y-4">
          <div className="border border-graphite-border bg-graphite-dark/40 p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-305 uppercase">Filtro Administrativo: <strong className="text-copper">{activeSubPageId}</strong></span>
          </div>
          <p className="text-xs text-gray-400">
            Customize os perfis de acesso (ex: suporte de Nível 1 não pode visualizar as chaves cognitivas globais da API Gemini ou realizar reembolsos financeiros directos).
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
