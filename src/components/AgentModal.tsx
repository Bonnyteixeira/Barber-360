import React, { useState, useEffect } from 'react';
import { Agent, SectorType } from '../types';
import { X, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

interface AgentModalProps {
  isOpen: boolean;
  agent?: Agent | null; // If editing
  onClose: () => void;
  onSave: (agent: Omit<Agent, 'id' | 'createdAt' | 'status'> & { id?: string }) => void;
}

const SECTOR_TEMPLATES: Record<SectorType, { instructions: string; greetingMessage: string; avatar: string }> = {
  'Atendimento/Recepção': {
    avatar: '🛎️',
    greetingMessage: 'Olá! Sou o agente virtual de Recepção da barbearia. Como posso te ajudar a agendar ou escolher um corte hoje?',
    instructions: 'Sua responsabilidade é responder dúvidas de clientes, listar serviços que executamos, consultar preços e ajudar com simulações de agendamentos. Mantenha um vocabulário acolhedor, use termos como "parceiro", "irmão", "navalha afinada" e incentive combos promocionais.'
  },
  'Financeiro/Contabilidade': {
    avatar: '📊',
    greetingMessage: 'Central de Apoio Financeiro operando. Deseja realizar alguma simulação de comissões, faturamento médio ou fluxo de caixa?',
    instructions: 'Sua responsabilidade é apoiar os sócios com cálculos financeiros da barbearia. Estime valores líquidos pagando a comissão padrão dos barbeiros (ex: comissões de 50% de corte e barba). Ajude a calcular custos fixos mensais (aluguel, água, energia, lâminas, descartáveis).'
  },
  'Marketing/Redes Sociais': {
    avatar: '📱',
    greetingMessage: 'Fala chefe! Pronto para bombar o Instagram da barbearia? Me diga qual corte ou promoção quer divulgar hoje.',
    instructions: 'Sua responsabilidade é redigir posts atraentes, chamadas marcantes para WhatsApp, ganchos magnéticos para Stories e roteiros curtos do TikTok/Reels mostrando os degradês da casa. Use linguagem moderna, hashtags estratégicas e gírias de barbearia.'
  },
  'Estoque/Fornecedores': {
    avatar: '📦',
    greetingMessage: 'Inventário online. Posso te ajudar a projetar as próximas recompras de produtos ou listar fornecedores parceiros.',
    instructions: 'Sua responsabilidade é auxiliar no controle de insumos vitais (pomada de efeito seco, óleo de barba, gola higiênica, giletes, capas). Ajude o barbeiro a calcular em quanto tempo os produtos esgotam de acordo com a quantidade de cortes por dia.'
  },
  'Gerência/Estratégia': {
    avatar: '🦁',
    greetingMessage: 'Canal de planejamento estratégico aberto. Vamos analisar o crescimento dos seus barbeiros e novas ideias de negócios?',
    instructions: 'Sua responsabilidade é agir como assessor de negócios de luxo voltados ao público masculino. Crie estratégias de fidelidade, analise a concorrência na área de estética masculina e projete expansões físicas ou acréscimo de serviços premium.'
  }
};

const PERSONALITY_PRESETS: Record<string, { name: string; greeting: string; instructions: string }> = {
  'Premium': {
    name: 'Afonso Atendente (Premium)',
    greeting: 'Olá parceiro! Sou o Afonso, seu bot de recepção. Quer marcar barba ou só alinhar o degradê hoje?',
    instructions: 'Sua responsabilidade é responder dúvidas de clientes, listar serviços que executamos, consultar preços e ajudar com simulações de agendamentos. Mantenha um tom refinado, acolhedor e corporativo. Use termos como "parceiro", "mestre", "navalha afinada" e incentive combos promocionais.'
  },
  'De Bairro': {
    name: 'Betinho da Barba (De Bairro)',
    greeting: 'Fala campeão! Betinho na área. Que horas passaria para dar aquele trato no cabelo hoje?',
    instructions: 'Sua responsabilidade é responder dúvidas com tom tradicional de barbearia de bairro. Use vocabulário simples e extremamente amigável. Use termos como "campeão", "irmão", "visita a casa", "degradê firmezinha". Foque na simplicidade e fidelização de vizinhança.'
  },
  'Jovem': {
    name: 'Tito Mandrake (Jovem)',
    greeting: 'Mano, salve! Sou o Tito da recepção. Pronto para lançar aquele degradê bolado no estilo hoje?',
    instructions: 'Sua responsabilidade é atuar no estilo Barbearia Jovem (Estilo Mandrake/Urbano). Tom de voz super informal, sintonizado com trap, funk e cultura das ruas. Use gírias moderadamente (exemplos: "mano", "salve", "lança a braba", "ta ligado", "degradezada em dia", "fé").'
  },
  'Luxo': {
    name: 'Mestre Concierge (Luxo)',
    greeting: 'Estimado Senhor! Seja muito bem-vindo ao Barber 360. Como podemos atender suas necessidades estéticas hoje?',
    instructions: 'Sua responsabilidade é atuar com o preset de Barbearia Luxo. Tratamento altamente formal, respeitoso e polido (exemplos: "senhor", "estimado", "com licença"). Diga que temos à disposição cafés espressos gourmet, toalhas aquecidas e massagens capilares com essências.'
  },
  'Minimalista': {
    name: 'Recepção Direta (Minimalista)',
    greeting: 'Olá. Deseja realizar um agendamento? Informe seu nome e o horário de sua preferência.',
    instructions: 'Sua responsabilidade é atuar no preset Barbearia Minimalista. Atendimento focado na conveniência, pontualidade de agenda e máxima objetividade. Sem gírias, polido, rápido e preciso. Respostas curtas de prontidão.'
  }
};

export default function AgentModal({ isOpen, agent, onClose, onSave }: AgentModalProps) {
  const [name, setName] = useState('');
  const [sector, setSector] = useState<SectorType>('Atendimento/Recepção');
  const [instructions, setInstructions] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('🛎️');
  const [selectedPreset, setSelectedPreset] = useState('Premium');

  useEffect(() => {
    if (agent) {
      setName(agent.name);
      setSector(agent.sector);
      setInstructions(agent.instructions);
      setGreetingMessage(agent.greetingMessage);
      setAvatarSeed(agent.avatarSeed);
    } else {
      // Set defaults for new agent
      const defaultTemplate = SECTOR_TEMPLATES['Atendimento/Recepção'];
      setName('Bot de Recepção');
      setSector('Atendimento/Recepção');
      setInstructions(defaultTemplate.instructions);
      setGreetingMessage(defaultTemplate.greetingMessage);
      setAvatarSeed(defaultTemplate.avatar);
      setSelectedPreset('Premium');
    }
  }, [agent, isOpen]);

  // Handle template pre-filling when sector changes in a NEW agent
  const handleSectorChange = (newSector: SectorType) => {
    setSector(newSector);
    if (!agent) {
      const template = SECTOR_TEMPLATES[newSector];
      setInstructions(template.instructions);
      setGreetingMessage(template.greetingMessage);
      setAvatarSeed(template.avatar);
      
      // Auto-name
      if (newSector === 'Atendimento/Recepção') {
        setName('Afonso Atendente');
        setSelectedPreset('Premium');
      }
      else if (newSector === 'Financeiro/Contabilidade') setName('Contador Barber');
      else if (newSector === 'Marketing/Redes Sociais') setName('Copiador Social');
      else if (newSector === 'Estoque/Fornecedores') setName('Supervisor Estoque');
      else if (newSector === 'Gerência/Estratégia') setName('Conselheiro Executivo');
    }
  };

  const handleApplyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    const presetData = PERSONALITY_PRESETS[presetKey];
    if (presetData) {
      setName(presetData.name);
      setGreetingMessage(presetData.greeting);
      setInstructions(presetData.instructions);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !instructions || !greetingMessage) return;
    onSave({
      id: agent?.id,
      name,
      sector,
      instructions,
      greetingMessage,
      avatarSeed,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-graphite-panel border border-graphite-border rounded-none max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-graphite-border flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-copper/10 rounded-none text-copper">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-gray-100 font-serif italic">
              {agent ? 'Editar Configurações de Agente' : 'Criar Novo Agente de IA'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-none bg-[#222] border border-graphite-border text-gray-500 hover:text-gray-300 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {/* Sector selection (Department) */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-copper font-semibold font-mono">Setor / Departamento da Barbearia</label>
            <select
              value={sector}
              onChange={(e) => handleSectorChange(e.target.value as SectorType)}
              className="w-full px-3.5 py-3 bg-graphite-dark border border-[#333] hover:border-gray-700 focus:border-copper text-gray-100 focus:outline-none transition font-sans cursor-pointer rounded-none"
            >
              <option value="Atendimento/Recepção">🛎️ Atendimento e Marcação de Horários</option>
              <option value="Financeiro/Contabilidade">📊 Financeiro, Custos e Comissões</option>
              <option value="Marketing/Redes Sociais">📱 Marketing Digital e Copies de Instagram</option>
              <option value="Estoque/Fornecedores">📦 Controle de Insumos e Fornecedores</option>
              <option value="Gerência/Estratégia">🦁 Gerência e Decisões de Negócio</option>
            </select>
            <p className="text-[11px] text-gray-500 font-sans italic flex items-center gap-1.5 mt-1">
              <AlertCircle className="w-3 h-3 text-copper" />
              Ao alterar o setor, preenchemos um prompt base para você refinar.
            </p>
          </div>

          {/* Personality Preset selection IF Customer Reception sector is selected */}
          {sector === 'Atendimento/Recepção' && (
            <div className="space-y-2 bg-copper/5 border border-copper/20 p-4">
              <label className="block text-xs uppercase tracking-widest text-copper font-bold font-mono">DIFERENCIAL: Preset de Personalidade IA</label>
              <select
                value={selectedPreset}
                onChange={(e) => handleApplyPreset(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-graphite-dark border border-[#444] hover:border-gray-700 focus:border-copper text-gray-100 focus:outline-none transition font-sans cursor-pointer text-xs rounded-none"
              >
                <option value="Premium">💈 Estilo 1: Barbearia Premium (Sofisticado)</option>
                <option value="De Bairro">🏡 Estilo 2: Barbearia de Bairro (Proximidade amigável)</option>
                <option value="Jovem">⚡ Estilo 3: Barbearia Jovem (Moderno e Urbano)</option>
                <option value="Luxo">💎 Estilo 4: Barbearia Luxo (Formal e Premium Concierge)</option>
                <option value="Minimalista">🤍 Estilo 5: Barbearia Minimalista (Foco e Agilidade)</option>
              </select>
              <p className="text-[10px] text-gray-500 font-sans italic">
                Selecione acima para preencher instantaneamente a linguagem formal/informal, gírias e o estilo do WhatsApp.
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {/* Name */}
            <div className="col-span-2 space-y-2">
              <label className="block text-xs uppercase tracking-widest text-copper font-semibold font-mono">Nome do Agente</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Bot de Recepção"
                required
                className="w-full px-3.5 py-3 bg-graphite-dark border border-[#333] hover:border-gray-700 focus:border-copper text-gray-100 placeholder-gray-600 focus:outline-none transition duration-200 text-sm font-sans rounded-none"
              />
            </div>
            
            {/* Avatar character representation */}
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-widest text-copper font-semibold font-mono">Ícone / Avatar</label>
              <input
                type="text"
                value={avatarSeed}
                onChange={(e) => setAvatarSeed(e.target.value)}
                placeholder="Emoji ou Letra"
                required
                maxLength={2}
                className="w-full px-3.5 py-3 bg-graphite-dark border border-[#333] hover:border-gray-700 focus:border-copper text-gray-100 text-center focus:outline-none transition duration-200 text-sm font-sans rounded-none"
              />
            </div>
          </div>

          {/* Initial Greeting */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-widest text-copper font-semibold font-mono">Mensagem de Boas-vindas (Ativação)</label>
            <input
              type="text"
              value={greetingMessage}
              onChange={(e) => setGreetingMessage(e.target.value)}
              placeholder="Ex: Fala irmão! Sou seu bot de atendimento, em que posso ajudar?"
              required
              className="w-full px-3.5 py-3 bg-graphite-dark border border-[#333] hover:border-gray-700 focus:border-copper text-gray-100 placeholder-gray-600 focus:outline-none transition duration-200 text-sm font-sans rounded-none"
            />
          </div>

          {/* Personality Specs and prompt engineering context */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs uppercase tracking-widest text-copper font-semibold font-mono">Instruções de Comportamento (Prompt)</label>
              <span className="text-[10px] text-gray-500 font-mono">Enviado como System Instruction</span>
            </div>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
              placeholder="Descreva as funções, limitações, abordagens e tom de voz preferido para essa inteligência artificial específica da barbearia..."
              required
              className="w-full px-3.5 py-3 bg-graphite-dark border border-[#333] hover:border-gray-700 focus:border-copper text-gray-100 placeholder-gray-600 focus:outline-none transition duration-200 text-xs font-sans resize-none leading-relaxed rounded-none"
            />
          </div>

          {/* Prompt helpful guidelines */}
          <div className="p-4 bg-black/20 border border-graphite-border rounded-none">
            <h4 className="text-xs uppercase tracking-wider text-gray-400 font-mono mb-1.5 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-copper" />
              Dica de Ouro de Automação
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
              O agente usa as configurações reais da barbearia (serviços, preços, horários, profissionais) informados na aba de configurações. Use o prompt acima para dar personalidade e restringir o comportamento dele.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-graphite-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#222] border border-graphite-border hover:bg-neutral-800 text-gray-300 rounded-none text-xs transition cursor-pointer font-bold uppercase font-mono tracking-wider"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-copper hover:bg-copper-light text-graphite-dark rounded-none text-xs font-bold font-mono cursor-pointer transition shadow-md shadow-copper/10 uppercase tracking-wider"
            >
              {agent ? 'Salvar Alterações' : 'Criar Funcionário'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
