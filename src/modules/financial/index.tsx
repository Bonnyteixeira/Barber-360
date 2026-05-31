import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  ArrowUpRight, 
  Plus, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import ModuleLayout, { SubPageSpec } from '../../components/ModuleLayout';

export const financialRoutes: SubPageSpec[] = [
  { id: 'fluxo', name: 'Fluxo de Caixa', icon: <DollarSign className="w-3.5 h-3.5" /> },
  { id: 'comissoes', name: 'Divisão de Comissões', icon: <Percent className="w-3.5 h-3.5" /> }
];

export default function FinancialModule() {
  const [entries, setEntries] = useState([
    { id: 1, type: 'revenue', desc: 'Serviço Combo (Corte + Barba) - Gabriel Medina', value: 95.00, date: 'Hoje 14h' },
    { id: 2, type: 'expense', desc: 'Compra de Suprimentos Capilares (Sprays, Óleos)', value: 180.00, date: 'Ontem' },
    { id: 3, type: 'revenue', desc: 'Serviço Coloração Blindada - Henrique Juliano', value: 180.00, date: 'Ontem' },
    { id: 4, type: 'revenue', desc: 'Estética Sobrancelhas Designer - Marcos Lima', value: 35.00, date: '28/05' }
  ]);

  const [commissions, setCommissions] = useState([
    { id: 1, barber: 'Diego Barbear', calculated: 360.00, status: 'pendente' },
    { id: 2, barber: 'Lucas Navalha', calculated: 180.00, status: 'pendente' },
    { id: 3, barber: 'Rodrigo Cortes', calculated: 240.00, status: 'pago' }
  ]);

  const [newDesc, setNewDesc] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newType, setNewType] = useState('revenue');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newValue);
    if (!newDesc.trim() || isNaN(val)) return;

    const entry = {
      id: Date.now(),
      type: newType,
      desc: newDesc,
      value: val,
      date: 'Hoje'
    };

    setEntries([entry, ...entries]);
    setNewDesc('');
    setNewValue('');
  };

  const handlePayCommission = (id: number) => {
    setCommissions(prev => prev.map(comm => comm.id === id ? { ...comm, status: 'pago' } : comm));
  };

  // Aggregated sums
  const totalRevenue = entries.filter(e => e.type === 'revenue').reduce((sum, e) => sum + e.value, 0);
  const totalExpense = entries.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.value, 0);
  const netEarnings = totalRevenue - totalExpense;

  return (
    <ModuleLayout
      moduleName="Departamento Financeiro"
      modulePath="Client Platform"
      description="Gerencie as finanças do salão. Registre receitas ordinárias de serviços, controle despesas de insumos e liquide comissões por barbeiro com split calculável."
      subPages={financialRoutes}
      quickCards={[
        { title: 'Saldo Operacional', value: `R$ ${netEarnings.toFixed(2)}`, change: '+8.4%', type: 'positive' },
        { title: 'Faturamento Bruto', value: `R$ ${totalRevenue.toFixed(2)}`, change: '+12.5%', type: 'positive' },
        { title: 'Comissões Devidas', value: 'R$ 540,00', change: 'Estável', type: 'neutral' },
        { title: 'Insumos do Período', value: `R$ ${totalExpense.toFixed(2)}`, change: 'Sob controle', type: 'positive' }
      ]}
      secondarySidebarHeader="Regras Contábeis"
      secondarySidebarContent={
        <div className="space-y-4 text-xs font-sans text-gray-450">
          <div>
            <span className="text-[10px] uppercase font-mono text-copper font-bold block mb-1.5 font-semibold">Tabela de Splits</span>
            <p className="text-[11px] leading-relaxed">As comissões são provisionadas instantaneamente no momento em que a agenda é encerrada pelo profissional, diminuindo o tempo de consolidação quinzenal das folhas.</p>
          </div>
          <div className="bg-[#151618] border border-graphite-border p-3 space-y-1.5 font-mono text-[10px]">
            <span className="text-[9px] uppercase text-copper block">Auditoria Fiscal</span>
            <div className="flex justify-between">
              <span>Alíquota MEI:</span>
              <span className="text-gray-300">R$ 72.00 /m</span>
            </div>
            <div className="flex justify-between">
              <span>Deduções ISS:</span>
              <span className="text-gray-300">Isento</span>
            </div>
          </div>
        </div>
      }
    >
      {(activeSubPageId) => {
        if (activeSubPageId === 'fluxo') {
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Form to insert cash action */}
              <div className="lg:col-span-5 border border-graphite-border bg-[#141517] p-5">
                <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Lançar Balanço no Livro Caixa</h4>
                <form onSubmit={handleAddEntry} className="space-y-3.5 text-xs font-mono">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-bold">TIPO DE TRANSAÇÃO</label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => setNewType('revenue')}
                        className={`flex-1 py-1.5 text-xs text-center border font-bold uppercase transition ${
                          newType === 'revenue' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'border-graphite-border text-gray-500'
                        }`}
                      >
                        Receita (+)
                      </button>
                      <button 
                        type="button"
                        onClick={() => setNewType('expense')}
                        className={`flex-1 py-1.5 text-xs text-center border font-bold uppercase transition ${
                          newType === 'expense' ? 'bg-red-500/10 border-red-500 text-red-400' : 'border-graphite-border text-gray-500'
                        }`}
                      >
                        Despesa (-)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-bold">DESCRIÇÃO DO LANÇAMENTO</label>
                    <input 
                      type="text" 
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Ex: Compra de Lâminas / Serviço de Barba"
                      className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-bold">VALOR (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper font-mono"
                      required
                    />
                  </div>

                  <button type="submit" className="w-full py-2 bg-copper text-graphite-dark font-sans font-bold hover:bg-copper/90 transition flex items-center justify-center gap-1 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Adicionar Transação
                  </button>
                </form>
              </div>

              {/* Transactions List */}
              <div className="lg:col-span-7 border border-graphite-border bg-[#141517] p-5">
                <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Livro Caixa Recente</h4>
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto scrollbar-thin">
                  {entries.map(e => (
                    <div key={e.id} className="p-3 bg-[#111214] border border-graphite-border flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-gray-300 font-sans block">{e.desc}</strong>
                        <span className="text-[10px] text-gray-500 font-mono">{e.date}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className={`text-[13px] font-bold ${e.type === 'revenue' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {e.type === 'revenue' ? '+' : '-'} R$ {e.value.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'comissoes') {
          return (
            <div className="space-y-6">
              <div className="border border-graphite-border bg-[#141517] p-5">
                <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Comissões Provisionadas / Fechamento de Folha</h4>
                <div className="space-y-3">
                  {commissions.map(comm => (
                    <div key={comm.id} className="p-3.5 bg-graphite-dark border border-graphite-border flex justify-between items-center text-xs font-mono">
                      <div>
                        <strong className="text-sm font-sans text-gray-200 block">{comm.barber}</strong>
                        <span className="text-[10px] text-gray-500">Comissões acumuladas a pagar referentes a serviços efetuados.</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-bold text-gray-300">R$ {comm.calculated.toFixed(2)}</span>
                        {comm.status === 'pendente' ? (
                          <button 
                            onClick={() => handlePayCommission(comm.id)}
                            className="px-3 py-1 bg-copper text-graphite-dark font-sans font-bold text-[10px] hover:bg-copper/90 transition"
                          >
                            Pagar Composição
                          </button>
                        ) : (
                          <span className="text-[9px] uppercase font-bold text-emerald-555 bg-emerald-500/10 px-2 py-0.5 whitespace-nowrap">Quitado</span>
                        )}
                      </div>
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
