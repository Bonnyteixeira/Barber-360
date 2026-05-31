import React, { useState } from 'react';
import { Terminal, Copy, Check, MessageSquare, Bot, Cpu, HelpCircle, Code } from 'lucide-react';

export default function IntegrationPanel() {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [bubbleColor, setBubbleColor] = useState('#C37A4C');
  const [bubblePos, setBubblePos] = useState('right');

  const webhookUrl = "https://api.barberagent.ai/v1/webhook/fabio-teixeira-imperador";

  const chatbotEmbedCode = `<!-- BarberAgent AI Chat widget integration -->
<script>
  window.BarberAgentConfig = {
    apiKey: "BA-AI-765e6ff6-76c5",
    color: "${bubbleColor}",
    position: "${bubblePos}",
    greeting: "Olá parceiro! Como posso te ajudar a agendar ou sanar dúvidas hoje?",
    theme: "graphite"
  };
</script>
<script src="https://cdn.barberagent.ai/widget.js" async></script>`;

  const copyToClipboard = (text: string, type: 'script' | 'webhook') => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
  };

  return (
    <div id="integration-panel" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* LEFT COLUMN: Embed Builder Config (1/3 space) */}
      <div className="bg-[#18191B] border border-[#2D3035] p-6 rounded-2xl space-y-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono mb-2 border-b border-[#2D3035] pb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#C37A4C]" />
          Visual do Balão Web (Widget)
        </h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs text-gray-400">Cor do Balão (Cobre/Custom)</span>
            <div className="flex gap-2.5">
              <button
                onClick={() => setBubbleColor('#C37A4C')}
                className={`w-6 h-6 rounded-full bg-[#C37A4C] transition duration-150 border-2 ${bubbleColor === '#C37A4C' ? 'border-white' : 'border-transparent'}`}
              />
              <button
                onClick={() => setBubbleColor('#B85B28')}
                className={`w-6 h-6 rounded-full bg-[#B85B28] transition duration-150 border-2 ${bubbleColor === '#B85B28' ? 'border-white' : 'border-transparent'}`}
              />
              <button
                onClick={() => setBubbleColor('#1F2937')}
                className={`w-6 h-6 rounded-full bg-[#1F2937] transition duration-150 border-2 ${bubbleColor === '#1F2937' ? 'border-white' : 'border-transparent'}`}
              />
              <button
                onClick={() => setBubbleColor('#10B981')}
                className={`w-6 h-6 rounded-full bg-[#10B981] transition duration-150 border-2 ${bubbleColor === '#10B981' ? 'border-white' : 'border-transparent'}`}
              />
              <input
                type="color"
                value={bubbleColor}
                onChange={(e) => setBubbleColor(e.target.value)}
                className="w-6 h-6 bg-transparent border-none rounded-full cursor-pointer p-0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs text-gray-400">Posição na Tela</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setBubblePos('right')}
                className={`px-3 py-2 rounded-xl text-xs font-mono transition border ${bubblePos === 'right' ? 'bg-[#C37A4C]/10 border-[#C37A4C] text-white' : 'bg-[#121315] border-[#2D3035] text-gray-400 hover:text-gray-200'}`}
              >
                Canto Direito
              </button>
              <button
                type="button"
                onClick={() => setBubblePos('left')}
                className={`px-3 py-2 rounded-xl text-xs font-mono transition border ${bubblePos === 'left' ? 'bg-[#C37A4C]/10 border-[#C37A4C] text-white' : 'bg-[#121315] border-[#2D3035] text-gray-400 hover:text-gray-200'}`}
              >
                Canto Esquerdo
              </button>
            </div>
          </div>

          {/* Quick simulation card */}
          <div className="border border-[#2D3035] bg-[#121315] rounded-xl p-4 flex items-center justify-between shadow-inner relative">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#2D3035] text-gray-400 rounded-lg">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-200">Simulação Web</p>
                <p className="text-[10px] text-gray-500 font-sans">Visual do widget flutuante</p>
              </div>
            </div>
            
            {/* Visual demo float bubble */}
            <div 
              style={{ backgroundColor: bubbleColor }}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white shadow-xl animate-bounce`}
            >
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Script Code Integration (2/3 space) */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Javascript Embed Card */}
        <div className="bg-[#18191B] border border-[#2D3035] p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2D3035] pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-2">
                <Code className="w-4 h-4 text-[#C37A4C]" />
                Script HTML de Integração (Site/Landing Page)
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5">Copie o script abaixo e insira antes do fechamento da tag &lt;/body&gt; em seu site.</p>
            </div>
            <button
              onClick={() => copyToClipboard(chatbotEmbedCode, 'script')}
              className="p-2 rounded-xl bg-[#222428] border border-[#2D3035] hover:text-[#C37A4C] hover:border-[#C37A4C]/30 text-gray-400 transition cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? "Copiado!" : "Copiar"}</span>
            </button>
          </div>

          <div className="bg-[#121315] border border-[#2D3035] p-4 rounded-xl relative">
            <pre className="text-[11px] font-mono leading-relaxed text-gray-400 overflow-x-auto whitespace-pre">
              {chatbotEmbedCode}
            </pre>
          </div>
        </div>

        {/* Whatsapp API Hooks info */}
        <div className="bg-[#18191B] border border-[#2D3035] p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#2D3035] pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Integração WhatsApp Webhook (Typebot, Evolution, Zapi)
              </h3>
              <p className="text-[10px] text-gray-500 mt-0.5 font-sans">Use essa URL de retorno em suas automações externas para conectar seus Agentes no WhatsApp.</p>
            </div>
            <button
              onClick={() => copyToClipboard(webhookUrl, 'webhook')}
              className="p-2 rounded-xl bg-[#222428] border border-[#2D3035] hover:text-[#C37A4C] hover:border-[#C37A4C]/30 text-gray-400 transition cursor-pointer flex items-center gap-1.5 text-xs font-mono"
            >
              {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWebhook ? "Copiado!" : "Copiar"}</span>
            </button>
          </div>

          <div className="bg-[#121315] border border-[#2D3035] p-3 rounded-xl flex items-center justify-between">
            <span className="text-xs font-mono text-[#D99468] select-all truncate max-w-sm sm:max-w-md">{webhookUrl}</span>
            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">POST JSON</span>
          </div>

          {/* Quick instructions alert info box */}
          <div className="p-3.5 bg-[#222428] border border-[#2D3035] rounded-xl text-xs text-gray-500 leading-relaxed font-sans space-y-1">
            <p className="font-bold text-gray-300 flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-[#C37A4C]" />
              Como funciona o processamento WhatsApp?
            </p>
            <p>1. O cliente manda mensagem no seu WhatsApp Business.</p>
            <p>2. Sua ferramenta de envio (Evolution/Zapi) despacha o payload via POST para o nosso webhook.</p>
            <p>3. O BarberAgent AI identifica o agente de Recepção ativo, consulta o catálogo e responde em menos de 1.5s.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
