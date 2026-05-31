import React, { useState } from 'react';
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
  Zap
} from 'lucide-react';
import ModuleLayout, { SubPageSpec } from '../../components/ModuleLayout';

export const communicationRoutes: SubPageSpec[] = [
  { id: 'conversas', name: 'Conversas Ativas', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: 'templates', name: 'Modelos WhatsApp', icon: <FileCode className="w-3.5 h-3.5" /> },
  { id: 'disparos', name: 'Lembretes e Alertas', icon: <Bell className="w-3.5 h-3.5" /> },
  { id: 'historico', name: 'Histórico Completo', icon: <History className="w-3.5 h-3.5" /> }
];

export default function CommunicationModule() {
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
