import React, { useState } from 'react';
import { SalonSettings, ServiceItem } from '../types';
import { Calendar, Clock, User, Scissors, DollarSign, MessageSquare, Plus, Check, RefreshCw, Layers, ShieldCheck, HeartPulse, Send, AlertCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface AgendaPanelProps {
  salonSettings: SalonSettings;
}

interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  barberName: string;
  time: string;
  date: string;
  status: 'Agendado' | 'Confirmado' | 'Concluído' | 'Cancelado';
  paymentStatus: 'Pendente' | 'Sinal Pago' | 'Total Pago';
  price: number;
  notes: string;
  historyLogs: {
    time: string;
    text: string;
    type: 'message' | 'system' | 'payment' | 'reminder';
  }[];
}

// Pre-populated appointments for maximum fidelity across different calendar dates
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-1',
    clientName: 'Fábio Teixeira',
    clientPhone: '(21) 98765-4321',
    serviceId: 'srv-1', // Corte Degradê Moderno
    barberName: 'Lucas Navalha',
    time: '14:30',
    date: '2026-05-30',
    status: 'Confirmado',
    paymentStatus: 'Sinal Pago',
    price: 60.00,
    notes: 'Cliente prefere degradê navalhado nas laterais. Pediu para avisar se houver antecipação.',
    historyLogs: [
      { time: '10:05', text: 'Cliente iniciou conversa no WhatsApp com Afonso Atendente.', type: 'system' },
      { time: '10:06', text: 'IA: "Olá Fábio! Sou o Afonso, seu bot de recepção. Quer marcar barba ou só alinhar o degradê hoje?"', type: 'message' },
      { time: '10:07', text: 'Cliente: "Fala Afonso, quero meter o degradê moderno hoje à tarde se tiver."', type: 'message' },
      { time: '10:07', text: 'IA consultou o catálogo de serviços. Identificou "Corte Degradê Moderno (R$ 60,00)".', type: 'system' },
      { time: '10:08', text: 'IA: "Excelente escolha, irmão! Tenho vaga com o mestre Lucas Navalha às 14:30. Pode ser?"', type: 'message' },
      { time: '10:08', text: 'Cliente: "Fechado, pode marcar!"', type: 'message' },
      { time: '10:09', text: 'IA: "Agendado! Enviando link Pix para pagamento do sinal de R$ 15,00 para garantir a vaga de luxo."', type: 'message' },
      { time: '10:10', text: 'Notificação de Pix recebida: R$ 15,00 (Sinal)', type: 'payment' },
      { time: '10:10', text: 'IA: "Sinal recebido com sucesso, parceiro! Seu horário foi CONFIRMADO de forma definitiva. Nos vemos às 14:30. 💈"', type: 'message' },
      { time: '13:00', text: 'Lembrete automático enviado via WhatsApp: "Fala Fábio! Seu corte com Lucas Navalha está confirmado para hoje às 14:30! Evite atrasos."', type: 'reminder' }
    ]
  },
  {
    id: 'appt-2',
    clientName: 'Carlos Eduardo',
    clientPhone: '(21) 99342-9988',
    serviceId: 'srv-3', // Combo Cabelo e Barba
    barberName: 'Diego Barbear',
    time: '16:00',
    date: '2026-05-30',
    status: 'Agendado',
    paymentStatus: 'Pendente',
    price: 90.00,
    notes: 'Deseja experimentar a barboterapia com toalha quente.',
    historyLogs: [
      { time: '11:15', text: 'Instância conectada. Cliente enviou mensagem de agendamento.', type: 'system' },
      { time: '11:16', text: 'IA: "Fala parceiro! Como posso cuidar do seu estilo hoje?"', type: 'message' },
      { time: '11:17', text: 'Cliente: "Quero o combo imperador hoje às 16:00 ou por aí. Pode ser com o Diego?"', type: 'message' },
      { time: '11:18', text: 'IA consultou agenda de Diego Barbear e confirmou a vaga.', type: 'system' },
      { time: '11:18', text: 'IA: "Show, chefe! Consegui separar aqui para você às 16h com o Diego. Ficou pré-agendado."', type: 'message' }
    ]
  },
  {
    id: 'appt-3',
    clientName: 'Bernardo Silva',
    clientPhone: '(21) 97722-1100',
    serviceId: 'srv-2', // Barba Impecável
    barberName: 'Rodrigo Cortes',
    time: '18:15',
    date: '2026-05-30',
    status: 'Concluído',
    paymentStatus: 'Total Pago',
    price: 40.00,
    notes: 'Aparar barba rala, limpar bochechas.',
    historyLogs: [
      { time: '09:00', text: 'Agenda confirmada.', type: 'system' },
      { time: '09:12', text: 'Lembrete matinal respondido positivamente pelo cliente.', type: 'reminder' },
      { time: '12:30', text: 'Barbeiro Rodrigo Cortes iniciou o atendimento presencial.', type: 'system' },
      { time: '12:55', text: 'Corte finalizado. Pagamento processado na maquininha Barber 360.', type: 'payment' }
    ]
  },
  {
    id: 'appt-4',
    clientName: 'Arthur Pendragon',
    clientPhone: '(21) 99333-4455',
    serviceId: 'srv-3',
    barberName: 'Diego Barbear',
    time: '10:00',
    date: '2026-05-29',
    status: 'Concluído',
    paymentStatus: 'Total Pago',
    price: 90.00,
    notes: 'Solicitou toalha quente e massagem facial.',
    historyLogs: [
      { time: '09:45', text: 'Cliente realizou check-in presencial no salão.', type: 'system' },
      { time: '10:50', text: 'Serviço finalizado com sucesso pelo barbeiro Diego.', type: 'system' }
    ]
  },
  {
    id: 'appt-5',
    clientName: 'César Augusto',
    clientPhone: '(21) 98111-2233',
    serviceId: 'srv-1',
    barberName: 'Lucas Navalha',
    time: '11:15',
    date: '2026-05-29',
    status: 'Concluído',
    paymentStatus: 'Total Pago',
    price: 60.00,
    notes: 'Degradê tradicional navalhado.',
    historyLogs: [
      { time: '11:10', text: 'Cliente aguardando na recepção.', type: 'system' }
    ]
  },
  {
    id: 'appt-6',
    clientName: 'Gustavo Lemos',
    clientPhone: '(21) 97766-5544',
    serviceId: 'srv-1',
    barberName: 'Lucas Navalha',
    time: '11:00',
    date: '2026-05-31',
    status: 'Agendado',
    paymentStatus: 'Pendente',
    price: 60.00,
    notes: 'Ligar para confirmar se pode ser adiantado.',
    historyLogs: [
      { time: '14:22', text: 'Agendamento pré-aprovado pela inteligência artificial.', type: 'system' }
    ]
  },
  {
    id: 'appt-7',
    clientName: 'Marcos Vinícius',
    clientPhone: '(21) 98877-6655',
    serviceId: 'srv-3',
    barberName: 'Diego Barbear',
    time: '15:30',
    date: '2026-05-31',
    status: 'Agendado',
    paymentStatus: 'Sinal Pago',
    price: 90.00,
    notes: 'Quer experimentar a cerveja cortesia.',
    historyLogs: [
      { time: '15:00', text: 'Pix recebido: R$ 15,00 referente a caução da reserva.', type: 'payment' }
    ]
  }
];

export default function AgendaPanel({ salonSettings }: AgendaPanelProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [selectedBarber, setSelectedBarber] = useState<string>('Todos');
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'barbers'>('daily');
  
  // Selected date for central view and listing (default May 30, 2026)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 4, 30, 12, 0, 0));
  
  // Reference date for the month showing on the monthly calendar grid (default May 2026)
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(2026, 4, 1, 12, 0, 0));

  // Selected appt for right panel (Timeline Inteligente sidebar detail)
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(INITIAL_APPOINTMENTS[0]);

  // Form states for manual booking (Encaixe/Bloqueio)
  const [showAddForm, setShowAddForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceId, setServiceId] = useState(salonSettings.services[0]?.id || '');
  const [barberName, setBarberName] = useState(salonSettings.barbers[0] || '');
  const [time, setTime] = useState('15:00');
  const [notes, setNotes] = useState('');

  // Manual note typing for active selected timeline
  const [newLogText, setNewLogText] = useState('');
  const [hybridStatus, setHybridStatus] = useState<'ia_control' | 'human_control'>('ia_control');

  // Utility to format date to YYYY-MM-DD
  const formatDateString = (dateObj: Date) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateStr = formatDateString(selectedDate);

  const filteredAppts = appointments.filter(appt => {
    const barberMatch = selectedBarber === 'Todos' || appt.barberName === selectedBarber;
    const dateMatch = appt.date === selectedDateStr;
    return barberMatch && dateMatch;
  });

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !time) return;

    const chosenService = salonSettings.services.find(s => s.id === serviceId);
    const newAppt: Appointment = {
      id: 'appt-' + Math.random().toString(36).substr(2, 9),
      clientName,
      clientPhone: clientPhone || '(21) 90000-0000',
      serviceId,
      barberName,
      time,
      date: formatDateString(selectedDate),
      status: 'Agendado',
      paymentStatus: 'Pendente',
      price: chosenService ? chosenService.price : 45.00,
      notes: notes || 'Agendamento manual inserido pelo painel',
      historyLogs: [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), text: 'Agendamento manual efetuado de forma direta no Barber 360.', type: 'system' }
      ]
    };

    setAppointments([...appointments, newAppt]);
    setSelectedAppt(newAppt);
    setShowAddForm(false);
    
    // reset form
    setClientName('');
    setClientPhone('');
    setNotes('');
  };

  const handleUpdateStatus = (id: string, newStatus: Appointment['status']) => {
    const updated = appointments.map(appt => {
      if (appt.id === id) {
        return {
          ...appt,
          status: newStatus,
          historyLogs: [
            ...appt.historyLogs,
            { 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
              text: `Status do agendamento atualizado para "${newStatus}" pelo operador.`, 
              type: 'system' as const
            }
          ]
        };
      }
      return appt;
    });
    setAppointments(updated);
    // update current panel
    const matchesSelected = updated.find(a => a.id === id);
    if (matchesSelected) setSelectedAppt(matchesSelected);
  };

  const handleUpdatePayment = (id: string, newPay: Appointment['paymentStatus']) => {
    const updated = appointments.map(appt => {
      if (appt.id === id) {
        return {
          ...appt,
          paymentStatus: newPay,
          historyLogs: [
            ...appt.historyLogs,
            { 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
              text: `Fluxo financeiro atualizado: "${newPay}" via painel.`, 
              type: 'payment' as const
            }
          ]
        };
      }
      return appt;
    });
    setAppointments(updated);
    const matchesSelected = updated.find(a => a.id === id);
    if (matchesSelected) setSelectedAppt(matchesSelected);
  };

  const addManualLogMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogText || !selectedAppt) return;

    const updated = appointments.map(appt => {
      if (appt.id === selectedAppt.id) {
        return {
          ...appt,
          historyLogs: [
            ...appt.historyLogs,
            { 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
              text: `[Suporte Humano]: "${newLogText}"`, 
              type: 'message' as const
            }
          ]
        };
      }
      return appt;
    });

    setAppointments(updated);
    const matchesSelected = updated.find(a => a.id === selectedAppt.id);
    if (matchesSelected) setSelectedAppt(matchesSelected);
    setNewLogText('');
  };

  const toggleAtendimentoHibrido = () => {
    const newControl = hybridStatus === 'ia_control' ? 'human_control' : 'ia_control';
    setHybridStatus(newControl);
    
    if (selectedAppt) {
      const updated = appointments.map(appt => {
        if (appt.id === selectedAppt.id) {
          return {
            ...appt,
            historyLogs: [
              ...appt.historyLogs,
              { 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                text: newControl === 'human_control' 
                  ? '⚠️ Atendimento HÍBRIDO: IA PAUSADA temporariamente pelo barbeiro. Operador humano assumiu.'
                  : '🟢 IA REATIVADA automaticamente: o robô voltou a controlar a conversa do WhatsApp.',
                type: 'system' as const
              }
            ]
          };
        }
        return appt;
      });
      setAppointments(updated);
      const matchesSelected = updated.find(a => a.id === selectedAppt.id);
      if (matchesSelected) setSelectedAppt(matchesSelected);
    }
  };

  const getServiceInfo = (id: string): ServiceItem => {
    return salonSettings.services.find(s => s.id === id) || { id: 'generic', name: 'Serviço Personalizado', price: 50.00, duration: 30 };
  };

  const getStatusBadgeClass = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmado': return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      case 'Concluído': return 'bg-blue-500/15 border-blue-500/30 text-blue-400';
      case 'Cancelado': return 'bg-red-500/15 border-red-500/30 text-red-400';
      default: return 'bg-copper/15 border-copper/30 text-copper';
    }
  };

  const getPaymentBadgeClass = (status: Appointment['paymentStatus']) => {
    switch (status) {
      case 'Total Pago': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono';
      case 'Sinal Pago': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 text-[10px] font-mono';
      default: return 'bg-red-500/10 text-red-400 border border-red-500/25 text-[10px] font-mono';
    }
  };

  return (
    <div id="agenda-intelligent-container" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* LEFT & MID: Main Agenda visual / filters (2/3 space) */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Visual Controls / Actions bar */}
        <div className="bg-graphite-panel border border-graphite-border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest block sm:inline">Profissional:</span>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedBarber('Todos')}
                className={`px-3 py-1.5 text-[11px] font-mono transition border ${selectedBarber === 'Todos' ? 'bg-copper text-graphite-dark font-bold border-copper' : 'bg-graphite-dark border-graphite-border text-gray-400 hover:text-gray-100'}`}
              >
                Todos
              </button>
              {salonSettings.barbers.map(barber => (
                <button
                  key={barber}
                  onClick={() => setSelectedBarber(barber)}
                  className={`px-3 py-1.5 text-[11px] font-mono transition border ${selectedBarber === barber ? 'bg-copper text-graphite-dark font-bold border-copper' : 'bg-graphite-dark border-graphite-border text-gray-400 hover:text-gray-100'}`}
                >
                  {barber}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex-1 sm:flex-initial px-4 py-2 bg-copper hover:bg-copper-light text-graphite-dark font-bold font-mono text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Inserir Encaixe</span>
            </button>
            <div className="flex bg-graphite-dark border border-graphite-border p-1">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-2.5 py-1 text-[10px] font-mono ${viewMode === 'daily' ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                title="Agenda Diária"
              >
                Dia
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-2.5 py-1 text-[10px] font-mono ${viewMode === 'weekly' ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-gray-300'}`}
                title="Agenda Semanal"
              >
                Semana
              </button>
            </div>
          </div>
        </div>

        {/* Form add inline encaixe manually */}
        {showAddForm && (
          <form onSubmit={handleAddAppointment} className="bg-graphite-panel border border-graphite-border p-5 space-y-4 animate-in fade-in zoom-in duration-150">
            <h4 className="text-xs font-bold uppercase tracking-widest text-copper font-mono flex items-center gap-1.5 border-b border-graphite-border pb-2.5">
              <Calendar className="w-4 h-4" />
              Adicionar Encaixe Operacional (Manual)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono">Nome do Cliente</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Fabiano Alves"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 bg-graphite-dark border border-graphite-border text-xs text-gray-200 focus:border-copper focus:outline-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono">Telefone WhatsApp</label>
                <input
                  type="text"
                  placeholder="Ex: (21) 90000-1122"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-graphite-dark border border-graphite-border text-xs text-gray-200 focus:border-copper focus:outline-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono">Serviço Pretendido</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-2 py-2 bg-graphite-dark border border-graphite-border text-xs text-gray-200 focus:border-copper focus:outline-none font-sans cursor-pointer"
                >
                  {salonSettings.services.map(srv => (
                    <option key={srv.id} value={srv.id}>{srv.name} - R${srv.price.toFixed(2)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono">Profissional</label>
                <select
                  value={barberName}
                  onChange={(e) => setBarberName(e.target.value)}
                  className="w-full px-2 py-2 bg-graphite-dark border border-graphite-border text-xs text-gray-200 focus:border-copper focus:outline-none font-sans cursor-pointer"
                >
                  {salonSettings.barbers.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-mono">Horário do Encaixe</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 bg-graphite-dark border border-graphite-border text-xs text-gray-200 focus:border-copper focus:outline-none font-mono"
                />
              </div>
              
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] text-gray-500 font-mono">Observações da Cadeira</label>
                <input
                  type="text"
                  placeholder="Ex: Alérgico a gola de pigmento; quer café duplo"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-graphite-dark border border-graphite-border text-xs text-gray-200 focus:border-copper focus:outline-none font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2.5 border-t border-graphite-border">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-1.5 text-xs text-gray-500 hover:text-gray-300 font-mono"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-copper text-graphite-dark font-bold font-mono text-xs hover:bg-copper-light"
              >
                Registrar na Grade
              </button>
            </div>
          </form>
        )}

        {/* Split grid for Month Calendar on the left, and Daily Agenda list on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* COLUMN 1: Month Calendar Widget (lg:col-span-12 xl:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-graphite-panel border border-graphite-border p-4 space-y-4">
              
              {/* Calendar Month Header */}
              <div className="flex items-center justify-between border-b border-graphite-border/60 pb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-copper" />
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C37A4C]">
                    Calendário
                  </span>
                </div>
                
                {/* Month navigation buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1, 12, 0, 0));
                    }}
                    className="p-1 hover:bg-[#333] border border-transparent hover:border-graphite-border text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                    title="Mês Anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-gray-200 uppercase min-w-[95px] text-center select-none">
                    {[
                      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                    ][currentMonthDate.getMonth()]} {currentMonthDate.getFullYear()}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1, 12, 0, 0));
                    }}
                    className="p-1 hover:bg-[#333] border border-transparent hover:border-graphite-border text-gray-400 hover:text-white transition duration-150 cursor-pointer"
                    title="Próximo Mês"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Weekdays row */}
              <div className="grid grid-cols-7 text-center gap-1">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((wd, i) => (
                  <span key={i} className="text-[10px] text-gray-500 font-mono font-bold py-1 select-none">
                    {wd}
                  </span>
                ))}
              </div>

              {/* Days Grid representation */}
              <div className="grid grid-cols-7 gap-1">
                {(() => {
                  const cells = [];
                  const yr = currentMonthDate.getFullYear();
                  const mn = currentMonthDate.getMonth();
                  const daysInM = new Date(yr, mn + 1, 0).getDate();
                  const firstDayIdx = new Date(yr, mn, 1).getDay();

                  // Blank placeholders before day 1
                  for (let i = 0; i < firstDayIdx; i++) {
                    cells.push(
                      <div key={`empty-${i}`} className="h-9 w-full" />
                    );
                  }

                  // Day cells
                  for (let d = 1; d <= daysInM; d++) {
                    const tempDate = new Date(yr, mn, d, 12, 0, 0);
                    const tempDateStr = formatDateString(tempDate);
                    const isSelected = formatDateString(selectedDate) === tempDateStr;
                    const isToday = yr === 2026 && mn === 4 && d === 30; // 30 May 2026 is today's local context

                    const dayAppts = appointments.filter(appt => appt.date === tempDateStr);
                    const numAppts = dayAppts.length;
                    const hasAppts = numAppts > 0;

                    cells.push(
                      <button
                        key={`day-${d}`}
                        type="button"
                        onClick={() => setSelectedDate(tempDate)}
                        className={`h-9 w-full relative flex flex-col items-center justify-center text-xs font-mono transition rounded-none border border-transparent ${
                          isSelected
                            ? 'bg-copper text-graphite-dark font-bold'
                            : isToday
                            ? 'border-copper/60 text-copper font-bold bg-copper/5 hover:bg-[#333]'
                            : 'text-gray-300 hover:bg-[#222] hover:text-white'
                        }`}
                      >
                        <span className={isSelected ? 'text-graphite-dark' : isToday ? 'text-copper' : 'text-gray-300'}>
                          {d}
                        </span>

                        {/* Interactive dynamic visual dots for scheduled appointments on that day */}
                        {hasAppts && (
                          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5 justify-center">
                            {Array.from({ length: Math.min(numAppts, 3) }).map((_, idx) => (
                              <span 
                                key={idx} 
                                className={`w-1 h-1 rounded-full ${isSelected ? 'bg-graphite-dark' : isToday ? 'bg-copper' : 'bg-copper-light/60'}`} 
                              />
                            ))}
                          </span>
                        )}
                      </button>
                    );
                  }
                  return cells;
                })()}
              </div>

              {/* Day Details stats footer */}
              <div className="bg-graphite-dark/40 border border-graphite-border/50 p-3 text-[10px] space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Agenda Selecionada:</span>
                  <strong className="text-copper font-mono">
                    {String(selectedDate.getDate()).padStart(2, '0')}/
                    {String(selectedDate.getMonth() + 1).padStart(2, '0')}/
                    {selectedDate.getFullYear()}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Reservas p/ o dia:</span>
                  <span className="text-gray-200 font-bold bg-copper/10 border border-copper/20 px-1.5 py-0.5 font-mono text-[9px]">
                    {appointments.filter(appt => appt.date === formatDateString(selectedDate)).length} reservado(s)
                  </span>
                </div>
              </div>

            </div>

            {/* Help / Guidance Box */}
            <div className="p-3.5 bg-zinc-900/30 border border-graphite-border flex gap-2.5 text-[10px] leading-relaxed text-gray-500">
              <AlertCircle className="w-4 h-4 text-copper shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-gray-400 block font-mono">Hospitalidade Digital</span>
                <p>Navegue pelos meses de sua barbearia para auditorias de agenda. Clique em dias com pontos de agendamentos para inspecionar conversas e timelines dos clientes.</p>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Operational list grid (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            
            <h3 className="text-xs font-bold text-copper font-mono uppercase tracking-widest flex items-center justify-between border-b border-graphite-border pb-2.5">
              <span>Grade Operacional ({String(selectedDate.getDate()).padStart(2, '0')}/{String(selectedDate.getMonth() + 1).padStart(2, '0')}/{selectedDate.getFullYear()})</span>
              <span className="text-[10px] text-gray-500 font-normal">{filteredAppts.length} agendamentos</span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredAppts.map(appt => {
                const srv = getServiceInfo(appt.serviceId);
                const isSelected = selectedAppt?.id === appt.id;

                return (
                  <div
                    key={appt.id}
                    onClick={() => setSelectedAppt(appt)}
                    className={`border p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer transition ${isSelected ? 'bg-copper/5 border-copper/60 shadow-lg shadow-black/20' : 'bg-graphite-panel border-graphite-border hover:border-[#444]'}`}
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-graphite-dark text-copper font-mono flex flex-col items-center justify-center font-bold text-sm border border-graphite-border shrink-0">
                        <span className="text-xs text-gray-400 font-normal leading-none mb-0.5">Time</span>
                        {appt.time}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-200 truncate">{appt.clientName}</h4>
                          <span className="text-[10px] text-gray-500 font-sans italic">{appt.clientPhone}</span>
                        </div>
                        
                        <div className="flex items-center gap-3.5 text-xs text-gray-400 font-sans">
                          <span className="flex items-center gap-1 truncate max-w-[160px] sm:max-w-xs">
                            <Scissors className="w-3.5 h-3.5 text-copper shrink-0" />
                            {srv.name} (R$ {srv.price.toFixed(2)})
                          </span>
                          <span className="flex items-center gap-1 font-mono text-[10px]">
                            <User className="w-3.5 h-3.5 text-gray-600 shrink-0" />
                            Barbeiro: <strong className="text-gray-300">{appt.barberName}</strong>
                          </span>
                        </div>
                        {appt.notes && (
                          <p className="text-[10px] text-gray-500 italic max-w-sm sm:max-w-md truncate">"{appt.notes}"</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <span className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-mono border ${getStatusBadgeClass(appt.status)}`}>
                        {appt.status}
                      </span>
                      <span className={getPaymentBadgeClass(appt.paymentStatus)}>
                        {appt.paymentStatus}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredAppts.length === 0 && (
                <div className="border border-dashed border-graphite-border p-12 text-center bg-[#151515]/30">
                  <Calendar className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                  <p className="text-xs text-gray-400 font-mono">Nenhum agendamento para o profissional selecionado nesta data no calendário.</p>
                  <p className="text-[10px] text-gray-500 font-sans mt-1">Selecione outro dia ou clique em "Inserir Encaixe" para agendar manual.</p>
                </div>
              )}
            </div>
            
            {/* Sincronização WhatsApp info text */}
            <div className="p-3 bg-zinc-900/10 border border-graphite-border/40 flex gap-2.5 text-[10px] leading-normal text-gray-500">
              <Sparkles className="w-4 h-4 text-copper shrink-0 mt-0.5" />
              <p>A sincronização Pix e WhatsApp é contínua. Os clientes recebem lembretes instantâneos no celular dependendo do status.</p>
            </div>

          </div>

        </div>

      </div>

      {/* RIGHT COLUMN: Timeline Inteligente (1/3 space) */}
      <div className="space-y-6">
        
        {selectedAppt ? (
          <div className="bg-graphite-panel border border-graphite-border flex flex-col h-full min-h-[580px] justify-between">
            
            {/* Timeline Header info */}
            <div>
              <div className="p-5 border-b border-graphite-border bg-black/20 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#b87333]/90 font-mono">Timeline Unificada</h3>
                  <p className="text-[10px] text-gray-500 font-sans mt-0.5">Histórico completo de {selectedAppt.clientName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono block text-gray-500">ID da Reserva</span>
                  <span className="text-xs text-copper font-bold font-mono">{selectedAppt.id}</span>
                </div>
              </div>

              {/* Status Update & Actions Controls in layout */}
              <div className="p-4 bg-graphite-dark/40 border-b border-graphite-border space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] uppercase text-gray-500 font-mono block mb-1">Mudar Status</label>
                    <select
                      value={selectedAppt.status}
                      onChange={(e) => handleUpdateStatus(selectedAppt.id, e.target.value as Appointment['status'])}
                      className="w-full text-xs bg-graphite-dark border border-[#333] text-gray-200 px-1 py-1.5 focus:outline-none cursor-pointer font-sans"
                    >
                      <option value="Agendado">🛎️ Agendado</option>
                      <option value="Confirmado">🟢 Confirmado</option>
                      <option value="Concluído">🏁 Concluído</option>
                      <option value="Cancelado">❌ Cancelado</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase text-gray-500 font-mono block mb-1">Pagamento</label>
                    <select
                      value={selectedAppt.paymentStatus}
                      onChange={(e) => handleUpdatePayment(selectedAppt.id, e.target.value as Appointment['paymentStatus'])}
                      className="w-full text-xs bg-graphite-dark border border-[#333] text-gray-200 px-1 py-1.5 focus:outline-none cursor-pointer font-sans"
                    >
                      <option value="Pendente">⏱️ Pendente</option>
                      <option value="Sinal Pago">💰 Sinal Pago</option>
                      <option value="Total Pago">✅ Total Pago</option>
                    </select>
                  </div>
                </div>

                {/* Atendimento Hibrido Banner switcher */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={toggleAtendimentoHibrido}
                    className={`w-full py-2 border text-[10px] font-mono tracking-wider transition ${hybridStatus === 'ia_control' ? 'bg-[#C37A4C]/5 border-copper/40 text-copper' : 'bg-red-500/15 border-red-500/40 text-red-400 font-bold'}`}
                  >
                    {hybridStatus === 'ia_control' ? '🤖 IA Ativa (Pausar & Assumir Manual)' : '👤 Humano Controlando (Reativar IA)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Logs Body */}
            <div className="p-4 flex-1 overflow-y-auto max-h-[340px] space-y-4 custom-scrollbar bg-black/10">
              
              <div className="relative border-l border-[#333] ml-2.5 pl-4 space-y-4">
                {selectedAppt.historyLogs.map((log, index) => {
                  let badgeColor = "bg-gray-600 border-gray-600 text-white";
                  if (log.type === 'message') badgeColor = "bg-copper/20 border-copper/40 text-copper";
                  if (log.type === 'payment') badgeColor = "bg-emerald-500/20 border-emerald-500/40 text-emerald-400";
                  if (log.type === 'reminder') badgeColor = "bg-blue-500/20 border-blue-500/40 text-blue-400";

                  return (
                    <div key={index} className="relative group text-xs">
                      {/* Timeline dot */}
                      <span className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border ${log.type === 'system' ? 'bg-zinc-850 border-gray-500' : 'bg-copper'}`} />
                      
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-gray-500 font-mono">{log.time}</span>
                        <span className={`text-[8px] font-mono uppercase tracking-widest px-1 py-0.5 border ${badgeColor}`}>
                          {log.type}
                        </span>
                      </div>
                      <p className="text-gray-300 font-sans leading-relaxed text-[11px] bg-graphite-dark/20 p-2 border border-graphite-border/30">
                        {log.text}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Quick intervention text messenger - Atendimento Hibrido Support input */}
            <form onSubmit={addManualLogMessage} className="p-4 border-t border-graphite-border bg-graphite-dark/60">
              <span className="text-[10px] text-gray-500 font-mono block mb-1.5">Mandar mensagem no WhatsApp (Chat Híbrido)</span>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Estou enviando como humano..."
                  value={newLogText}
                  onChange={(e) => setNewLogText(e.target.value)}
                  className="flex-1 bg-graphite-dark border border-[#333] text-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-copper font-sans"
                />
                <button
                  type="submit"
                  disabled={!newLogText}
                  className="p-2 bg-copper disabled:bg-[#333] text-graphite-dark rounded-none cursor-pointer duration-150"
                  title="Enviar mensagem direta"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

          </div>
        ) : (
          <div className="bg-graphite-panel border border-graphite-border p-12 text-center flex flex-col justify-center items-center h-[580px]">
            <Layers className="w-8 h-8 text-gray-600 mb-2" />
            <p className="text-xs text-gray-400 font-mono">Selecione um cliente para carregar a Timeline Inteligente da conversa.</p>
          </div>
        )}

      </div>

    </div>
  );
}
