import React, { useState } from 'react';
import { SalonSettings, ServiceItem } from '../types';
import { Scissors, MapPin, Clock, Phone, User, Plus, Trash2, Save, Sparkles, Check } from 'lucide-react';

interface SalonConfigPanelProps {
  settings: SalonSettings;
  onSave: (newSettings: SalonSettings) => void;
}

export default function SalonConfigPanel({ settings, onSave }: SalonConfigPanelProps) {
  const [salonName, setSalonName] = useState(settings.name);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [hours, setHours] = useState(settings.hours);
  const [services, setServices] = useState<ServiceItem[]>(settings.services);
  const [barbers, setBarbers] = useState<string[]>(settings.barbers);

  // New item temp states
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('50');
  const [newServiceDur, setNewServiceDur] = useState('30');
  
  const [newBarberName, setNewBarberName] = useState('');
  
  const [savedSuccess, setSavedSuccess] = useState(false);

  const addService = () => {
    if (!newServiceName || !newServicePrice) return;
    const item: ServiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newServiceName,
      price: parseFloat(newServicePrice) || 0,
      duration: parseInt(newServiceDur) || 30
    };
    setServices([...services, item]);
    setNewServiceName('');
    setNewServicePrice('50');
    setNewServiceDur('30');
  };

  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const addBarber = () => {
    if (!newBarberName) return;
    if (!barbers.includes(newBarberName)) {
      setBarbers([...barbers, newBarberName]);
    }
    setNewBarberName('');
  };

  const removeBarber = (name: string) => {
    setBarbers(barbers.filter(b => b !== name));
  };

  const handleGlobalSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: salonName,
      address,
      phone,
      hours,
      services,
      barbers
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  return (
    <form onSubmit={handleGlobalSave} id="salon-config-form" className="space-y-6">
      
      {/* Save action top notification bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-graphite-panel border border-graphite-border p-5 rounded-none shadow-lg">
        <div>
          <h2 className="text-base font-bold text-gray-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-copper" />
            Dados Básicos de Grounding (Contexto)
          </h2>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Ao salvar, estas informações são automaticamente injetadas como base de conhecimento para todos os seus Agentes de IA.
          </p>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 bg-copper hover:bg-copper-light text-graphite-dark font-bold rounded-none text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-95 duration-150"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-950" />
              <span>Salvo com Sucesso!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: Main Info */}
        <div className="space-y-5 bg-graphite-panel border border-graphite-border p-6 rounded-none flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono mb-2 border-b border-graphite-border pb-3">Informações Gerais</h3>
          
          <div className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <label className="block text-xs text-gray-400 font-mono">Nome Oficial da Barbearia</label>
              <div className="relative">
                <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  value={salonName}
                  onChange={(e) => setSalonName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-graphite-dark border border-graphite-border focus:border-copper rounded-none text-gray-200 placeholder-gray-700 text-sm focus:outline-none transition font-sans"
                  placeholder="Ex: Barbearia El Patron"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-gray-400 font-mono">Endereço Completo</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-graphite-dark border border-graphite-border focus:border-copper rounded-none text-gray-200 placeholder-gray-700 text-sm focus:outline-none transition font-sans"
                  placeholder="Ex: Av. Copacabana, 1020 - Rio de Janeiro"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs text-gray-400 font-mono">WhatsApp / Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-graphite-dark border border-graphite-border focus:border-copper rounded-none text-gray-200 placeholder-gray-700 text-sm focus:outline-none transition font-sans"
                    placeholder="Ex: (21) 99999-8888"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-gray-400 font-mono">Horário de Atendimento</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-graphite-dark border border-graphite-border focus:border-copper rounded-none text-gray-200 placeholder-gray-700 text-sm focus:outline-none transition font-sans"
                    placeholder="Ex: Seg a Sáb - 09h às 20h"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Barbers list management */}
          <div className="border-t border-graphite-border pt-5 mt-5">
            <h4 className="text-xs font-bold text-gray-300 font-mono flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-copper" />
              Equipe de Barbeiros Profissionais
            </h4>

            {/* Existing Barbers tag cloud */}
            {barbers.length === 0 ? (
              <p className="text-xs text-gray-500 font-sans italic mb-3">Nenhum barbeiro cadastrado em comissões.</p>
            ) : (
              <div className="flex flex-wrap gap-2 mb-4">
                {barbers.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-graphite-dark border border-graphite-border text-xs text-gray-300 font-sans"
                  >
                    <span>{b}</span>
                    <button
                      type="button"
                      onClick={() => removeBarber(b)}
                      className="text-gray-500 hover:text-red-400 focus:outline-none transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Quick Add Barber Input row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newBarberName}
                onChange={(e) => setNewBarberName(e.target.value)}
                placeholder="Ex: Diego Barbear"
                className="flex-1 px-3.5 py-2 bg-graphite-dark border border-graphite-border focus:border-copper rounded-none text-xs text-gray-200 focus:outline-none font-sans"
              />
              <button
                type="button"
                onClick={addBarber}
                className="px-3.5 py-2 bg-graphite-dark text-gray-300 hover:text-copper hover:bg-neutral-800 border border-graphite-border rounded-none transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="text-xs">Add</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Service Catalog & Prices */}
        <div className="bg-graphite-panel border border-graphite-border p-6 rounded-none flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono mb-4 border-b border-graphite-border pb-3">Tabela de Serviços & Preços</h3>

            {/* Catalogo de servicos existing list scrollable */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="p-3 bg-graphite-dark border border-graphite-border rounded-none flex items-center justify-between text-xs transition-all hover:border-copper/25"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-copper/10 rounded-none text-copper border border-copper/10">
                      <Scissors className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-200">{service.name}</h4>
                      <p className="text-gray-500 font-sans text-[11px] mt-0.5">{service.duration} mins de execução</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-copper bg-copper/5 px-2 py-1 rounded-none border border-copper/15">
                      R$ {service.price.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      className="p-1 px-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-none transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {services.length === 0 && (
                <p className="text-xs text-gray-500 font-sans italic text-center py-8">Nenhum serviço mapeado ainda. Cadastre abaixo!</p>
              )}
            </div>
          </div>

          {/* Quick Add Service interactive row container footer */}
          <div className="border-t border-graphite-border pt-5 mt-5">
            <h4 className="text-xs font-bold text-gray-300 font-mono mb-3">Adicionar Novo Serviço ao Catálogo</h4>
            
            <div className="grid grid-cols-2 gap-3.5 mb-3">
              <div className="col-span-2 space-y-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Nome do Serviço</span>
                <input
                  type="text"
                  placeholder="Ex: Barboterapia Premium"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full px-3 py-2 bg-graphite-dark border border-graphite-border focus:border-copper rounded-none text-xs text-gray-300 focus:outline-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Preço (R$)</span>
                <input
                  type="number"
                  placeholder="80"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="w-full px-3 py-2 bg-graphite-dark border border-graphite-border focus:border-copper rounded-none text-xs text-gray-300 focus:outline-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Duração (Min)</span>
                <input
                  type="number"
                  placeholder="30"
                  value={newServiceDur}
                  onChange={(e) => setNewServiceDur(e.target.value)}
                  className="w-full px-3 py-2 bg-graphite-dark border border-graphite-border focus:border-copper rounded-none text-xs text-gray-300 focus:outline-none font-sans"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={addService}
              className="w-full py-2 bg-graphite-dark hover:bg-neutral-800 border border-graphite-border text-gray-300 hover:text-copper rounded-none text-xs flex items-center justify-center gap-1 cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Serviço</span>
            </button>
          </div>

        </div>

      </div>

    </form>
  );
}
