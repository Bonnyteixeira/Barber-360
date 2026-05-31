import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Scissors, 
  Plus, 
  CheckCircle, 
  Trash2, 
  RefreshCw,
  Eye
} from 'lucide-react';
import ModuleLayout, { SubPageSpec } from '../../components/ModuleLayout';

export const schedulingRoutes: SubPageSpec[] = [
  { id: 'agenda', name: 'Grade de Horários', icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: 'barbeiros', name: 'Barbeiros Catalog', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'servicos', name: 'Catálogo de Serviços', icon: <Scissors className="w-3.5 h-3.5" /> }
];

export default function SchedulingModule() {
  const [appointments, setAppointments] = useState([
    { id: '1', client: 'Gabriel Medina', service: 'Corte Social', barber: 'Diego Barbear', time: '14:00 - 14:45', status: 'confirmado' },
    { id: '2', client: 'Neymar Junior', service: 'Barba Terapia', barber: 'Lucas Navalha', time: '15:15 - 15:45', status: 'confirmado' },
    { id: '3', client: 'Filipe Toledo', service: 'Corte Navalhado', barber: 'Rodrigo Cortes', time: '16:00 - 16:45', status: 'pendente' }
  ]);

  const [barbers, setBarbers] = useState([
    { id: '1', name: 'Diego Barbear', specialties: ['Corte Clássico', 'Barba Designer'], commission: '50.00%', isAvailable: true },
    { id: '2', name: 'Lucas Navalha', specialties: ['Navalhado Platinado', 'Alinhamento'], commission: '50.00%', isAvailable: true },
    { id: '3', name: 'Rodrigo Cortes', specialties: ['Visagismo', 'Selagem de Fios'], commission: '45.00%', isAvailable: true }
  ]);

  const [services, setServices] = useState([
    { id: '1', name: 'Corte Degradê Social', duration: '45 min', price: 'R$ 60,00' },
    { id: '2', name: 'Barba Completa Real', duration: '30 min', price: 'R$ 45,00' },
    { id: '3', name: 'Combinação Corte + Barba', duration: '75 min', price: 'R$ 95,00' },
    { id: '4', name: 'Coloração Platinada', duration: '120 min', price: 'R$ 180,00' }
  ]);

  // Form states for creating booking
  const [newClient, setNewClient] = useState('');
  const [newService, setNewService] = useState('Corte Degradê Social');
  const [newBarber, setNewBarber] = useState('Diego Barbear');
  const [newTime, setNewTime] = useState('17:00 - 17:45');

  const [newBarberName, setNewBarberName] = useState('');
  const [newBarberSpecs, setNewBarberSpecs] = useState('');

  const [showToast, setShowToast] = useState(false);

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim()) return;

    const booking = {
      id: String(Date.now()),
      client: newClient,
      service: newService,
      barber: newBarber,
      time: newTime,
      status: 'pendente'
    };

    setAppointments([...appointments, booking]);
    setNewClient('');
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  const handleCreateBarber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarberName.trim()) return;

    const barber = {
      id: String(Date.now()),
      name: newBarberName,
      specialties: newBarberSpecs ? newBarberSpecs.split(',').map(s => s.trim()) : ['Design Masculino'],
      commission: '50.00%',
      isAvailable: true
    };

    setBarbers([...barbers, barber]);
    setNewBarberName('');
    setNewBarberSpecs('');
  };

  return (
    <ModuleLayout
      moduleName="Gestão de Agendas & Sincronias"
      modulePath="Client Platform"
      description="Gerencie as cadeiras e horários do seu estabelecimento. Insira compromissos manualmente ou monitore agendamentos captados autonomamente via WhatsApp pela IA."
      subPages={schedulingRoutes}
      quickCards={[
        { title: 'Taxa de Ocupação', value: '78.5%', change: '+5.4%', type: 'positive' },
        { title: 'Não-Comparecimento (No-show)', value: '1.2%', change: '-35%', type: 'positive' },
        { title: 'Atendimentos Hoje', value: '38 cortes', change: 'Estável', type: 'neutral' },
        { title: 'Sincronizador Agenda', value: '100% On', change: 'Ativo', type: 'positive' }
      ]}
      secondarySidebarHeader="Status dos Profissionais"
      secondarySidebarContent={
        <div className="space-y-3.5 text-xs font-sans text-gray-400">
          <div>
            <span className="text-[10px] uppercase font-mono text-copper font-bold block mb-1.5">Conectores Ativos</span>
            <p className="text-[11px] leading-relaxed">As agendas de todos os profissionais são consolidadas em tempo real. Notificações automáticas de modificação de agendamentos são enviadas ao respectivo cliente.</p>
          </div>

          <div className="bg-[#151618] border border-graphite-border p-3 space-y-2">
            <span className="text-[9px] uppercase font-mono text-copper font-semibold block">Barbeiros na Grade</span>
            {barbers.map((barber) => (
              <div key={barber.id} className="flex justify-between items-center text-[10px] border-b border-graphite-border pb-1">
                <span>{barber.name}</span>
                <span className="font-mono text-emerald-555 uppercase">Livre</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      {(activeSubPageId) => {
        if (activeSubPageId === 'agenda') {
          return (
            <div className="space-y-6">
              {showToast && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3.5 text-xs font-mono">
                  ✓ Agendamento criado com sucesso! Notificação com lembrete de 2h pré-programado enviada ao WhatsApp do cliente.
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Form to reserve manually */}
                <div className="border border-graphite-border bg-[#141517] p-5">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Reservar Horário Manualmente</h4>
                  <form onSubmit={handleAddAppointment} className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-bold">NOME DO CLIENTE</label>
                      <input 
                        type="text" 
                        value={newClient} 
                        onChange={(e) => setNewClient(e.target.value)}
                        placeholder="Nome Completo do Cliente"
                        className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper" 
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-bold">SERVIÇO</label>
                        <select 
                          value={newService} 
                          onChange={(e) => setNewService(e.target.value)}
                          className="w-full bg-[#101112] text-xs px-2 py-2 text-gray-200 border border-graphite-border focus:outline-none focus:border-copper"
                        >
                          {services.map(s => <option key={s.id}>{s.name}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-gray-400 font-bold">BARBEIRO</label>
                        <select 
                          value={newBarber} 
                          onChange={(e) => setNewBarber(e.target.value)}
                          className="w-full bg-[#101112] text-xs px-2 py-2 text-gray-200 border border-graphite-border focus:outline-none focus:border-copper"
                        >
                          {barbers.map(b => <option key={b.id}>{b.name}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-bold">HORÁRIO DISPONÍVEL</label>
                      <select 
                        value={newTime} 
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full bg-[#101112] text-xs px-2 py-2 text-gray-200 border border-graphite-border focus:outline-none focus:border-copper"
                      >
                        <option>17:00 - 17:45</option>
                        <option>18:00 - 18:30</option>
                        <option>18:45 - 19:30</option>
                        <option>20:00 - 20:45</option>
                      </select>
                    </div>

                    <button type="submit" className="w-full py-2 bg-copper text-graphite-dark font-sans font-bold hover:bg-copper/90 transition flex items-center justify-center gap-1 cursor-pointer">
                      <Plus className="w-4 h-4" />
                      Criar Reservar
                    </button>
                  </form>
                </div>

                {/* Live appointments list */}
                <div className="border border-graphite-border bg-[#141517] p-5">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Compromissos para Hoje</h4>
                  <div className="space-y-3">
                    {appointments.map(app => (
                      <div key={app.id} className="p-3.5 bg-graphite-dark border border-graphite-border flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-gray-200 font-mono block">{app.client}</strong>
                          <span className="text-[10px] text-gray-500 font-sans">{app.service} ({app.time}) • {app.barber}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded ${
                            app.status === 'confirmado' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-copper/10 text-copper'
                          }`}>
                            {app.status}
                          </span>
                          <button 
                            onClick={() => handleCancelAppointment(app.id)}
                            className="p-1 text-red-500 hover:bg-red-500/10 transition"
                            title="Excluir Agendamento"
                          >
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

        if (activeSubPageId === 'barbeiros') {
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form to create barber */}
                <div className="border border-graphite-border bg-[#141517] p-5">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Cadastrar Novo Profissional (Barbeiro)</h4>
                  <form onSubmit={handleCreateBarber} className="space-y-4 text-xs font-mono">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-bold">NOME INTEGRO</label>
                      <input 
                        type="text" 
                        value={newBarberName} 
                        onChange={(e) => setNewBarberName(e.target.value)}
                        placeholder="Nome do Profissional"
                        className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper" 
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-bold">ESPECIALIDADES (Separadas por vírgula)</label>
                      <input 
                        type="text" 
                        value={newBarberSpecs} 
                        onChange={(e) => setNewBarberSpecs(e.target.value)}
                        placeholder="Ex: Degradê Platinado, Barba Designer, Visagismo"
                        className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper" 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-bold">TAXA DE COMISSÃO (% PADRÃO)</label>
                      <input 
                        type="text" 
                        defaultValue="50.00"
                        className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-500 border border-graphite-border select-all focus:outline-none" 
                        disabled
                      />
                    </div>

                    <button type="submit" className="w-full py-2 bg-copper text-graphite-dark font-sans font-bold hover:bg-copper/90 transition flex items-center justify-center gap-1 cursor-pointer">
                      <Plus className="w-4 h-4" />
                      Cadastrar Barbeiro
                    </button>
                  </form>
                </div>

                {/* Professional Directory */}
                <div className="space-y-3">
                  {barbers.map(barber => (
                    <div key={barber.id} className="p-4 bg-graphite-dark border border-graphite-border flex justify-between items-start">
                      <div>
                        <strong className="text-gray-200 font-mono text-sm block">{barber.name}</strong>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {barber.specialties.map((spec, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-graphite-panel border border-graphite-border text-[9px] text-gray-400 uppercase font-mono">{spec}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-xs font-mono">
                        <span className="text-copper block">Comissão: {barber.commission}</span>
                        <span className="text-emerald-555 text-[10px] uppercase font-bold block mt-1">Disponível</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'servicos') {
          return (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 mb-3.5">Catálogo de Serviços Ativos</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(srv => (
                  <div key={srv.id} className="p-4 bg-[#141517] border border-graphite-border flex justify-between items-center text-xs font-mono">
                    <div>
                      <strong className="text-gray-200 block text-sm font-sans mb-1">{srv.name}</strong>
                      <span className="text-gray-500">Duração de Execução: <strong className="text-copper">{srv.duration}</strong></span>
                    </div>
                    <span className="text-base font-bold text-gray-200">{srv.price}</span>
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
