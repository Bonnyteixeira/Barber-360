import React, { useState } from 'react';
import { Mail, Lock, Scissors, Sparkles, User, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthPageProps {
  onSuccess: (userEmail: string) => void;
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('fabio.teixeira2080@gmail.com');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('Fábio Teixeira');
  const [salonName, setSalonName] = useState('Barbearia Imperador');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (!isLogin && !name) {
      setError('Por favor, indique o seu nome comercial para o cadastro.');
      return;
    }

    setLoading(true);
    // Simulate connection delay for premium feel
    setTimeout(() => {
      setLoading(false);
      onSuccess(email);
    }, 900);
  };

  return (
    <div id="auth-page" className="h-screen w-screen overflow-hidden bg-graphite-dark text-gray-200 flex flex-col md:flex-row font-sans">
      
      {/* LEFT SIDE: Clean 50% form */}
      <div id="auth-left" className="w-full md:w-1/2 h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 bg-graphite-panel z-10 relative border-r border-graphite-border overflow-y-auto scrollbar-thin">
        
        {/* Top brand heading */}
        <div id="auth-brand" className="flex items-center space-x-4 mb-6 md:mb-0 shrink-0">
          <div className="w-10 h-10 border-2 border-copper flex items-center justify-center rotate-45 shadow-sm">
            <span className="-rotate-45 text-copper font-serif font-bold text-lg select-none">B</span>
          </div>
          <div>
            <h1 className="text-lg font-light tracking-[0.2em] text-gray-200 uppercase font-sans">
              BARBER<span className="text-copper font-bold">AGENT</span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded ml-2.5 bg-copper/10 border border-copper/25 text-copper tracking-normal font-bold">AI</span>
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Agentes de IA para Barbearias</p>
          </div>
        </div>

        {/* Content Box */}
        <div id="auth-form-container" className="max-w-md w-full mx-auto my-auto py-4 shrink-0">
          <div className="mb-6">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className={`text-xl font-serif italic pb-1.5 mr-6 text-left transition-all cursor-pointer ${
                  isLogin 
                    ? 'text-white border-b-2 border-copper font-bold' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className={`text-xl font-serif italic pb-1.5 text-left transition-all cursor-pointer ${
                  !isLogin 
                    ? 'text-white border-b-2 border-copper font-bold' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Criar Conta
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 font-sans">
              {isLogin 
                ? 'Acesse o seu hub de automação para gerenciar seus agentes inteligentes.' 
                : 'Configure sua conta e monte sua própria equipe de atendentes autônomos.'
              }
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-950/40 border border-red-500/30 rounded text-red-300 text-xs font-sans"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3"
                >
                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-widest text-copper font-semibold font-mono">Seu Nome</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                      <input
                        type="text"
                        placeholder="Ex: Fábio Teixeira"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-2 bg-[#1b1b1b] border border-[#333] hover:border-gray-700 focus:border-copper text-gray-100 placeholder-gray-650 focus:outline-none transition duration-200 text-xs font-sans rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] uppercase tracking-widest text-copper font-semibold font-mono">Nome da Barbearia</label>
                    <div className="relative">
                      <Scissors className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                      <input
                        type="text"
                        placeholder="Ex: Barbearia Razor Club"
                        value={salonName}
                        onChange={(e) => setSalonName(e.target.value)}
                        className="w-full pl-11 pr-4 py-2 bg-[#1b1b1b] border border-[#333] hover:border-gray-700 focus:border-copper text-gray-100 placeholder-gray-650 focus:outline-none transition duration-200 text-xs font-sans rounded-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1 font-sans">
              <label className="block text-[10px] uppercase tracking-widest text-copper font-semibold font-mono">Email Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                <input
                  type="email"
                  placeholder="exemplo@barbearia.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 bg-[#1b1b1b] border border-[#333] hover:border-gray-700 focus:border-copper text-gray-100 placeholder-gray-650 focus:outline-none transition duration-200 text-xs font-sans rounded-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] uppercase tracking-widest text-copper font-semibold font-mono">Senha</label>
                {isLogin && (
                  <button type="button" className="text-[9px] text-gray-500 hover:text-copper uppercase tracking-tighter transition font-mono">
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 bg-[#1b1b1b] border border-[#333] hover:border-gray-700 focus:border-copper text-gray-100 placeholder-gray-650 focus:outline-none transition duration-200 text-xs font-sans rounded-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 bg-copper hover:bg-copper-light text-graphite-dark font-bold rounded-none uppercase tracking-widest text-xs cursor-pointer shadow-lg shadow-copper/10 focus:outline-none focus:ring-1 focus:ring-copper/45 active:scale-[0.98] transition-all duration-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-graphite-dark/30 border-t-graphite-dark rounded-full animate-spin mx-auto" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{isLogin ? 'Entrar no Painel' : 'Criar Nova Conta'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          {/* Quick-fill button for testing */}
          <div className="mt-4 pt-3 border-t border-graphite-border/60 flex items-center justify-between text-[11px] text-gray-500 font-mono shrink-0">
            <span>Acesso Rápido Demo:</span>
            <button
              onClick={() => {
                setEmail('fabio.teixeira2080@gmail.com');
                setPassword('123456');
                setIsLogin(true);
              }}
              className="px-2 py-1 bg-[#1b1b1b] border border-[#333] text-gray-400 hover:text-copper hover:border-copper/30 transition cursor-pointer font-mono text-[10px]"
            >
              Usar Fábio (Demo)
            </button>
          </div>
        </div>

        {/* Outer footer credits in left panel */}
        <div id="auth-footer" className="text-gray-600 text-[10px] font-sans flex items-center justify-between border-t border-graphite-border/60 pt-3 mt-4 md:mt-0 shrink-0">
          <span>&copy; {new Date().getFullYear()} Barber AI - Automação Inteligente</span>
          <div className="flex space-x-3">
            <span className="hover:text-gray-400 cursor-pointer transition">Privacidade</span>
            <span>&bull;</span>
            <span className="hover:text-gray-400 cursor-pointer transition">Termos</span>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE: 50% High-quality thematic graphic */}
      <div id="auth-right" className="hidden md:block w-1/2 h-full relative bg-graphite-dark overflow-hidden select-none">
        
        {/* Fine dots matrix overlay from layout sample */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#b87333 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>

        {/* Full picture using custom generated premium assets */}
        <img
          src="/src/assets/images/barbershop_auth_bg_1780159251049.png"
          alt="Luxury Barbearia Industrial Design"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover brightness-50 scale-105 filter saturate-[0.80] contrast-[1.05]"
        />

        {/* Ambient graphite / copper gradient overlay to ground typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-graphite-dark via-graphite-dark/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-graphite-panel via-transparent to-transparent opacity-95 w-1/3" />

        {/* Text over image */}
        <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 xl:bottom-16 xl:left-16 xl:right-16 z-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 border border-copper/35 rounded-full text-[10px] text-[#d99152] font-mono tracking-widest uppercase mb-3 shadow-xl">
            <Sparkles className="w-3 h-3" />
            <span>Orquestre sua Operação com IA</span>
          </div>
          
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-serif text-white leading-tight font-normal">
            Orquestre sua <br />
            <span className="text-copper italic font-light">operação</span> com inteligência.
          </h2>

          <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-lg font-sans">
            Centralize o relacionamento, simule regras financeiras, redija campanhas de marketing completas e monitore estoque preventivo sem esforço.
          </p>

          <div className="grid grid-cols-2 gap-2.5 text-left mt-4 pt-4 border-t border-gray-800/40">
            <div className="p-2.5 lg:p-3 xl:p-4 border border-graphite-border bg-graphite-panel/50 backdrop-blur-sm">
              <span className="block text-copper font-serif italic text-sm lg:text-base">01. Atendimento</span>
              <span className="text-[9px] uppercase text-gray-500 tracking-tighter">Agendamentos automáticos</span>
            </div>
            <div className="p-2.5 lg:p-3 xl:p-4 border border-graphite-border bg-graphite-panel/50 backdrop-blur-sm">
              <span className="block text-copper font-serif italic text-sm lg:text-base">02. Financeiro</span>
              <span className="text-[9px] uppercase text-gray-500 tracking-tighter">Cálculo de comissões & caixa</span>
            </div>
            <div className="p-2.5 lg:p-3 xl:p-4 border border-graphite-border bg-graphite-panel/50 backdrop-blur-sm">
              <span className="block text-copper font-serif italic text-sm lg:text-base">03. Marketing</span>
              <span className="text-[9px] uppercase text-gray-500 tracking-tighter">Fidelização inteligente posts</span>
            </div>
            <div className="p-2.5 lg:p-3 xl:p-4 border border-graphite-border bg-graphite-panel/50 backdrop-blur-sm">
              <span className="block text-copper font-serif italic text-sm lg:text-base">04. Suprimentos</span>
              <span className="text-[9px] uppercase text-gray-500 tracking-tighter">Gestão de estoque ativa</span>
            </div>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-copper opacity-[0.04] blur-[120px] rounded-full"></div>

        {/* Top-right floating glass decoration card */}
        <div className="absolute top-8 right-8 z-20 backdrop-blur-md bg-black/40 border border-white/10 p-4 rounded-xl shadow-2xl flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-copper animate-pulse" />
          <span className="text-xs font-mono text-gray-300">Automação Ativa: Atendimento, Financeiro +3</span>
        </div>

      </div>

    </div>
  );
}
