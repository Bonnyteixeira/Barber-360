import React, { useState } from 'react';
import { 
  Store, 
  Clock, 
  ShieldCheck, 
  Sliders, 
  Save, 
  HelpCircle,
  Database
} from 'lucide-react';
import ModuleLayout, { SubPageSpec } from '../../components/ModuleLayout';

export const settingsRoutes: SubPageSpec[] = [
  { id: 'perfil', name: 'Perfil Barbearia', icon: <Store className="w-3.5 h-3.5" /> },
  { id: 'horarios', name: 'Grade de Horários', icon: <Clock className="w-3.5 h-3.5" /> },
  { id: 'backup', name: 'Backups Plataforma', icon: <Database className="w-3.5 h-3.5" /> }
];

export default function SettingsModule() {
  const [name, setName] = useState('Barbearia Heitor');
  const [phone, setPhone] = useState('(11) 98765-4321');
  const [address, setAddress] = useState('Av. Doutor Heitor, 360 - Centro');
  const [backupLogs, setBackupLogs] = useState<string[]>([
    'Backup automático gerado em nuvem: barber360_prod_db_20260530_030000.sql.gz',
    'Política de retenção de 15 dias ativa: backups antigos podados.'
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage('✓ Informações do perfil salvas com sucesso em banco de dados isolado.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTriggerBackup = () => {
    setToastMessage('Iniciando dump de segurança do banco PostgreSQL...');
    setTimeout(() => {
      const dateStr = new Date().toISOString().replace(/[-:T.]/g, '_').slice(0, 15);
      const filename = `barber360_prod_db_${dateStr}.sql.gz`;
      setBackupLogs(prev => [
        `Backup manual solicitado pelo operador: ${filename}`,
        ...prev
      ]);
      setToastMessage('✓ Backup bem-sucedido! Arquivos guardados no repositório seguro.');
    }, 1200);
  };

  return (
    <ModuleLayout
      moduleName="Configurações Gerais"
      modulePath="Client Platform"
      description="Ajuste parâmetros de funcionamento da barbearia, gerencie horários de atendimento geral e configure backups de segurança."
      subPages={settingsRoutes}
      quickCards={[
        { title: 'Status do Banco', value: 'Conectado', change: 'Uptime 100%', type: 'positive' },
        { title: 'Total Backups', value: '14 dumps', change: 'Enforçado', type: 'positive' },
        { title: 'Limites de Planos', value: 'Sem restrições', change: 'Ativo', type: 'positive' },
        { title: 'Dispositivo Ativo', value: 'WhatsApp', change: 'Sincronizado', type: 'positive' }
      ]}
      secondarySidebarHeader="Ajuda e Suporte"
      secondarySidebarContent={
        <div className="space-y-4 text-xs font-sans text-gray-450">
          <div>
            <span className="text-[10px] uppercase font-mono text-copper font-bold block mb-1.5 font-semibold">Instruções de Backups</span>
            <p className="text-[11px] leading-relaxed">
              O sistema gera dumps comprimidos automáticamente do banco PostgreSQL todas as madrugadas e deleta instâncias mais velhas que 15 dias para respeitar limites de armazenamento.
            </p>
          </div>
        </div>
      }
    >
      {(activeSubPageId) => {
        if (activeSubPageId === 'perfil') {
          return (
            <div className="space-y-6">
              {toastMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3.5 text-xs font-mono">
                  {toastMessage}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="border border-graphite-border bg-[#141517] p-5 space-y-4 font-mono text-xs">
                <h4 className="text-xs font-bold text-gray-200 uppercase border-b border-graphite-border pb-2.5 block">Perfil Público da Barbearia</h4>
                
                <div className="space-y-1">
                  <label className="text-gray-400 font-bold">NOME CORPORATIVO</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-bold">TELEFONE DO ESTABELECIMENTO</label>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-bold">ENDEREÇO LOGÍSTICO</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button type="submit" className="flex items-center gap-1.5 px-4.5 py-2 bg-copper text-graphite-dark font-sans font-bold text-xs hover:bg-copper/90 transition">
                    <Save className="w-3.5 h-3.5" />
                    Salvar Perfil
                  </button>
                </div>
              </form>
            </div>
          );
        }

        if (activeSubPageId === 'horarios') {
          return (
            <div className="space-y-4 font-mono text-xs text-gray-400">
              <h4 className="text-xs font-bold text-gray-200 uppercase border-b border-graphite-border pb-2 block">Grade Comercial Padrão</h4>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-graphite-border/30 pb-1.5">
                  <span>Segunda-feira a Sexta-feira:</span>
                  <strong className="text-gray-200">09:00h - 20:00h</strong>
                </div>
                <div className="flex justify-between border-b border-graphite-border/30 pb-1.5">
                  <span>Sábado:</span>
                  <strong className="text-gray-200">08:00h - 19:30h</strong>
                </div>
                <div className="flex justify-between">
                  <span>Domingo:</span>
                  <strong className="text-red-500 uppercase">Fechado</strong>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'backup') {
          return (
            <div className="space-y-6">
              {toastMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3.5 text-xs font-mono">
                  {toastMessage}
                </div>
              )}

              <div className="border border-graphite-border bg-[#141517] p-5 space-y-4 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-graphite-border pb-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-gray-200 uppercase">Instâncias de backups de Segurança</h4>
                    <p className="text-[10px] text-gray-500 font-sans mt-0.5">Dispare dumps forçados do banco de dados local ou audite snapshots criados automaticamente pela cron script.</p>
                  </div>
                  <button 
                    onClick={handleTriggerBackup}
                    className="px-4 py-1.5 bg-copper text-graphite-dark font-sans font-bold hover:bg-copper/90 transition"
                  >
                    Gerar dump manual
                  </button>
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin text-[11px] text-gray-400 leading-relaxed">
                  {backupLogs.map((log, i) => (
                    <div key={i} className="p-2 bg-graphite-dark border border-graphite-border/60">
                      • {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        return null;
      }}
    </ModuleLayout>
  );
}
