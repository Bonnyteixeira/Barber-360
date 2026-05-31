import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Settings2, 
  Send, 
  Cpu, 
  User, 
  History, 
  FileCode, 
  Plus, 
  Bell, 
  CheckCheck,
  Zap,
  Smartphone,
  QrCode,
  Network,
  Wifi,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import ModuleLayout, { SubPageSpec } from '../../components/ModuleLayout';

export const communicationRoutes: SubPageSpec[] = [
  { id: 'conversas', name: 'Conversas Ativas', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: 'conexao', name: 'Conectar WhatsApp', icon: <Smartphone className="w-3.5 h-3.5" /> },
  { id: 'templates', name: 'Modelos WhatsApp', icon: <FileCode className="w-3.5 h-3.5" /> },
  { id: 'disparos', name: 'Lembretes e Alertas', icon: <Bell className="w-3.5 h-3.5" /> },
  { id: 'historico', name: 'Histórico Completo', icon: <History className="w-3.5 h-3.5" /> }
];

export default function CommunicationModule() {
  // WhatsApp Connection State Machine
  const [wppAccountType, setWppAccountType] = useState<'business' | 'personal'>('business');
  const [wppNumber, setWppNumber] = useState('(11) 99122-3344');
  const [wppAgentName, setWppAgentName] = useState('Heitor AI Agent');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'generating' | 'ready_to_scan' | 'scanning' | 'connected'>('connected');
  const [countdown, setCountdown] = useState(45);
  const [testNumber, setTestNumber] = useState('');
  const [testLog, setTestLog] = useState<string[]>([]);
  const [showTestSuccess, setShowTestSuccess] = useState(false);

  // Auto-decrement countdown when QR code is visible
  useEffect(() => {
    let interval: any;
    if (connectionStatus === 'ready_to_scan') {
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // reset or regenerate
            return 45;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connectionStatus]);

  const startScanningSequence = () => {
    setConnectionStatus('generating');
    setTimeout(() => {
      setConnectionStatus('ready_to_scan');
      setCountdown(45);
    }, 1500);
  };

  const simulateSuccessfulScan = () => {
    setConnectionStatus('scanning');
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
  };

  const handleDisconnect = () => {
    setConnectionStatus('idle');
  };

  const handleSendTestMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testNumber.trim()) return;
    setTestLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Inicializando disparo de pacotes para o gateway...`]);
    setTimeout(() => {
      setTestLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Sincronizando credenciais de sessão ativa para ${wppNumber}...`]);
    }, 600);
    setTimeout(() => {
      setTestLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Enviando mensagem de confirmação para o número testador ${testNumber}...`]);
    }, 1200);
    setTimeout(() => {
      setTestLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✓ Sucesso! Pacote entregue. Status do payload: DELIVERED (id: msg_73ksoas82)`]);
      setShowTestSuccess(true);
      setTimeout(() => setShowTestSuccess(false), 3000);
    }, 1800);
  };

  const [conversations, setConversations] = useState([
    { id: 1, client: 'Roberto Carlos', phone: '(11) 99122-3344', status: 'bot_handling', type: 'Corte e Barba', time: '17:42', lastMsg: 'Gostaria de agendar para terça-feira à tarde', badge: 'IA Atendendo' },
    { id: 2, client: 'Henrique Juliano', phone: '(11) 98212-5566', status: 'manual', type: 'Selagem de Fios', time: '16:15', lastMsg: 'Vou me atrasar 10 minutos, tudo bem?', badge: 'Manual' },
    { id: 3, client: 'Matheus Vieira', phone: '(11) 97341-9988', status: 'closed', type: 'Corte Social', time: 'Ontem', lastMsg: 'Horário reservado com Diego! Link: b360.cc/3', badge: 'Concluído' }
  ]);

  const [activeChat, setActiveChat] = useState<any>(conversations[0]);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'client', text: 'Olá, tudo bem? Queria ver se tem horário disponível para corte', time: '17:40' },
    { sender: 'bot', text: 'Olá! Sou o Atendente Virtual da Barbearia. Temos sim! Para qual dia e horário você prefere?', time: '17:41' },
    { sender: 'client', text: 'Gostaria de agendar para terça-feira à tarde', time: '17:42' }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState('confirmacao');
  const [templateContent, setTemplateContent] = useState(
    'Olá {{CLIENTE_NOME}}, seu agendamento está confirmado para {{DATA}} às {{HORA}} com o profissional {{BARBEIRO_NOME}}. Te aguardamos!'
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = { sender: 'bot', text: messageInput, time: '17:45' };
    setChatMessages([...chatMessages, newMsg]);
    
    // Update last message in the active chat list
    setConversations(prev => prev.map(c => c.id === activeChat.id ? { ...c, lastMsg: messageInput } : c));
    setMessageInput('');
  };

  return (
    <ModuleLayout
      moduleName="Aparelho de Comunicação"
      modulePath="Client Platform"
      description="Centralize os chats do WhatsApp Web do seu estabelecimento. Deixe a Inteligência Artificial gerenciar a triagem e o fechamento de reservas de forma autônoma."
      subPages={communicationRoutes}
      quickCards={[
        { title: 'Taxa de Entrega', value: '99.8%', change: '+0.2%', type: 'positive' },
        { title: 'Tempo Médio Resposta', value: '18s', change: '-45s', type: 'positive' },
        { title: 'Conversas Hoje', value: '47', change: '+12%', type: 'positive' },
        { title: 'Custódia do Bot', value: '82%', change: '+4%', type: 'positive' }
      ]}
      secondarySidebarHeader="Dispositivo e Status"
      secondarySidebarContent={
        <div className="space-y-4 text-xs font-sans text-gray-450">
          <div className="bg-[#151618] border border-graphite-border p-3">
            <span className="text-[10px] uppercase font-mono text-copper font-bold block mb-1">Conexão Celular</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] text-gray-200 font-mono">NODE-WPP-INSTANCE-01</span>
            </div>
            <p className="text-[9px] text-gray-500 mt-1 font-sans">Bateria: 84% • Aparelho conectado via WebSocket seguro</p>
          </div>

          <div className="bg-[#151618] border border-graphite-border p-3 space-y-2">
            <span className="text-[9px] uppercase font-mono text-copper font-semibold block">Regras de Comunicação</span>
            <div className="flex gap-1.5 items-center">
              <input type="checkbox" defaultChecked className="accent-copper cursor-pointer" />
              <span>Sempre disparar lembrete 2h antes</span>
            </div>
            <div className="flex gap-1.5 items-center">
              <input type="checkbox" defaultChecked className="accent-copper cursor-pointer" />
              <span>Permitir reagendamento por texto</span>
            </div>
          </div>
        </div>
      }
    >
      {(activeSubPageId) => {
        if (activeSubPageId === 'conversas') {
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[450px]">
              {/* Sidebar: Chats list */}
              <div className="lg:col-span-4 border border-graphite-border/70 overflow-y-auto bg-graphite-dark/20 flex flex-col divide-y divide-graphite-border/60">
                {conversations.map((chat) => {
                  const isActive = activeChat.id === chat.id;
                  return (
                    <button
                      key={chat.id}
                      onClick={() => {
                        setActiveChat(chat);
                        if (chat.id === 1) {
                          setChatMessages([
                            { sender: 'client', text: 'Olá, tudo bem? Queria ver se tem horário disponível para corte', time: '17:40' },
                            { sender: 'bot', text: 'Olá! Sou o Atendente Virtual da Barbearia. Temos sim! Para qual dia e horário você prefere?', time: '17:41' },
                            { sender: 'client', text: 'Gostaria de agendar para terça-feira à tarde', time: '17:42' }
                          ]);
                        } else if (chat.id === 2) {
                          setChatMessages([
                            { sender: 'client', text: 'Tudo bem? Meu agendamento é hoje às 16:30', time: '16:10' },
                            { sender: 'client', text: 'Vou me atrasar 10 minutos, tudo bem?', time: '16:15' }
                          ]);
                        } else {
                          setChatMessages([
                            { sender: 'bot', text: 'Olá Matheus, tudo bem? Notamos que você tem horário reservado com o Diego hoje para Corte Social.', time: 'Ontem' },
                            { sender: 'client', text: 'Tudo certo, já estou a caminho!', time: 'Ontem' },
                            { sender: 'bot', text: 'Excelente! Horário reservado com Diego! Link: b360.cc/3', time: 'Ontem' }
                          ]);
                        }
                      }}
                      className={`text-left p-3.5 transition w-full ${isActive ? 'bg-copper/10 border-l-2 border-copper' : 'hover:bg-[#1C1D1F] bg-transparent'}`}
                    >
                      <div className="flex justify-between items-start mb-1 text-xs">
                        <strong className="text-gray-200 truncate pr-2 block">{chat.client}</strong>
                        <span className="text-[9px] text-gray-500 font-mono shrink-0 font-light">{chat.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-sans truncate select-none">{chat.lastMsg}</p>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[9px] text-gray-500 font-mono">{chat.phone}</span>
                        <span className={`text-[8px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                          chat.status === 'bot_handling' ? 'bg-copper/20 text-copper' : chat.status === 'manual' ? 'bg-blue-500/10 text-blue-400' : 'bg-gray-500/15 text-gray-450'
                        }`}>
                          {chat.badge}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Chat View Area */}
              <div className="lg:col-span-8 flex flex-col block border border-graphite-border bg-[#101112]">
                {/* Chat Header */}
                <div className="p-3 bg-[#161719] border-b border-graphite-border flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-gray-200 font-mono">{activeChat.client}</h4>
                    <span className="text-[10px] text-gray-450 font-mono">{activeChat.phone} • Especialidade: {activeChat.type}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setConversations(prev => prev.map(c => c.id === activeChat.id ? { ...c, status: c.status === 'bot_handling' ? 'manual' : 'bot_handling', badge: c.status === 'bot_handling' ? 'Manual' : 'IA Atendendo' } : c))}
                      className="p-1 px-2.5 bg-graphite-dark hover:border-copper/40 border border-graphite-border transition flex items-center gap-1.5 text-[10px] font-mono text-gray-300"
                    >
                      <Cpu className="w-3 h-3 text-copper" />
                      Toggle Transf. IA
                    </button>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'client' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[75%] p-3 border font-sans text-xs [word-break:break-all] ${
                        msg.sender === 'client' 
                          ? 'bg-[#161719] border-graphite-border text-gray-200' 
                          : 'bg-[#C37A4C]/10 border-copper/30 text-gray-200'
                      }`}>
                        <div className="flex gap-2 justify-between items-center mb-1 text-[9px] text-[#A28D78] font-mono">
                          <span className="uppercase font-semibold tracking-wider flex items-center gap-1">
                            {msg.sender === 'client' ? <User className="w-2.5 h-2.5" /> : <Cpu className="w-2.5 h-2.5" />}
                            {msg.sender === 'client' ? 'Cliente' : 'Atendente IA'}
                          </span>
                          <span>{msg.time}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Send Prompt Form */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-graphite-border/70 bg-[#141517] flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Escreva uma resposta sob a custódia do atendente..."
                    className="flex-1 bg-[#101112] text-xs px-3.5 py-2 text-gray-200 border border-graphite-border select-all focus:outline-none focus:border-copper"
                  />
                  <button type="submit" className="p-2 px-4.5 bg-copper text-graphite-dark font-mono font-bold text-xs flex items-center gap-1 hover:bg-copper/90 transition cursor-pointer">
                    <Send className="w-3 h-3" />
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'templates') {
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button 
                  onClick={() => {
                    setSelectedTemplate('confirmacao');
                    setTemplateContent('Olá {{CLIENTE_NOME}}, seu agendamento está confirmado para {{DATA}} às {{HORA}} com o profissional {{BARBEIRO_NOME}}. Te aguardamos!');
                  }}
                  className={`p-3 text-center border font-mono text-xs ${selectedTemplate === 'confirmacao' ? 'border-copper bg-copper/5 text-copper' : 'border-graphite-border bg-transparent text-gray-400'}`}
                >
                  Confirmação
                </button>
                <button 
                  onClick={() => {
                    setSelectedTemplate('lembrete_2h');
                    setTemplateContent('Fala {{CLIENTE_NOME}}! Passando pra avisar que faltam apenas 2h para seu corte hoje às {{HORA}} com {{BARBEIRO_NOME}}. Se houver atraso nos avise por aqui.');
                  }}
                  className={`p-3 text-center border font-mono text-xs ${selectedTemplate === 'lembrete_2h' ? 'border-copper bg-copper/5 text-copper' : 'border-graphite-border bg-transparent text-gray-400'}`}
                >
                  Lembrete 2h
                </button>
                <button 
                  onClick={() => {
                    setSelectedTemplate('reativacao');
                    setTemplateContent('Olá {{CLIENTE_NOME}}! Sentimos sua falta. Faz mais de {{DIAS_INATIVO}} dias do seu último corte. Que tal reservar com 10% de desconto amanhã? Escolha o horário em b360.cc/react');
                  }}
                  className={`p-3 text-center border font-mono text-xs ${selectedTemplate === 'reativacao' ? 'border-copper bg-copper/5 text-copper' : 'border-graphite-border bg-transparent text-gray-400'}`}
                >
                  Reativação CRM
                </button>
                <button 
                  onClick={() => {
                    setSelectedTemplate('aniversario');
                    setTemplateContent('Parabéns {{CLIENTE_NOME}}! 🎈 No seu dia especial, ganhe 15% de bônus na barba clicando aqui: b360.cc/bday. Esperamos por você!');
                  }}
                  className={`p-3 text-center border font-mono text-xs ${selectedTemplate === 'aniversario' ? 'border-copper bg-copper/5 text-copper' : 'border-graphite-border bg-transparent text-gray-400'}`}
                >
                  Aniversariantes
                </button>
              </div>

              <div className="border border-graphite-border bg-[#141517] p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-graphite-border pb-2">
                  <span className="text-xs font-bold text-gray-200 font-mono uppercase">Editor de Template: <strong className="text-copper">{selectedTemplate}</strong></span>
                  <span className="text-[10px] text-gray-550 font-mono">Use tags dinâmicas como: {"{{NOME}}"}</span>
                </div>

                <textarea
                  className="w-full bg-[#101112] min-h-[120px] text-xs font-mono p-4 text-gray-200 border border-graphite-border focus:outline-none focus:border-copper select-all leading-relaxed"
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                />

                <div className="flex justify-end">
                  <button className="flex items-center gap-1.5 px-4.5 py-2 bg-copper text-graphite-dark font-sans font-bold text-xs rounded hover:bg-copper/95 transition">
                    <CheckCheck className="w-3.5 h-3.5" />
                    Salvar Alteração
                  </button>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'disparos') {
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-graphite-border bg-[#141517] p-5 space-y-3">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase block border-b border-graphite-border pb-2">Fila de Disparos em Espera</h4>
                  <div className="space-y-2 text-xs font-mono text-gray-400">
                    <div className="flex justify-between pb-1.5 border-b border-graphite-border/30">
                      <span>Para: Gabriel Santos</span>
                      <strong className="text-copper">Lembrete (2h antes)</strong>
                      <span>Amanhã 11:30</span>
                    </div>
                    <div className="flex justify-between pb-1.5 border-b border-graphite-border/30">
                      <span>Para: Marcus Aurelio</span>
                      <strong className="text-copper">Reativação (30d)</strong>
                      <span>Amanhã 09:15</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Para: Antonio Lima</span>
                      <strong className="text-copper">Aniversário 🎈</strong>
                      <span>Segunda 08:00</span>
                    </div>
                  </div>
                </div>

                <div className="border border-graphite-border bg-[#141517] p-5 space-y-4">
                  <h4 className="text-xs font-bold text-gray-200 font-mono uppercase block border-b border-graphite-border pb-2">Configurar Disparador Automático</h4>
                  <div className="space-y-3 font-sans text-xs text-gray-400">
                    <div className="flex justify-between items-center">
                      <span>Disparar confirmação logo após agendamento</span>
                      <input type="checkbox" defaultChecked className="accent-copper cursor-pointer" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Tempo de tolerância para reagendar por IA (24h antes)</span>
                      <input type="checkbox" defaultChecked className="accent-copper cursor-pointer" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Cancelar lembretes caso o cliente esteja atrasado</span>
                      <input type="checkbox" className="accent-copper cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (activeSubPageId === 'conexao') {
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT CONTEXT: CONFIG & CREDENTIALS */}
                <div className="lg:col-span-5 space-y-6 animate-fadeIn">
                  
                  {/* Step 1: Type of WhatsApp Line */}
                  <div className="bg-[#141517] border border-graphite-border p-5 space-y-4">
                    <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 block">
                      1. Tipo de Conta WhatsApp
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
                      Selecione a infraestrutura do seu canal de mensagens do seu agente de IA:
                    </p>
                    
                    <div className="grid grid-cols-1 gap-3 font-sans">
                      <button
                        type="button"
                        onClick={() => setWppAccountType('business')}
                        className={`p-3 border text-left transition flex flex-col justify-between ${
                          wppAccountType === 'business'
                            ? 'border-copper bg-copper/5 text-gray-100'
                            : 'border-graphite-border hover:border-gray-700 text-gray-400 bg-[#101112]'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full mb-1">
                          <span className="text-xs font-bold font-mono">WhatsApp Business</span>
                          <span className="text-[8px] font-mono px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold tracking-wider rounded uppercase">
                            Recomendado
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 leading-snug">
                          Indicado para alta escalabilidade, contas comerciais oficiais e estabilidade corporativa irrestrita.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWppAccountType('personal')}
                        className={`p-3 border text-left transition flex flex-col justify-between ${
                          wppAccountType === 'personal'
                            ? 'border-copper bg-copper/5 text-gray-100'
                            : 'border-graphite-border hover:border-gray-700 text-gray-400 bg-[#101112]'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full mb-1">
                          <span className="text-xs font-bold font-mono">WhatsApp Particular</span>
                          <span className="text-[8px] font-mono px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold tracking-wider rounded uppercase">
                            Pessoal
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-500 leading-snug">
                          Conector facilitado via WhatsApp Web QR Code para números pessoais ou micro-barbearias.
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Step 2: Agent identification & phone routing number */}
                  <div className="bg-[#141517] border border-graphite-border p-5 space-y-4">
                    <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2 block">
                      2. Identificação do Dispositivo
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
                      Define os parâmetros lógicos de identificação da sua automação no SaaS:
                    </p>

                    <div className="space-y-4 font-mono text-xs text-gray-450">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-bold uppercase select-none text-[10px]">Número de Linha Cadastrada</label>
                        <input
                          type="text"
                          value={wppNumber}
                          onChange={(e) => setWppNumber(e.target.value)}
                          placeholder="Ex: +55 (11) 99122-3344"
                          className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border focus:outline-none focus:border-copper"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-gray-400 font-bold uppercase select-none text-[10px]">Nome Fantasia do Agente Virtual</label>
                        <input
                          type="text"
                          value={wppAgentName}
                          onChange={(e) => setWppAgentName(e.target.value)}
                          placeholder="Ex: Heitor AI Agent"
                          className="w-full bg-[#101112] text-xs px-3 py-2 text-gray-200 border border-graphite-border focus:outline-none focus:border-copper"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT CONTEXT: LIVE QR CODE OR ACTIVE CONNECTION STATE PANEL */}
                <div className="lg:col-span-7 space-y-6">
                  
                  <div className="bg-[#141517] border border-graphite-border p-5 space-y-5 flex flex-col">
                    <div className="flex justify-between items-center border-b border-graphite-border pb-3.5">
                      <div>
                        <h4 className="text-xs font-bold text-gray-200 font-mono uppercase">
                          Painel de Sincronização em Tempo Real (WhatsApp Web)
                        </h4>
                        <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                          Gerencie a autenticação segura do seu canal de mensagens.
                        </p>
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 tracking-wider border rounded shrink-0 flex items-center gap-1 ${
                        connectionStatus === 'connected'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : connectionStatus === 'scanning'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : connectionStatus === 'ready_to_scan'
                          ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                          : 'bg-gray-500/10 border-graphite-border text-gray-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          connectionStatus === 'connected'
                            ? 'bg-emerald-500 animate-pulse'
                            : connectionStatus === 'scanning'
                            ? 'bg-amber-500 animate-pulse'
                            : connectionStatus === 'ready_to_scan'
                            ? 'bg-blue-500 animate-pulse'
                            : 'bg-gray-500'
                        }`} />
                        {connectionStatus === 'connected' ? 'Sincronizado' : connectionStatus === 'scanning' ? 'Sincronizando' : connectionStatus === 'ready_to_scan' ? 'Aguardando Leitura' : 'Desconectado'}
                      </span>
                    </div>

                    {/* RENDER DYNAMIC COMPONENCY ACCORDING TO STATE MACHINE */}
                    {connectionStatus === 'idle' && (
                      <div className="py-8 text-center space-y-4 max-w-md mx-auto">
                        <div className="w-16 h-16 rounded-full bg-[#1A1B1E] border border-graphite-border flex items-center justify-center text-gray-400 mx-auto">
                          <QrCode className="w-8 h-8" />
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-gray-200 uppercase font-mono">WebSocket Gateway Pronto</h5>
                          <p className="text-[11px] text-gray-500 font-sans mt-1 leading-relaxed">
                            Seu canal está ocioso. Para receber mensagens dos clientes do salão diretamente em seu painel e delegá-las de forma autônoma para nossos robôs inteligentes, inicie o processo de conexão em lote.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={startScanningSequence}
                          className="px-5 py-2 bg-copper text-graphite-dark font-mono font-bold text-xs hover:bg-copper/90 transition shadow-lg cursor-pointer"
                        >
                          Gerar Novo QR Code de Pareamento
                        </button>
                      </div>
                    )}

                    {connectionStatus === 'generating' && (
                      <div className="py-12 text-center space-y-4 max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-copper animate-spin mx-auto" />
                        <div className="space-y-1 font-mono text-[11px] text-gray-400">
                          <p className="text-copper font-bold animate-pulse">ESTABELECENDO WEBSOCKET SEGURO...</p>
                          <p className="text-gray-500 text-[10px]">Alocando portas lógicas com o servidor Barber 360...</p>
                          <p className="text-gray-550 text-[9px] font-thin">RSA Keys 2048-bits • TLS 1.3 Safe handshake</p>
                        </div>
                      </div>
                    )}

                    {(connectionStatus === 'ready_to_scan' || connectionStatus === 'scanning') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-4">
                        {/* Step-by-Step Scan Tutorial */}
                        <div className="space-y-4">
                          <h6 className="text-[11px] font-bold text-gray-300 uppercase font-mono block">Instruções de Integração:</h6>
                          <div className="space-y-3 font-sans text-xs text-gray-400 leading-relaxed font-light">
                            <div className="flex gap-2">
                              <span className="w-5 h-5 rounded-full bg-copper/10 border border-copper/20 text-copper flex items-center justify-center font-mono font-bold text-[10px] shrink-0">1</span>
                              <p>Abra o <strong>WhatsApp</strong> no seu celular cadastrado.</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="w-5 h-5 rounded-full bg-copper/10 border border-copper/20 text-copper flex items-center justify-center font-mono font-bold text-[10px] shrink-0">2</span>
                              <p>Toque em <strong>Aparelhos Conectados</strong> nas configurações.</p>
                            </div>
                            <div className="flex gap-2">
                              <span className="w-5 h-5 rounded-full bg-copper/10 border border-copper/20 text-copper flex items-center justify-center font-mono font-bold text-[10px] shrink-0">3</span>
                              <p>Escolha <strong>Conectar um aparelho</strong> e aponte a câmera para o QR Code ao lado.</p>
                            </div>
                          </div>

                          <div className="bg-[#101112] border border-graphite-border p-3.5 space-y-1 font-mono text-[10px]">
                            <span className="text-copper block uppercase font-bold text-[9px]">Segurança Máxima Enforçada</span>
                            <p className="text-gray-500 font-sans leading-relaxed">
                              Sua sessão é isolada lógica e virtualmente, implementada de acordo com as especificações restritas de criptografia ponta a ponta do WhatsApp Web Protocol.
                            </p>
                          </div>
                        </div>

                        {/* Interactive Scan Stage */}
                        <div className="flex flex-col items-center justify-center space-y-3.5 bg-[#101112] border border-graphite-border p-5 rounded">
                          {connectionStatus === 'ready_to_scan' ? (
                            <>
                              <div className="bg-white p-3 rounded-lg flex items-center justify-center relative border-4 border-copper/40">
                                {/* SVG representing highly styled QR Code */}
                                <svg className="w-28 h-28 text-graphite-dark fill-current" viewBox="0 0 100 100">
                                  <rect x="0" y="0" width="25" height="25" />
                                  <rect x="4" y="4" width="17" height="17" className="text-white" />
                                  <rect x="8" y="8" width="9" height="9" />
                                  
                                  <rect x="75" y="0" width="25" height="25" />
                                  <rect x="79" y="4" width="17" height="17" className="text-white" />
                                  <rect x="83" y="8" width="9" height="9" />

                                  <rect x="0" y="75" width="25" height="25" />
                                  <rect x="4" y="79" width="17" height="17" className="text-white" />
                                  <rect x="8" y="83" width="9" height="9" />

                                  <rect x="35" y="10" width="8" height="8" />
                                  <rect x="50" y="5" width="12" height="6" />
                                  <rect x="40" y="25" width="6" height="15" />
                                  <rect x="15" y="35" width="15" height="7" />
                                  <rect x="60" y="30" width="8" height="12" />
                                  <rect x="30" y="50" width="20" height="8" />
                                  <rect x="55" y="45" width="10" height="18" />
                                  <rect x="70" y="70" width="8" height="15" />
                                  <rect x="85" y="50" width="12" height="12" />
                                  <rect x="45" y="75" width="15" height="10" />
                                  <rect x="35" y="85" width="8" height="8" />
                                  <rect x="65" y="85" width="15" height="6" />

                                  <circle cx="50" cy="50" r="4" className="text-[#C37A4C]" />
                                </svg>
                                
                                {/* Overlay scan line */}
                                <div className="absolute top-1 left-1 right-1 h-0.5 bg-copper shadow-[0_0_10px_#C37A4C] animate-bounce" />
                              </div>

                              <div className="text-center font-mono">
                                <span className="text-[10px] text-gray-500 block">O código expira em:</span>
                                <p className="text-xs font-bold text-copper">{countdown}s</p>
                              </div>

                              <button
                                type="button"
                                onClick={simulateSuccessfulScan}
                                className="w-full py-1.5 bg-copper text-graphite-dark font-sans font-bold text-xs hover:bg-copper/85 transition cursor-pointer text-center block"
                              >
                                Simular Pareamento do Celular
                              </button>
                            </>
                          ) : (
                            <div className="py-10 text-center space-y-4">
                              <div className="w-10 h-10 border-t-2 border-r-2 border-amber-500 animate-spin mx-auto rounded-full" />
                              <div className="space-y-1 font-mono text-[10px] text-gray-450 leading-relaxed">
                                <p className="text-amber-500 font-bold uppercase tracking-wider animate-pulse">DISPOSITIVO DETECTADO!</p>
                                <p className="text-gray-400">Autenticando contra banco do WhatsApp Business...</p>
                                <p className="text-gray-500">Fazendo download seguro das chaves de criptografia e sincronizando chats...</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {connectionStatus === 'connected' && (
                      <div className="space-y-6 animate-fadeIn">
                        {/* Session Meta Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-[#101112] border border-graphite-border space-y-1 font-mono text-[10px] text-gray-400">
                            <span className="text-gray-500 block">APARELHO ATIVO</span>
                            <strong className="text-gray-200 text-xs truncate max-w-full block">{wppAgentName}</strong>
                            <span className="text-[9px] text-[#A28D78] block">{wppNumber}</span>
                          </div>

                          <div className="p-4 bg-[#101112] border border-graphite-border space-y-1 font-mono text-[10px] text-gray-400">
                            <span className="text-gray-500 block">SESSÃO E CONECTOR</span>
                            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              CONEXÃO ATIVA
                            </span>
                            <span className="text-[9px] text-gray-500 block truncate">INSTANCE-WPP-73ksoas82</span>
                          </div>

                          <div className="p-4 bg-[#101112] border border-graphite-border space-y-1 font-mono text-[10px] text-gray-400">
                            <span className="text-gray-500 block">TIPO E PERFORMANCE</span>
                            <strong className="text-gray-200 text-xs capitalize">{wppAccountType === 'business' ? 'WhatsApp Business' : 'Particular (Web)'}</strong>
                            <span className="text-[9px] text-emerald-400 block">Latência: 12ms (Optimal)</span>
                          </div>
                        </div>

                        {/* Connection Warning / Action Bar */}
                        <div className="bg-[#101112] border border-graphite-border p-4.5 flex flex-col md:flex-row items-center justify-between gap-4">
                          <div className="flex gap-3 items-center">
                            <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded text-emerald-400">
                              <Wifi className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="font-sans">
                              <strong className="text-xs text-gray-300 block">Atendimento Autônomo IA Ativo</strong>
                              <span className="text-[10px] text-gray-500 font-light block leading-relaxed max-w-md">
                                O agente virtual configurado no módulo IA está respondendo as mensagens recebidas neste número em tempo real com base no seu catálogo e escopo de CRM.
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleDisconnect}
                            className="px-4 py-2 border border-red-500/30 hover:border-red-500/50 text-red-500 hover:text-red-400 font-mono text-[11px] hover:bg-red-500/5 transition tracking-wide shrink-0 cursor-pointer"
                          >
                            Revogar Sessão e Desconectar
                          </button>
                        </div>

                        {/* HIGH FIDELITY DISPATCH TEST MODULE */}
                        <div className="border border-graphite-border bg-[#101112] p-5 space-y-4">
                          <div className="border-b border-graphite-border/70 pb-2 flex justify-between items-center">
                            <h5 className="text-xs font-bold text-gray-200 font-mono uppercase">
                              Laboratório de Diagnóstico (Enviar Mensagem de Teste)
                            </h5>
                            <span className="text-[9px] text-gray-500 font-mono">Simule uma entrega ativa no canal</span>
                          </div>

                          {showTestSuccess && (
                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs">
                              ✓ Mensagem de teste enviada via gateway WebSocket corporativo para {testNumber}! Verifique seu celular.
                            </div>
                          )}

                          <form onSubmit={handleSendTestMessage} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                            <div className="md:col-span-3 space-y-1.5 font-mono text-[10px] text-gray-400">
                              <label className="text-gray-400 font-bold uppercase select-none">Inserir Número Destino de Teste</label>
                              <input
                                type="text"
                                value={testNumber}
                                onChange={(e) => setTestNumber(e.target.value)}
                                placeholder="Insira o número com DDD. Ex: +55 (11) 99999-8888"
                                className="w-full bg-[#0E0F10] text-xs px-3.5 py-2 text-gray-200 border border-graphite-border focus:outline-none focus:border-copper font-sans"
                                required
                              />
                            </div>

                            <button
                              type="submit"
                              className="py-2.5 bg-copper text-graphite-dark font-sans font-bold text-xs hover:bg-copper/90 transition text-center flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Disparar Teste
                            </button>
                          </form>

                          {testLog.length > 0 && (
                            <div className="bg-[#0A0B0C] border border-graphite-border/50 p-4.5 space-y-2 mt-2 select-all h-[130px] overflow-y-auto scrollbar-thin">
                              <span className="text-[9px] uppercase font-mono text-gray-500 block border-b border-graphite-border/50 pb-1.5">Socket Client Log Stream:</span>
                              <div className="font-mono text-[10px] text-gray-450 space-y-1">
                                {testLog.map((log, index) => (
                                  <p key={index} className="leading-relaxed">
                                    <span className="text-copper font-bold">{`>`}</span> {log}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                  </div>

                </div>

              </div>
            </div>
          );
        }

        if (activeSubPageId === 'historico') {
          return (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-200 font-mono uppercase border-b border-graphite-border pb-2">Logs de Interação via WhatsApp</h4>
              <div className="space-y-3 text-xs text-gray-450 font-mono">
                <div className="border-l-2 border-copper pl-3.5 py-1">
                  <span className="text-gray-500 block">30/05/2026 17:41:03</span>
                  <p className="text-gray-300 font-sans mt-0.5">Mensagem enviada pelo Atendente Virtual para Roberto Carlos: "Temos horários terça às 14h, gostaria de agendar?"</p>
                </div>
                <div className="border-l-2 border-gray-600 pl-3.5 py-1">
                  <span className="text-gray-500 block">30/05/2026 17:22:15</span>
                  <p className="text-gray-300 font-sans mt-0.5">Mensagem recebida de Mateus Vieira: "Vou cortar o cabelo e fazer a barba com o Diego."</p>
                </div>
                <div className="border-l-2 border-emerald-500 pl-3.5 py-1">
                  <span className="text-gray-500 block">30/05/2026 16:30:11</span>
                  <p className="text-gray-300 font-sans mt-0.5">Disparo automático de Reativação enviado com sucesso para Henrique Juliano (Ausente há 30 dias).</p>
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
