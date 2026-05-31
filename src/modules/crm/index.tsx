import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Trash2, 
  Plus, 
  Award, 
  Clock, 
  Cake, 
  Search,
  Filter,
  Activity,
  History
} from 'lucide-react';
import ModuleLayout, { SubPageSpec } from '../../components/ModuleLayout';

export const crmRoutes: SubPageSpec[] = [
  { id: 'clients', name: 'Lista de Clientes', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'vip', name: 'Clientes VIP (Score)', icon: <Award className="w-3.5 h-3.5" /> },
  { id: 'inactive', name: 'Inativos (Churn)', icon: <Clock className="w-3.5 h-3.5" /> },
  { id: 'birthdays', name: 'Aniversariantes', icon: <Cake className="w-3.5 h-3.5" /> }
];

export default function CrmModule() {
  const [clients, setClients] = useState([
    { id: '1', name: 'Gabriel Medina', phone: '(11) 99122-3344', classification: 'vip', spent: 540.00, appCount: 9, lastApp: '3 dias atrás', birthday: '05/06' },
    { id: '2', name: 'Neymar Junior', phone: '(11) 98212-5566', classification: 'vip', spent: 890.00, appCount: 12, lastApp: '5 dias atrás', birthday: '12/10' },
    { id: '3', name: 'Filipe Toledo', phone: '(11) 97341-9988', classification: 'regular', spent: 180.00, appCount: 3, lastApp: '20 dias atrás', birthday: '28/05' },
    { id: '4', name: 'Roberto Carlos', phone: '(11) 96172-1122', classification: 'inactive', spent: 60.00, appCount: 1, lastApp: '35 dias atrás', birthday: '15/04' },
    { id: '5', name: 'Arthur Aguiar', phone: '(11) 99341-2475', classification: 'inactive', spent: 120.00, appCount: 2, lastApp: '65 dias atrás', birthday: '30/05' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientBday, setNewClientBday] = useState('');

  const [showToast, setShowToast] = useState(false);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newClientPhone.trim()) return;

    const newClientObj = {
      id: String(Date.now()),
      name: newClientName,
      phone: newClientPhone,
      classification: 'regular',
      spent: 0.00,
      appCount: 0,
      lastApp: 'Nenhum',
      birthday: newClientBday || '15/12'
    };

    setClients([newClientObj, ...clients]);
    setNewClientName('');
    setNewClientPhone('');
    setNewClientBday('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleDeleteClient = (id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <ModuleLayout
      moduleName="Relacionamento e CRM"
      modulePath="Client Platform"
      description="Base de dados inteligente de fidelização de clientes. Identifique automaticamente clientes VIP, acompanhe frequência de comparecimento e monitore inativos com filtros dinâmicos de evasão."
      subPages={crmRoutes}
      quickCards={[
        { title: 'Base Cadastrada', value: '1,450 clientes', change: '+12.5%', type: 'positive' },
        { title: 'Score VIP Médio', value: '184 contatos', change: '+8%', type: 'positive' },
        { title: 'Evasão (Inatividade)', value: '4.2 %', change: '-1.2%', type: 'positive' },
        { title: 'Aniversariantes Mês', value: '34 clientes', change: 'Engajando', type: 'positive' }
      ]}
      secondarySidebarHeader="Filtros Inteligentes"
      secondarySidebarContent={
        <div className="space-y-4 text-xs font-sans text-gray-450">
          <div>
            <span className="text-[10px] uppercase font-mono text-copper font-bold block mb-1.5">Score de Fidelidade</span>
            <p className="text-[11px] leading-relaxed">
              Os clientes são reclassificados automaticamente de forma dinâmica com base em visitas concluídas e faturamento agregável no banco de dados.
            </p>
          </div>

          <div className="bg-[#151618] border border-graphite-border p-3 space-y-1 text-[10px] font-mono">
            <span className="text-[9px] uppercase text-copper block font-semibold">Parâmetro VIP</span>
            <div className="flex justify-between">
              <span>Recorrência mínima:</span>
              <span className="text-gray-300">Min 3 cortes/trim</span>
            </div>
            <div className="flex justify-between">
              <span>Faturamento min:</span>
              <span className="text-gray-300">R$ 150 /semestre</span>
            </div>
          </div>
        </div>
      }
    >
      {(activeSubPageId) => {
        if (activeSubPageId === 'clients') {
          return (
            <div className="space-y-6">
              {showToast && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3.5 text-xs font-mono">
                  ✓ Cadastro efetuado com sucesso! Informações salvas em ambiente multi-tenant isolado e unificado.
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Add customer card */}
                <div className="border border-graphite-border bg-[#141517] p-5">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Cadastrar Novo Contato (CRM)</h4>
                  <form onSubmit={handleAddClient} className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-bold">NOME DO CLIENTE</label>
                      <input 
                        type="text" 
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        placeholder="Nome Completo"
                        className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-bold">WHATSAPP (CELULAR)</label>
                        <input 
                          type="text" 
                          value={newClientPhone}
                          onChange={(e) => setNewClientPhone(e.target.value)}
                          placeholder="(11) 99999-9999"
                          className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-gray-400 font-bold">ANIVERSÁRIO (DD/MM)</label>
                        <input 
                          type="text" 
                          value={newClientBday}
                          onChange={(e) => setNewClientBday(e.target.value)}
                          placeholder="Ex: 30/05"
                          className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-2 bg-copper text-graphite-dark font-sans font-bold hover:bg-copper/90 transition flex items-center justify-center gap-1 cursor-pointer">
                      <Plus className="w-4 h-4" />
                      Registrar Cliente
                    </button>
                  </form>
                </div>

                {/* Directory List of clients */}
                <div className="border border-graphite-border bg-[#141517] p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-graphite-border">
                    <h4 className="text-xs font-bold text-gray-200 font-mono uppercase">Clientes Registrados</h4>
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-graphite-dark font-mono text-[10px] px-2.5 py-1 text-gray-300 border border-graphite-border focus:outline-none focus:border-copper"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 max-h-[250px] overflow-y-auto scrollbar-thin">
                    {filteredClients.map(c => (
                      <div key={c.id} className="p-3 bg-[#111214] border border-graphite-border flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-gray-200 font-sans block">{c.name}</strong>
                          <span className="text-[10px] text-gray-500 font-mono">{c.phone} • Último corte: {c.lastApp}</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            c.classification === 'vip' ? 'bg-amber-500/10 text-amber-500' : c.classification === 'inactive' ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/15 text-gray-400'
                          }`}>
                            {c.classification}
                          </span>
                          <button onClick={() => handleDeleteClient(c.id)} className="p-1 text-red-500 hover:bg-red-500/10 transition">
                            <Trash2 className="w-3.5 h-3.5" />
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

        if (activeSubPageId === 'vip') {
          const vipClients = clients.filter(c => c.classification === 'vip');
          return (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Módulo Clientes VIP — Ranqueamento Automático</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vipClients.map(c => (
                  <div key={c.id} className="p-4 bg-amber-500/5 border border-amber-550/30 font-mono text-xs flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-sans text-gray-200 block">{c.name}</strong>
                      <span className="text-gray-500 block mt-1">Total Consumido: <strong className="text-amber-500">R$ {c.spent.toFixed(2)}</strong></span>
                      <span className="text-[10px] text-gray-500">Frequência acumulada: {c.appCount} visitas completadas</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded">VIP RATING ★</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'inactive') {
          const inactiveClients = clients.filter(c => c.classification === 'inactive');
          return (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Módulo Clientes Em Risco de Evasão (Ausentes)</h4>
              <div className="space-y-3">
                {inactiveClients.map(c => (
                  <div key={c.id} className="p-4 bg-red-500/5 border border-red-950/40 text-xs font-mono flex justify-between items-center">
                    <div>
                      <strong className="text-sm font-sans text-gray-200 block">{c.name}</strong>
                      <span className="text-gray-500 text-[10px] uppercase font-bold block mt-1.5">Ausente há mais de 30 dias • Último corte: {c.lastApp}</span>
                    </div>
                    <div className="flex gap-2.5">
                      <span className="text-[10px] text-red-500 bg-red-500/10 px-2 py-0.5 uppercase whitespace-nowrap">Risco CRÍTICO de Churn</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'birthdays') {
          return (
            <div className="space-y-4 font-mono text-xs">
              <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Aniversariantes do Mês de Maio 🎂</h4>
              <div className="space-y-3 font-sans">
                {clients.filter(c => c.birthday.includes('/05')).map(c => (
                  <div key={c.id} className="p-4 bg-copper/5 border border-copper/30 flex justify-between items-center">
                    <div>
                      <strong className="text-gray-200 text-sm block">{c.name}</strong>
                      <span className="text-xs text-gray-500 font-mono">Data de Nascimento: {c.birthday} • Telefone: {c.phone}</span>
                    </div>
                    <span className="text-[10px] text-copper bg-copper/15 font-mono px-2 py-0.5 uppercase">Bônus de Niver Pronto</span>
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
