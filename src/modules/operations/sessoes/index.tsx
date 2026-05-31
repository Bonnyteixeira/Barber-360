import React from 'react';
import ModuleLayout, { SubPageSpec } from '../../../components/ModuleLayout';

export const sessoesWhatsAppRoutes: SubPageSpec[] = [
  { id: 'conectadas', name: 'Conectadas' },
  { id: 'desconectadas', name: 'Desconectadas' },
  { id: 'instaveis', name: 'Instáveis' },
  { id: 'historico', name: 'Histórico' }
];

interface SubModuleProps {
  activeSubPageId?: string;
  onSubPageChange?: (id: string) => void;
}

export default function SessoesWhatsAppModule({ activeSubPageId, onSubPageChange }: SubModuleProps) {
  return (
    <ModuleLayout
      moduleName="Sessões WhatsApp & Gateways"
      modulePath="Operations Platform"
      description="Gerenciamento cognitivo de instâncias de comunicação com Whatsapp nos inquilinos. Verifique conexões instáveis, sessões desconectadas e disparos acumulados na fila."
      subPages={sessoesWhatsAppRoutes}
      quickCards={[
        { title: 'Instâncias Totais', value: '384', change: 'Estável', type: 'neutral' },
        { title: 'Conexões Ativas', value: '356 online', change: '92.7%', type: 'neutral' },
        { title: 'Sessões Instáveis', value: '12 instâncias', change: '-3 h', type: 'positive' },
        { title: 'Mensagens Fila', value: '45 msgs', change: 'Sob controle', type: 'neutral' }
      ]}
      secondarySidebarHeader="Serviço de Fila"
      externalActiveSubPage={activeSubPageId}
      onSubPageChange={onSubPageChange}
    >
      {(activeSubPageId) => (
        <div className="space-y-4">
          <div className="border border-graphite-border bg-graphite-dark/40 p-3 flex items-center justify-between">
            <span className="text-xs font-mono text-gray-305 uppercase">Filtro Visual: <strong className="text-copper">{activeSubPageId}</strong></span>
          </div>
          <p className="text-xs text-gray-400">
            Monitore a conexabilidade das instâncias de API conectadas. Nossos algoritmos redistribuem e roteiam o fluxo em tempo real de forma automática para evitar quedas generalizadas de atendimento.
          </p>
        </div>
      )}
    </ModuleLayout>
  );
}
