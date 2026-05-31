import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Helper to get GoogleGenAI client lazy-initialized
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("A chave GEMINI_API_KEY não foi configurada nos segredos (Secrets panel).");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser limit elevated in case we send structural context
  app.use(express.json({ limit: "5mb" }));

  // API endpoints FIRST

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Chat proxy endpoint mapping request to Gemini API
  app.post("/api/chat", async (req, res) => {
    try {
      const { agent, messages, salonSettings } = req.body;

      if (!agent || !messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Parâmetros inválidos. É necessário enviar o agente e as mensagens." });
      }

      // Check key
      const ai = getGeminiClient();

      // Build rich guidelines grounding the agent in the Barber Shop reality
      const salonCtx = salonSettings ? `
DADOS DA BARBEARIA:
- Nome da Barbearia: ${salonSettings.name || 'Não definido'}
- Endereço: ${salonSettings.address || 'Não definido'}
- Contato/WhatsApp: ${salonSettings.phone || 'Não definido'}
- Horário de Funcionamento: ${salonSettings.hours || 'Não definido'}
- Serviços e Preços:
  ${(salonSettings.services || []).map((s: any) => `* ${s.name}: R$ ${s.price} (${s.duration || '30'}min)`).join('\n  ') || 'Serviços básicos de cabelo e barba'}
- Profissionais/Barbeiros da Casa:
  ${(salonSettings.barbers || []).join(', ') || 'Nossos barbeiros especialistas'}
` : '';

      // Set the system instructions according to the agent's specific sector
      const systemInstruction = `
Você é o agente de inteligência artificial criado especificamente para automatizar tarefas de uma barbearia.
Seu nome é "${agent.name}" e você trabalha no setor de "${agent.sector}".
Persona/Instruções Gerais de Atuação:
${agent.instructions || 'Seja amigável, prestativo e profissional no ramo de barbearia.'}

Abaixo estão as informações reais/regras de negócios da barbearia que você representa. Use-as para responder com precisão:
${salonCtx}

DIRETRIZES DE SETOR:
${agent.sector === 'Atendimento/Recepção' ? `
- Sua função é recepcionar clientes, explicar serviços, tirar dúvidas sobre horários e agendar atendimentos.
- Se o cliente quiser agendar, ajude-o simulando o agendamento sugerindo horários de acordo com o funcionamento da barbearia.
- Mantenha um tom acolhedor, moderno e descontraído, típico de barbearias contemporâneas.
` : ''}

${agent.sector === 'Financeiro/Contabilidade' ? `
- Sua função é auxiliar a gerência da barbearia com dúvidas tributárias, controle de comissões de barbeiros (ex: padrão de 50/50 ou 60/40), cálculo de custos operacionais (pomadas, navalhas, aluguel) e estimativa de faturamento de corte/barba.
- Faça contas passo a passo quando solicitado e ofereça conselhos de economia de custos. Mantenha um tom profissional, preciso e analítico.
` : ''}

${agent.sector === 'Marketing/Redes Sociais' ? `
- Sua função é gerar copies de engajamento para Instagram, ideias de promoções (ex: "Traga um amigo e ganhe 20% no segundo corte"), estratégias para dias de menor movimento (terças e quartas) e mensagens de fidelização via WhatsApp.
- Seja criativo, persuasivo e use gírias modernas adequadas ao público masculino e jovem fã de degradê, barboterapia, cortes americanos e afins.
` : ''}

${agent.sector === 'Estoque/Fornecedores' ? `
- Sua função é sugerir quantidades de recompras de insumos de barbearia (Golas higiênicas, pomadas modeladoras, espumas de barbear, loções pós-barba) e estruturar tabelas de controle de produtos ou sugerir marcas de qualidade.
- Ajude a analisar orçamentos de fornecedores de forma organizada.
` : ''}

${agent.sector === 'Gerência/Estratégia' ? `
- Sua função é apoiar o dono da barbearia na tomada de decisões difíceis (aumento de preços, contratação de novos profissionais, expansão para novos pontos).
- Forneça análises SWOT, planos de ação e metodologias de qualidade para a experiência do cliente (ex: cafégrátis, cerveja de cortesia, fliperama).
` : ''}

Importante: Responda em português brasileiro. Seja direto e incorpore o estilo e jargão de barbearia (ex: "Fala irmão!", "Beleza?", "Corte alinhado", "Degradê na régua") de acordo com seu setor, mas priorizando a precisão do seu papel.
`;

      // Structure messages list into Gemini's expected contents format
      // filter out system roles if anyway simulated, use standard user/model structure
      const formattedContents = messages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ content: response.text });
    } catch (error: any) {
      console.error("Erro na API de chat com Gemini:", error.message);
      res.status(500).json({ error: error.message || "Erro interno ao processar chat com o agente." });
    }
  });

  // Serve static application bundle or connect dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[BarberAgent AI] Server binging to port ${PORT}`);
  });
}

startServer();
