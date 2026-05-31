import React, { useState } from 'react';
import { DollarSign, Plus, Trash2, ArrowUpRight, ArrowDownRight, Percent, PiggyBank, Briefcase, RefreshCw, Key, Shield } from 'lucide-react';
import { SalonSettings } from '../types';

interface FinancialPanelProps {
  salonSettings: SalonSettings;
}

interface Transaction {
  id: string;
  description: string;
  value: number;
  type: 'receita' | 'despesa';
  date: string;
  category: string;
  barberName?: string; // If commission or associated payout
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', description: 'Corte Degradê + Sobrancelha (Fábio)', value: 80.00, type: 'receita', date: 'Hoje', category: 'Serviço', barberName: 'Lucas Navalha' },
  { id: 'tx-2', description: 'Sinal Pix Agendamento (Carlos)', value: 15.00, type: 'receita', date: 'Hoje', category: 'Sinal Pix', barberName: 'Diego Barbear' },
  { id: 'tx-3', description: 'Recompra Gillette Caixa (100un)', value: 45.00, type: 'despesa', date: 'Hoje', category: 'Insumo' },
  { id: 'tx-4', description: 'Combo Imperial Completo (Beto)', value: 90.00, type: 'receita', date: 'Ontem', category: 'Serviço', barberName: 'Lucas Navalha' },
  { id: 'tx-5', description: 'Energia Elétrica (Maio/26)', value: 340.00, type: 'despesa', date: '25/05/2026', category: 'Contas Fixas' }
];

export default function FinancialPanel({ salonSettings }: FinancialPanelProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [desc, setDesc] = useState('');
  const [val, setVal] = useState('');
  const [type, setType] = useState<'receita' | 'despesa'>('receita');
  const [category, setCategory] = useState('Serviço');
  const [associatedBarber, setAssociatedBarber] = useState(salonSettings.barbers[0] || 'Nenhum');

  // Commissions parameters
  const [commissionPct, setCommissionPct] = useState<number>(50); // Default 50% commission

  // Prox credentials for sinal Pix
  const [pixKey, setPixKey] = useState('pix@barbeariaimperador.com.br');
  const [pixSinalValue, setPixSinalValue] = useState<number>(15.00);

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !val) return;

    const numValue = parseFloat(val);
    if (isNaN(numValue)) return;

    const newTx: Transaction = {
      id: 'tx-' + Math.random().toString(36).substr(2, 9),
      description: desc,
      value: numValue,
      type,
      date: 'Hoje',
      category,
      barberName: type === 'receita' && associatedBarber !== 'Nenhum' ? associatedBarber : undefined
    };

    setTransactions([newTx, ...transactions]);
    setDesc('');
    setVal('');
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Calculations
  const totalReceitas = transactions
    .filter(t => t.type === 'receita')
    .reduce((acc, t) => acc + t.value, 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'despesa')
    .reduce((acc, t) => acc + t.value, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  // Commissions breakdown list
  const getBarberCommissions = () => {
    const breakdown: Record<string, { totalService: number; commission: number }> = {};
    
    // Initialize standard barbers from client list
    salonSettings.barbers.forEach(b => {
      breakdown[b] = { totalService: 0, commission: 0 };
    });

    // Sum service values
    transactions.forEach(t => {
      if (t.type === 'receita' && t.barberName && breakdown[t.barberName]) {
        breakdown[t.barberName].totalService += t.value;
        breakdown[t.barberName].commission += (t.value * (commissionPct / 100));
      }
    });

    return Object.entries(breakdown).map(([name, data]) => ({
      name,
      totalSpent: data.totalService,
      commissionPayout: data.commission
    }));
  };

  return (
    <div id="finance-simple-panel" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: Dashboard Analytics & Pix Gateway Core (1/3 space) */}
      <div className="space-y-6">
        
        {/* analytical calculations boxes */}
        <div className="bg-graphite-panel border border-graphite-border p-5 space-y-4">
          <h4 className="text-[10px] font-bold font-mono tracking-widest text-gray-500 uppercase border-b border-graphite-border pb-2 flex justify-between items-center">
            <span>Caixa Consolidado</span>
            <span className="text-[9px] uppercase font-bold text-copper font-mono">Maio 2026</span>
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-black/20 border border-graphite-border">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase font-mono">Faturamento (Receitas)</span>
                  <span className="text-base font-bold font-mono text-gray-200">R$ {totalReceitas.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-black/20 border border-graphite-border">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-red-400" />
                <div>
                  <span className="text-[9px] text-gray-500 block uppercase font-mono">Custos Totais (Despesas)</span>
                  <span className="text-base font-bold font-mono text-gray-200">R$ {totalDespesas.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-copper/5 border border-copper/15">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-copper" />
                <div>
                  <span className="text-[9px] text-copper block uppercase font-mono">Saldo Líquido</span>
                  <span className="text-lg font-bold font-mono text-gray-100">R$ {saldoLiquido.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Módulo Pix para Sinal / Agendamentos */}
        <div className="bg-graphite-panel border border-graphite-border p-5 space-y-4">
          <h4 className="text-[10px] font-bold font-mono tracking-widest text-[#b87333]/90 uppercase border-b border-graphite-border pb-2.5 flex items-center gap-2">
            <Key className="w-4 h-4 text-copper" />
            Configurações Pix de Garantia
          </h4>

          <div className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-mono">Chave Pix Comercial da Barbearia</label>
              <input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="w-full px-3 py-2 bg-graphite-dark border border-[#333] text-xs text-gray-200 focus:outline-none focus:border-copper font-sans"
                placeholder="Ex: CNPJ ou E-mail"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-mono">Valor Limite do Sinal (Taxa de Reserva)</label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                <input
                  type="number"
                  value={pixSinalValue}
                  onChange={(e) => setPixSinalValue(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 bg-graphite-dark border border-[#333] text-xs text-gray-200 focus:outline-none focus:border-copper font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-black/20 border border-graphite-border rounded-none space-y-1 text-gray-500 leading-relaxed font-sans text-[11px]">
              <p className="text-gray-300 font-bold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-copper" />
                Segurança Anti-No-Show
              </p>
              <p>O Barber 360 integra-se com gateways Pix de forma que, se o cliente agendar e não depositar o sinal de garantia no prazo de 10 minutos, o robô remove a reserva automaticamente de sua grade operacional, liberando o horário para outros clientes.</p>
            </div>
          </div>
        </div>

      </div>

      {/* MID COLUMN: Financial Records Book (1/3 space) */}
      <div className="space-y-6">
        
        {/* Register input Finance Form */}
        <div className="bg-graphite-panel border border-graphite-border p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#b87333]/90 font-mono flex items-center gap-2">
            <Plus className="w-4 h-4 text-copper" />
            Adicionar Registro Caixa
          </h3>

          <form onSubmit={handleAddTransaction} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setType('receita'); setCategory('Serviço'); }}
                className={`py-2 text-[11px] font-mono border ${type === 'receita' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold' : 'bg-graphite-dark border-graphite-border text-gray-500'}`}
              >
                + Receita (Entrada)
              </button>
              <button
                type="button"
                onClick={() => { setType('despesa'); setCategory('Insumo'); }}
                className={`py-2 text-[11px] font-mono border ${type === 'despesa' ? 'bg-red-500/10 border-red-500 text-red-500 font-bold' : 'bg-graphite-dark border-graphite-border text-gray-500'}`}
              >
                - Despesa (Saída)
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-mono">Breve Descrição</label>
              <input
                type="text"
                required
                placeholder="Ex: Aluguel da Maquininha Barber360"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full px-3 py-2 bg-graphite-dark border border-[#333] text-xs text-gray-200 focus:outline-none focus:border-copper font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono">Valor Total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  className="w-full px-3 py-2 bg-graphite-dark border border-[#333] text-xs text-gray-200 focus:outline-none focus:border-copper font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono">Categoria</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full py-2 bg-graphite-dark border border-[#333] text-xs text-gray-200 focus:outline-none pointer-events-auto cursor-pointer"
                >
                  {type === 'receita' ? (
                    <>
                      <option value="Serviço">💈 Serviço de Cadeira</option>
                      <option value="Sinal Pix">💰 Sinal de Garantia</option>
                      <option value="Venda Produto">🧼 Venda de Pomada/Óleo</option>
                    </>
                  ) : (
                    <>
                      <option value="Insumo">📦 Lâminas e Descartáveis</option>
                      <option value="Contas Fixas">🏛️ Contas e Aluguel</option>
                      <option value="Marketing">📱 Facebook/Insta Ads</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {type === 'receita' && (
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono">Barbeiro Executor (Comissão)</label>
                <select
                  value={associatedBarber}
                  onChange={(e) => setAssociatedBarber(e.target.value)}
                  className="w-full py-2 bg-graphite-dark border border-[#333] text-xs text-gray-200 focus:outline-none pointer-events-auto cursor-pointer"
                >
                  <option value="Nenhum">Nenhum (Venda Direta)</option>
                  {salonSettings.barbers.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-copper hover:bg-copper-light text-graphite-dark font-bold font-mono text-xs cursor-pointer transition shadow-md duration-150 rounded-none uppercase tracking-wider"
            >
              Lançar no Fluxo
            </button>
          </form>
        </div>

        {/* Transactions list */}
        <div className="bg-graphite-panel border border-graphite-border p-4 space-y-3.5">
          <h4 className="text-[10px] font-bold font-mono tracking-widest text-gray-500 uppercase border-b border-graphite-border pb-1.5">Lançamentos Recentes</h4>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 text-xs">
            {transactions.map(t => (
              <div key={t.id} className="p-2.5 bg-graphite-dark border border-graphite-border flex justify-between items-center bg-black/10">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${t.type === 'receita' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <p className="font-bold text-gray-200 truncate">{t.description}</p>
                  </div>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t.date} · {t.category} {t.barberName ? `(${t.barberName})` : ''}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono font-bold ${t.type === 'receita' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === 'receita' ? '+' : '-'} R$ {t.value.toFixed(2)}
                  </span>
                  <button onClick={() => handleDelete(t.id)} className="text-gray-600 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Commissions Payout breakdown (1/3 space) */}
      <div className="bg-graphite-panel border border-graphite-border p-6 space-y-5">
        
        <div className="border-b border-graphite-border pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-copper font-mono">Comissão por Barbeiro</h3>
            <p className="text-[10px] text-gray-400 font-sans mt-0.5">Módulo de Divisão de Caixa Automatizado</p>
          </div>
          <div className="flex items-center gap-1 bg-graphite-dark border border-[#333] px-2 py-1">
            <Percent className="w-3 h-3 text-copper" />
            <input
              type="number"
              value={commissionPct}
              onChange={(e) => setCommissionPct(parseFloat(e.target.value) || 0)}
              className="w-8 bg-transparent text-xs text-gray-200 font-mono focus:outline-none text-center"
              maxLength={2}
            />
            <span className="text-[10px] text-gray-500">%</span>
          </div>
        </div>

        <div className="space-y-3.5">
          <p className="text-[11px] text-gray-500 font-sans leading-relaxed">
            Cada serviço processado que contenha o nome do barbeiro associado calcula a comissão padrão para aquele profissional. Veja o faturamento acumulado por cadeira:
          </p>

          <div className="space-y-2.5">
            {getBarberCommissions().map(barberBreak => (
              <div key={barberBreak.name} className="p-4 bg-graphite-dark/40 border border-graphite-border flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-gray-300 font-mono flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-copper" />
                    {barberBreak.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 font-sans mt-0.5">Executou: R$ {barberBreak.totalSpent.toFixed(2)} em trânsito</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-mono block text-gray-500">Comissão ({commissionPct}%)</span>
                  <span className="text-xs font-bold font-mono text-emerald-400">R$ {barberBreak.commissionPayout.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#222428] border border-graphite-border p-3.5 text-[11px] text-gray-500 space-y-1 font-sans">
            <p className="text-gray-300 font-bold flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-copper" />
              Estorno / Pagamentos
            </p>
            <p className="leading-snug">Ao fim de cada quinzena, o barbeiro visualiza esses relatórios e confirma as comissões por sua própria conta restrita, garantindo auditoria limpa e sem complicação.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
