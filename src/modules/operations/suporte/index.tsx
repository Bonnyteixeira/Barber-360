import React from 'react';
import ModuleLayout, { SubPageSpec } from '../../../components/ModuleLayout';

export const suporteRoutes: SubPageSpec[] = [
  { id: 'tickets', name: 'Tickets' },
  { id: 'em-atendimento', name: 'Em Atendimento' },
  { id: 'resolvidos', name: 'Resolvidos' },
  { id: 'base-conhecimento', name: 'Base Conhecimento' }
];

interface SubModuleProps {
  activeSubPageId?: string;
  onSubPageChange?: (id: string) => void;
}

export default function SuporteModule({ activeSubPageId, onSubPageChange }: SubModuleProps) {
  return (
    <ModuleLayout
      moduleName="Central de Atendimento & Suporte"
      modulePath="Operations Platform"
      description="Gerencie fila de tickets abertos pelos inquilinos do SaaS (Barbearias), resolva dúvidas sobre parametrização de IA e nutra a base de conhecimento."
      subPages={suporteRoutes}
      quickCards={[
        { title: 'Tíquetes Abertos', value: '4 fila', change: '-2 hoje', type: 'positive' },
        { title: 'Tempo Médio SLA', value: '18 min', change: '-5 min', type: 'positive' },
        { title: 'Satisfação CSAT', value: '97.2%', change: '+1.5%', type: 'positive' },
        { title: 'IA Triagem Resolv.', value: '42%', change: '+10%', type: 'positive' }
      ]}
      secondarySidebarHeader="Fila de Tíquetes"
      externalActiveSubPage={activeSubPageId}
      onSubPageChange={onSubPageChange}
    >
      {(activeSubPageId) => (
        <div className="space-y-4">
          <div className="border border-graphite-border bg-graphite-dark/40 p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-305 uppercase">Filtro Visual: <strong className="text-copper">{activeSubPageId}</strong></span>
          </div>
          <p className="text-xs text-gray-400">
            Acompanhe o painel de triagem automática operado por IA que categoriza, prioriza e sugere respostas rápidas aos operadores de suporte da central corporativa.
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
