import React, { useState } from 'react';
import { 
  Server, 
  Users2, 
  CreditCard, 
  LifeBuoy, 
  Activity, 
  LineChart, 
  Database, 
  FileSpreadsheet,
  Plus,
  Ban
} from 'lucide-react';
import ModuleLayout, { SubPageSpec } from '../../components/ModuleLayout';

export const operationsRoutes: SubPageSpec[] = [
  { id: 'telemetria', name: 'Central Global Telemetria', icon: <Server className="w-3.5 h-3.5" /> },
  { id: 'tenants', name: 'Controle de Tenants SaaS', icon: <Users2 className="w-3.5 h-3.5" /> },
  { id: 'subscriptions', name: 'Faturamento de Assinaturas', icon: <CreditCard className="w-3.5 h-3.5" /> },
  { id: 'audit_logs', name: 'Audit & Segurança Logs', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> }
];

export default function OperationsModule() {
  const [tenants, setTenants] = useState([
    { id: 't1', name: 'Barbearia do Heitor', subdomain: 'heitor', plan: 'pro', status: 'active', registered: '15/01/2026' },
    { id: 't2', name: 'Barber Classic Club', subdomain: 'classic', plan: 'starter', status: 'active', registered: '12/02/2026' },
    { id: 't3', name: 'Navalha Gold VIP', subdomain: 'navalha_gold', plan: 'enterprise', status: 'active', registered: '03/03/2026' },
    { id: 't4', name: 'Studio Vintage Hair', subdomain: 'vintagehair', plan: 'pro', status: 'suspended', registered: '20/04/2026' }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 101, user: 'fabio@barber360.com.br', action: 'SUSPEND_TENANT', target: 'vintagehair', ip: '189.44.112.5', date: 'Hoje 17:30' },
    { id: 102, user: 'admin_global', action: 'CREATE_TENANT', target: 'navalha_gold', ip: '127.0.0.1', date: 'Ontem 14:15' },
    { id: 103, user: 'diego@barbear.com', action: 'CREATE_BARBER', target: 'heitor', ip: '177.20.90.84', date: 'Ontem 11:30' }
  ]);

  const [newTenantName, setNewTenantName] = useState('');
  const [newSubdomain, setNewSubdomain] = useState('');
  const [newPlan, setNewPlan] = useState('pro');

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim() || !newSubdomain.trim()) return;

    const newT = {
      id: 't' + (tenants.length + 1),
      name: newTenantName,
      subdomain: newSubdomain.toLowerCase(),
      plan: newPlan,
      status: 'active',
      registered: 'Hoje'
    };

    setTenants([...tenants, newT]);
    
    // Log audit trail
    const audit = {
      id: Date.now(),
      user: 'admin_global',
      action: 'CREATE_TENANT',
      target: newSubdomain.toLowerCase(),
      ip: '127.0.0.1',
      date: 'Hoje'
    };
    setAuditLogs([audit, ...auditLogs]);

    setNewTenantName('');
    setNewSubdomain('');
  };

  const handleToggleTenantStatus = (id: string, subdomain: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'active' ? 'suspended' : 'active';
        
        // Log action
        const audit = {
          id: Date.now(),
          user: 'admin_global',
          action: nextStatus === 'suspended' ? 'SUSPEND_TENANT' : 'REACTIVATE_TENANT',
          target: subdomain,
          ip: '127.0.0.1',
          date: 'Hoje'
        };
        setAuditLogs(prevL => [audit, ...prevL]);

        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <ModuleLayout
      moduleName="Operations SaaS Central"
      modulePath="Operations Platform"
      description="Painel de controle unificado e privilegiado para a equipe do Barber 360 gerenciar locações multi-tenant, auditar de forma rigorosa as faturas e inspecionar logs de segurança."
      subPages={operationsRoutes}
      quickCards={[
        { title: 'MRR SaaS Acumulado', value: 'R$ 24.900,00', change: '+18.2%', type: 'positive' },
        { title: 'Locatários Totais', value: `${tenants.length} tenants`, change: '+1', type: 'positive' },
        { title: 'Faturamento Anual', value: 'R$ 298.800,00', change: 'Estável', type: 'positive' },
        { title: 'Uptime Bancos', value: '99.98% SLA', change: 'Perfeito', type: 'positive' }
      ]}
      secondarySidebarHeader="Controle de Ingressos"
      secondarySidebarContent={
        <div className="space-y-4 text-xs font-sans text-gray-455">
          <div>
            <span className="text-[10px] uppercase font-mono text-copper font-bold block mb-1.5 font-semibold">Segurança Sistêmica</span>
            <p className="text-[11px] leading-relaxed">
              Cada transação efetuada nos bancos de dados de qualquer tenant é interceptada pelo middleware do backend e guardada com o endereço IP de origem para integridade fiscal.
            </p>
          </div>

          <div className="bg-[#151618] border border-graphite-border p-3 space-y-1.5 text-[9px] font-mono select-none">
            <span className="text-[9px] uppercase text-copper block">Monitor de Recursos Cloud</span>
            <div>Uso de RAM: <strong className="text-gray-300">42% (Projetado)</strong></div>
            <div>Bancos PostgreSQL: <strong className="text-gray-300">Conectado (Pool pg)</strong></div>
          </div>
        </div>
      }
    >
      {(activeSubPageId) => {
        if (activeSubPageId === 'telemetria') {
          return (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 text-xs text-blue-300 leading-relaxed">
                <strong>[Health Telemetry Status]</strong> Todos os servidores estão operacionais em port 3000. Ingressos de rotas WebSocket e chamadas adicionais de API estão saudáveis sem lentidão acumulada.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="border border-graphite-border bg-[#141517] p-4.5 space-y-2.5">
                  <h4 className="font-bold text-gray-200">Servidores do Sistema (SaaS Host)</h4>
                  <div className="flex justify-between border-b border-graphite-border pb-1">
                    <span>Instância API Cloud Run:</span>
                    <strong className="text-emerald-555">ONLINE (Port 3000)</strong>
                  </div>
                  <div className="flex justify-between border-b border-graphite-border pb-1">
                    <span>Banco de Dados Principal:</span>
                    <strong className="text-emerald-555">CONECTADO</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Servidor Chat WebSocket:</span>
                    <strong className="text-emerald-555">ONLINE</strong>
                  </div>
                </div>

                <div className="border border-graphite-border bg-[#141517] p-4.5 space-y-2.5">
                  <h4 className="font-bold text-gray-200">Limite de Uso de Recursos por Planos</h4>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Plano Starter limits (Visitas /mês)</span>
                      <strong>82% de Teto</strong>
                    </div>
                    <div className="w-full bg-[#111214] h-1.5 border border-graphite-border">
                      <div className="bg-copper h-full" style={{ width: '82%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Plano Pro Limits (Ilimitado)</span>
                      <strong>24% de Teto</strong>
                    </div>
                    <div className="w-full bg-[#111214] h-1.5 border border-graphite-border">
                      <div className="bg-copper h-full" style={{ width: '24%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'tenants') {
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Form to provision new tenant */}
                <div className="lg:col-span-2 border border-graphite-border bg-[#141517] p-5">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Provisionar Novo Locatário (Tenant)</h4>
                  <form onSubmit={handleCreateTenant} className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-bold">NOME DA BARBEARIA</label>
                      <input 
                        type="text" 
                        value={newTenantName}
                        onChange={(e) => setNewTenantName(e.target.value)}
                        placeholder="Ex: Barbearia Imperial"
                        className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-bold">SUBDOMÍNIO SAAS (SLUG)</label>
                      <input 
                        type="text" 
                        value={newSubdomain}
                        onChange={(e) => setNewSubdomain(e.target.value)}
                        placeholder="Ex: imperial"
                        className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-bold">PLANO INICIAL</label>
                      <select 
                        value={newPlan}
                        onChange={(e) => setNewPlan(e.target.value)}
                        className="w-full bg-[#101112] text-xs px-2 py-2 text-gray-200 border border-graphite-border focus:outline-none focus:border-copper"
                      >
                        <option value="starter">Starter (R$ 149/m)</option>
                        <option value="pro">Pro (R$ 299/m)</option>
                        <option value="enterprise">Enterprise (R$ 999/m)</option>
                      </select>
                    </div>

                    <button type="submit" className="w-full py-2 bg-copper text-graphite-dark font-sans font-bold hover:bg-copper/90 transition flex items-center justify-center gap-1 cursor-pointer">
                      <Plus className="w-4 h-4" />
                      Provisionar Tenant
                    </button>
                  </form>
                </div>

                {/* Tenants Directory List */}
                <div className="lg:col-span-3 border border-graphite-border bg-[#141517] p-5 space-y-3">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Bancos de Dados Multi-tenant Ativos</h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin">
                    {tenants.map(t => (
                      <div key={t.id} className="p-3.5 bg-graphite-dark border border-graphite-border flex justify-between items-center text-xs font-mono">
                        <div>
                          <strong className="text-gray-200 text-sm font-sans block">{t.name}</strong>
                          <span className="text-[10px] text-gray-500">Subdomínio: <strong className="text-copper">{t.subdomain}.barber360.com</strong> • Registro: {t.registered}</span>
                          <span className="text-[9px] block text-gray-500 mt-1 uppercase font-bold text-copper">Plano: {t.plan}</span>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleToggleTenantStatus(t.id, t.subdomain)}
                            className={`px-3 py-1 font-mono text-[9px] uppercase font-bold transition flex items-center gap-1 cursor-pointer ${
                              t.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:text-red-400' : 'bg-red-500/10 text-red-400 hover:bg-emerald-500/10 hover:text-emerald-400'
                            }`}
                          >
                            {t.status === 'active' ? 'Ativo' : 'Suspenso'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'subscriptions') {
          return (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Faturamento Contábil do SaaS</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs text-gray-400">
                <div className="p-4 bg-graphite-dark border border-graphite-border space-y-2">
                  <span className="text-copper block font-bold uppercase">Demonstrativo de MRR (Mensal Recorrente)</span>
                  <div className="flex justify-between">
                    <span>Faturamento Líquido:</span>
                    <strong className="text-gray-200">R$ 24.900,00</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxas de Processamento:</span>
                    <strong className="text-red-500">- R$ 1.245,00</strong>
                  </div>
                  <div className="flex justify-between border-t border-graphite-border pt-1.5 font-bold">
                    <span>Saldo a Receber:</span>
                    <strong className="text-emerald-500">R$ 23.655,00</strong>
                  </div>
                </div>

                <div className="p-4 bg-graphite-dark border border-graphite-border space-y-2">
                  <span className="text-copper block font-bold uppercase">Previsão Legal Tributária</span>
                  <p className="text-[11px] font-sans leading-relaxed">SaaS estruturado em conformidade com o regime Simples Nacional (Anexo III - Serviços de Tecnologia da Informação). Alíquota efetiva reduzida inicial de 6% sobre faturamento bruto.</p>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'audit_logs') {
          return (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Console de Auditoria e Segurança Global (WAF & Logs)</h4>
              <div className="space-y-2 font-mono text-xs">
                {auditLogs.map((log, index) => (
                  <div key={index} className="p-3 bg-graphite-dark border border-graphite-border flex justify-between items-center">
                    <div>
                      <span className="text-gray-550 block text-[10px]">{log.date} • IP de Origem: {log.ip}</span>
                      <p className="text-gray-300 mt-0.5">Operador: <strong className="text-copper font-mono font-bold pr-1">{log.user}</strong> executou <strong className="text-gray-100 uppercase">{log.action}</strong> no tenant target <strong className="text-[#A48E7A]">{log.target}</strong></p>
                    </div>
                    <span className="text-[9px] uppercase bg-copper/10 border border-copper/30 px-1.5 py-0.5 text-copper">Seguro</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return null;
      }}
    </ModuleLayout>
  );
}
