import React from 'react';
import ModuleLayout, { SubPageSpec } from '../../../components/ModuleLayout';

export const monitoramentoIaRoutes: SubPageSpec[] = [
  { id: 'uso', name: 'Uso' },
  { id: 'custos', name: 'Custos' },
  { id: 'performance', name: 'Performance' },
  { id: 'erros', name: 'Erros' },
  { id: 'logs', name: 'Logs' }
];

interface SubModuleProps {
  activeSubPageId?: string;
  onSubPageChange?: (id: string) => void;
}

export default function MonitoramentoIaModule({ activeSubPageId, onSubPageChange }: SubModuleProps) {
  return (
    <ModuleLayout
      moduleName="Monitoramento Cognitivo IA"
      modulePath="Operations Platform"
      description="Rastreabilidade analítica profunda de custos e performance de requisições de Inteligência Artificial processados na plataforma via Gemini API."
      subPages={monitoramentoIaRoutes}
      quickCards={[
        { title: 'Tempo Médio Resposta', value: '420ms', change: 'Altamente rápido', type: 'positive' },
        { title: 'Tokens Globais / d', value: '12.4M tkn', change: '+12%', type: 'neutral' },
        { title: 'Erros Gemini / d', value: '0.01%', change: 'Estável', type: 'positive' },
        { title: 'Custo Acumulado Mês', value: 'R$ 842,00', change: 'Projetado R$1.2k', type: 'neutral' }
      ]}
      secondarySidebarHeader="Controles API"
      externalActiveSubPage={activeSubPageId}
      onSubPageChange={onSubPageChange}
    >
      {(activeSubPageId) => (
        <div className="space-y-4">
          <div className="border border-graphite-border bg-graphite-dark/40 p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-305 uppercase">Filtro de Telemetria: <strong className="text-copper">{activeSubPageId}</strong></span>
          </div>
          <p className="text-xs text-gray-400">
            Acompanhe o consumo cognitivo por barbearia inquilina. Aplique travas rígidas de uso quando um tenant ultrapassar o limite contratado em sua assinatura Pro.
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
