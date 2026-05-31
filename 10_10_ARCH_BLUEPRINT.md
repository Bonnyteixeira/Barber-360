# ====================================================================
# BARBER 360 ENTERPRISE PLATFORM — BLUEPRINT DE REFATORAÇÃO ESTRUTURAL (10/10)
# ====================================================================

Este documento apresenta o blueprint arquitetural completo de refatoração estrutural (padrão 10/10) para o ecossistema SaaS Barber 360. Ele formaliza a nova estrutura de diretórios, de segurança multi-tenant baseada em isolamento de dados, roteamento centralizado, orquestração assíncrona baseada em filas e separação estrita de camadas.

---

## 1. VISÃO GERAL DA ARQUITETURA CONCEITUAL
O Barber 360 opera sob o conceito de **Modular Monolith com Isolamento Multitenant Lógico**. Toda requisição passa por um Gateway unificado que autentica, resolve o escopo do locatário (tenant) e aplica regras avançadas de limitação de taxa (rate limiting), antes de direcioná-la às rotas dedicadas de cada domínio.

```
                      +-----------------------------+
                      |    DNS / Cloudflare WAF     |
                      +--------------+--------------+
                                     |
                 +--------------------+--------------------+
                 |                                         |
                 v                                         v
     +-----------------------+                 +-----------------------+
     |    Client Platform    |                 |  Operations Platform  |
     | (Barbearias / Tenants)|                 | (Barber 360 Operator) |
     +-----------+-----------+                 +-----------+-----------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                       BACKEND ENTERPRISE GATEWAY                        |
|                                                                         |
|  - Rate Limiting (por plano do Tenant)                                  |
|  - Security Hardened Headers (Helmet)                                   |
|  - Tenant Injector / Context Filter (tenant.middleware.ts)              |
|  - JWT Authorization & RBAC Filter (auth.middleware.ts)                 |
+------------------------------------+------------------------------------+
                                     |
                                     v
    +-----------------------------------------------------------------+
    |                     DOMAIN-DRIVEN MODULES                       |
    |                                                                 |
    |  - ai          - analytics     - appointments  - auth           |
    |  - barbers     - billing       - clients       - communication  |
    |  - crm         - financial     - marketing     - operations     |
    |  - scheduling  - services      - storage                        |
    +--------------------------------+--------------------------------+
                                     |
                +--------------------+--------------------+
                |                                         |
                v (BullMQ / Redis)                        v (Prisma Client Singleton)
     +----------------------+                  +----------------------+
     |  Asynchronous Jobs   |                  |  PostgreSQL Engine   |
     |  - WhatsApp dispatch |                  |  - Tenant Scoped     |
     |  - Email marketing   |                  |  - Auto transaction  |
     |  - Automated billing |                  |  - Seeds & Migrations|
     +----------------------+                  +----------------------+
```

---

## 2. BLUEPRINT COMPLETO DE DIRETÓRIOS E COMPONENTES (COMENTADO)

### 2.1 Ecosistema Backend (`/backend/src/`)

```txt
backend/src/
├── index.ts                           # Ponto de boot, inicialização do Express, middlewares globais e escuta na porta 3000
├── routes.ts                          # Roteador central. Importa e monta recursivamente as rotas (routes.ts) de cada módulo
│
├── config/                            # CAMADA CENTRAL DE CONFIGURAÇÕES (Único local onde process.env é aceito)
│   ├── index.ts                       # Export central que encapsula e expõe todas as sub-configurações validadas
│   ├── env.ts                         # Validação estrita e tipagem do env com Zod, lançando erro imediato em caso de ausência
│   ├── database.ts                    # Parâmetros de pooling e sintonia de conexões do PostgreSQL/Prisma
│   ├── redis.ts                       # Configuração de conexão do Redis para uso no BullMQ e Cache de contingência
│   ├── ai.ts                          # Chaves privadas e parâmetros de contexto global dos SDKs de IA (Gemini, OpenAI)
│   └── storage.ts                     # Credenciais do bucket S3-compatible (AWS / Cloudflare R2) para uploads estáticos
│
├── database/                          # GERENCIAMENTO DE PERSISTÊNCIA & VERSÕES
│   ├── connection.ts                  # Singleton da instância do Prisma Client configurado com tratamento seguro de conexões
│   ├── migrations/                    # Repositório físico das migrations SQL versionadas cronologicamente
│   │   └── YYYYMMDD_descricao.ts      # Exemplo de arquivo de alteração de schema SQL
│   ├── seeds/                         # Massa de dados padrão para novos deploys
│   │   ├── index.ts                   # Orquestrador sequencial de todos os seeds (Prisma seed runner entry point)
│   │   ├── plans.seed.ts              # Insere planos originais da plataforma (Starter, Pro, Enterprise, Limites)
│   │   └── admin.seed.ts              # Insere o usuário raiz padrão dos operadores SaaS
│   └── helpers/
│       └── transaction.ts             # Facilitador de transações assíncronas concorrentes com tratamento nativo de rollback
│
├── jobs/                              # GERENCIAMENTO DE PROCESSAMENTO ASSÍNCRONO & BACKGROUND CHECKS
│   ├── index.ts                       # Registrador, orquestrador e listener central de todos os Workers BullMQ ativos
│   ├── queues.ts                      # Definição e instanciação unificada das filas lógicas do Redis
│   └── workers/                       # Executores específicos das tarefas pesadas em background
│       ├── whatsapp.worker.ts         # Distribui mensagens e disparos de conversações para a API do WhatsApp
│       ├── email.worker.ts            # Consome fila e dispara marketing de campanhas com layouts HTML responsivos
│       ├── billing.worker.ts          # Processa faturamentos recorrentes periódicos e assina retornos de webhooks
│       ├── reminder.worker.ts         # Dispara lembretes inteligentes de consultas agendadas para evitar No-shows
│       └── ai-quota.worker.ts         # Reavalia cotas de tokens consumidas por cada Tenant de forma assíncrona
│
├── shared/                            # RECURSOS TÉCNICOS TRANSVERSAIS A TODOS OS MÓDULOS
│   ├── middlewares/                   # Interceptadores encadeados de requisições HTTP
│   │   ├── auth.middleware.ts         # Decodifica e valida JWT Bearer Token, inserindo ID do usuário no escopo "req.user"
│   │   ├── tenant.middleware.ts       # Identifica subdomínio ou cabeçalho 'x-tenant-id', validando robustamente contra fraude
│   │   ├── rate-limit.middleware.ts   # Limitador de taxa dinâmico que puxa limites contratados no plano atual do tenant
│   │   └── logger.middleware.ts       # Captura metadados de requests e gera log estruturado e padronizado em console JSON
│   ├── guards/                        # Filtros booleanos de segurança avançada
│   │   ├── plan.guard.ts              # Compara o plano ativo do Tenant contra a permissão de acesso à rota executada
│   │   └── quota.guard.ts             # Retém a execução imediata se o consumo de tokens mensais do Tenant estiver estourado
│   ├── errors/                        # Gestão padronizada de anomalias na execução
│   │   ├── app.error.ts               # Exceção base estendida do JavaScript Core Error com status HTTP e códigos internos
│   │   ├── http.errors.ts             # Classes especializadas herdeiras: NotFoundError, BadGateway, UnauthorizedError, etc.
│   │   └── handler.ts                 # Capturador global de erros (Express Error Middleware), serializando e mascarando falhas internas
│   ├── decorators/
│   │   └── tenant.decorator.ts        # Helper sintático para extração rápida do escopo tenant em ambientes MVC integrados
│   └── utils/                         # Utilitários de lógica pura
│       ├── pagination.ts              # Normalizador de fatias de dados (Count, Limit, Cursor e Offset helpers)
│       ├── date.ts                    # Conversor temporal blindado e sincronizado com os fusos horários locais dos Tenants
│       └── crypto.ts                  # Cifradores, geradores de hash bcrypt e criação de hashes efêmeros seguros
│
└── modules/                           # ARQUITETURA DOMAIN-DRIVEN MODULAR (100% de representação isolada)
    ├── auth/                          # 01. Gestão de Contas, Senhas e Tokens de Login
    │   ├── auth.controller.ts
    │   ├── auth.service.ts
    │   ├── auth.repository.ts
    │   ├── auth.dto.ts
    │   ├── auth.schema.ts
    │   ├── auth.routes.ts
    │   └── auth.spec.ts
    │
    ├── core/                          # 02. Parâmetros Base de Cadastro de Barbearias e Tenants
    │   ├── core.controller.ts
    │   ├── core.service.ts
    │   ├── core.repository.ts
    │   ├── core.dto.ts
    │   ├── core.schema.ts
    │   ├── core.routes.ts
    │   └── core.spec.ts
    │
    ├── scheduling/                    # 03. Grade Geral de Profissionais e Atendimento das Barbearias
    │   ├── scheduling.controller.ts
    │   ├── scheduling.service.ts
    │   ├── scheduling.repository.ts
    │   ├── scheduling.dto.ts
    │   ├── scheduling.schema.ts
    │   ├── scheduling.routes.ts
    │   └── scheduling.spec.ts
    │
    ├── appointments/                  # 04. Criador e Analisador de Agendamentos e Conflitos de Agenda
    │   ├── appointments.controller.ts
    │   ├── appointments.service.ts
    │   ├── appointments.repository.ts
    │   ├── appointments.dto.ts
    │   ├── appointments.schema.ts
    │   ├── appointments.routes.ts
    │   ├── appointments.job.ts        # Enfileira lembretes assíncronos das reuniões criadas
    │   └── appointments.spec.ts
    │
    ├── barbers/                       # 05. Controle de Funcionários, Horários, Portfólio e Parcerias
    │   ├── barbers.controller.ts
    │   ├── barbers.service.ts
    │   ├── barbers.repository.ts
    │   ├── barbers.dto.ts
    │   ├── barbers.schema.ts
    │   ├── barbers.routes.ts
    │   └── barbers.spec.ts
    │
    ├── services/                      # 06. Catálogo de Procedimentos Disponibilizados pelo Salão
    │   ├── services.controller.ts
    │   ├── services.service.ts
    │   ├── services.repository.ts
    │   ├── services.dto.ts
    │   ├── services.schema.ts
    │   ├── services.routes.ts
    │   └── services.spec.ts
    │
    ├── clients/                       # 07. Gestor de Informações Gerais do Comprador Final
    │   ├── clients.controller.ts
    │   ├── clients.service.ts
    │   ├── clients.repository.ts
    │   ├── clients.dto.ts
    │   ├── clients.schema.ts
    │   ├── clients.routes.ts
    │   └── clients.spec.ts
    │
    ├── crm/                           # 08. CRM de Retenção Dinâmica (Classificações VIP, Inativos, Aniversariantes)
    │   ├── crm.controller.ts
    │   ├── crm.service.ts
    │   ├── crm.repository.ts
    │   ├── crm.dto.ts
    │   ├── crm.schema.ts
    │   ├── crm.routes.ts
    │   └── crm.spec.ts
    │
    ├── communication/                 # 09. Módulo Integrado de Chat de Atendimento WhatsApp Corporativo
    │   ├── communication.controller.ts
    │   ├── communication.service.ts
    │   ├── communication.repository.ts
    │   ├── communication.dto.ts
    │   ├── communication.schema.ts
    │   ├── communication.routes.ts
    │   ├── communication.job.ts       # Envia mensagens individuais e ouve sessões via fila Redis
    │   └── communication.spec.ts
    │
    ├── marketing/                     # 10. Campanhas Inteligentes de SMS/WhatsApp e Otimização de Clientes Inativos
    │   ├── marketing.controller.ts
    │   ├── marketing.service.ts
    │   ├── marketing.repository.ts
    │   ├── marketing.dto.ts
    │   ├── marketing.schema.ts
    │   ├── marketing.routes.ts
    │   ├── marketing.job.ts          # Disparador assíncrono em blocos para marketing de alta vazão
    │   └── marketing.spec.ts
    │
    ├── financial/                     # 11. Controle Financeiro Local, Caixa e Gestão de Comissões por Barbeiro
    │   ├── financial.controller.ts
    │   ├── financial.service.ts
    │   ├── financial.repository.ts
    │   ├── financial.dto.ts
    │   ├── financial.schema.ts
    │   ├── financial.routes.ts
    │   └── financial.spec.ts
    │
    ├── billing/                       # 12. Gestão de Contratos SaaS, Gateway de Cobrança e Ingressos (Stripe / Pix)
    │   ├── billing.controller.ts
    │   ├── billing.service.ts
    │   ├── billing.repository.ts
    │   ├── billing.dto.ts
    │   ├── billing.schema.ts
    │   ├── billing.routes.ts
    │   ├── billing.job.ts             # Cuida do monitoramento recorrente e assinaturas com atrasos
    │   └── billing.spec.ts
    │
    ├── ai/                            # 13. Orquestrador de Agentes de IA e Configuração de Tom de Voz
    │   ├── ai.controller.ts
    │   ├── ai.service.ts
    │   ├── ai.repository.ts
    │   ├── ai.dto.ts
    │   ├── ai.schema.ts
    │   ├── ai.routes.ts
    │   └── ai.spec.ts
    │
    ├── analytics/                     # 14. Relatórios Analíticos de Alto Nível de Faturamento, MRR, LTV e Churn
    │   ├── analytics.controller.ts
    │   ├── analytics.service.ts
    │   ├── analytics.repository.ts
    │   ├── analytics.dto.ts
    │   ├── analytics.schema.ts
    │   ├── analytics.routes.ts
    │   └── analytics.spec.ts
    │
    ├── storage/                       # 15. Backup e Upload de Arquivos de Mídia e Comprovantes em Nuvem
    │   ├── storage.controller.ts
    │   ├── storage.service.ts
    │   ├── storage.repository.ts
    │   ├── storage.dto.ts
    │   ├── storage.schema.ts
    │   ├── storage.routes.ts
    │   └── storage.spec.ts
    │
    └── operations/                    # 16. Console Exclusivo da Equipe SaaS Operadora (Painel Global)
        ├── operations.controller.ts
        ├── operations.service.ts
        ├── operations.repository.ts
        ├── operations.dto.ts
        ├── operations.schema.ts
        ├── operations.routes.ts
        └── operations.spec.ts
```

---

### 2.2 Repositório Frontend (`/src/`)

```txt
src/
├── app/                               # CAMADA DE CONFIGURAÇÃO DO FLUXO DO APLICATIVO (React/SPA)
│   ├── providers/
│   │   └── ThemeProvider.tsx          # Aplica a paleta padrão do sistema ("Amber Copper/Graphite") e variáveis CSS de cores
│   ├── router/
│   │   └── AppRouter.tsx              # Roteador central. Controla e gerencia rotas públicas, privadas e layouts associados
│   ├── layouts/
│   │   └── DashboardLayout.tsx        # Container unificado com sidebar responsivo, barra de ferramentas e controle de carregamento
│   └── guards/
│       └── AuthGuard.tsx              # Protege visões privadas redirecionando para a rota de identificação se sem token válido
│
├── services/                          # ISOLAMENTO DE CHAMADAS HTTP (Client de API externa)
│   ├── api.ts                         # Instância isolada do Axios. Responsável por injetar JWT, cabeçalho e converter erros globais
│   ├── auth.service.ts                # Conexões de login administrativo, redefinição de credenciais e token refreshes
│   ├── appointments.service.ts        # Operações de inserção, leitura de janelas livres, alterações e cancelamento de reuniões
│   ├── crm.service.ts                 # Download de planilhas de clientes categorizados sob métricas do salão
│   ├── financial.service.ts           # Requisições de demonstrativo contábil, split de pagamento e recebimento de comissões
│   └── ai.service.ts                  # Envio e calibração de prompts de teste do atendente virtual do salão
│
├── hooks/                             # HOOKS DE COMPARTILHAMENTO DE COMPORTAMENTOS (Sem repetição de código)
│   ├── useAuth.ts                     # Estado local de logon, validação no start da aplicação e limpeza de tokens localmente
│   ├── useTenant.ts                   # Obtém e atualiza dados cadastrais, plano e limites em tempo real da Barbearia logada
│   ├── useAppointments.ts             # Custom hook de carregamento e caching das grades de horários semanais da barbearia
│   └── useDebounce.ts                 # Atrasa o trigger de busca nos formulários, protegendo os endpoints de requisições spam
│
├── types/                             # SEPARAÇÃO DE TIPOS E INTERFACES DE EXECUÇÃO (Divididos por domínio)
│   ├── index.ts                       # Exporta e integra todas as assinaturas de domínios em um ponto central
│   ├── auth.types.ts                  # Interfaces de Usuário logado, Payload, Token, Permissões e Perfis (Roles)
│   ├── tenant.types.ts                # Contratos do Tenant cadastrado, dados contratuais com Stripe, Limites e Status do SaaS
│   ├── appointment.types.ts           # Definição técnica de Agenda, Consultas, Status, Profissional do corte e Serviços
│   ├── financial.types.ts             # Registros de faturamento local, comissões em aberto dos profissionais e balanços de caixa
│   └── api.types.ts                   # Estruturas padrão de requisição, paginação e envelopes tipados de payloads do backend
│
├── shared/                            # ASSINATURAS E COMPONENTES GENÉRICOS REUTILIZÁVEIS
│   ├── components/
│   │   ├── Button.tsx                 # Botão base altamente customizável que suporta variante loading, icons e temas
│   │   ├── Card.tsx                   # Container estandardizado para bento grid, com bordas finas e sombras calibradas 
│   │   └── Input.tsx                  # Campo de formulário de alta densidade visual com suporte a máscaras de dados integradas
│   ├── utils/
│   │   └── format.ts                  # Formatador de moedas em Real (R$), fone (DDI), CNPJ e datas conforme regras locais
│   └── constants/
│       └── defaultTheme.ts            # Vetores de cores para o tailwind e predefinições estéticas
│
└── modules/                           # MÓDULOS DE RENDERIZAÇÃO DE TELA (Navegação baseada em sub-painéis)
    ├── core/                          # Módulo principal da barbearia (Visão de Faturamento, Clientes e Status de IA)
    ├── communication/                 # Módulo do painel de controle de conversas, triagem com IA e histórico
    ├── scheduling/                    # Painel profissional dinâmico de horários e agendamento da semana
    ├── financial/                     # Painel contábil, split de tarifas e folha dos barbeiros
    ├── ai/                            # Área de definição dos atendentes inteligentes (Simulação de voz e tom)
    ├── crm/                           # Painel de inteligência de clientes cadastrados, agrupados por fidelidade
    ├── marketing/                     # Lançador de campanhas e reativação pelo WhatsApp
    ├── settings/                      # Configurações do perfil e configurações da barbearia
    └── operations/                    # Console central isolado para a equipe de administração do SaaS (Operadora - 11 Sub-módulos)
        ├── index.tsx                  # Consolidador de rotas internas. Monta o sub-roteador do painel operacional com lazy loading de cada módulo
        │
        ├── central/                   # 01. Central Operacional
        │   └── index.tsx              # Dashboard em tempo real: alertas críticos do sistema, tenants com falha, sessões WhatsApp instáveis e jobs travados
        │
        ├── clientes-saas/             # 02. Controle de Tenants
        │   └── index.tsx              # Listagem de todos os tenants com status (Ativo, Trial, Suspenso, Cancelado). Ações: suspender, reativar, impersonar tenant
        │
        ├── assinaturas/               # 03. Faturamento de Planos
        │   └── index.tsx              # Gestão de assinaturas ativas, cobranças pendentes, histórico de pagamentos e upgrade/downgrade manual de planos
        │
        ├── financeiro-saas/           # 04. Balanço Global do SaaS
        │   └── index.tsx              # Visão consolidada de receita total, MRR líquido, custos de infraestrutura, margem e projeções de crescimento
        │
        ├── monitoramento-ia/          # 05. Auditoria de Consumo de IA
        │   └── index.tsx              # Consumo de tokens por tenant (diário/mensal), custo por tenant, alertas de uso anômalo e configuração de cotas globais
        │
        ├── sessoes/                   # 06. Status de Sessões WhatsApp
        │   └── index.tsx              # Monitor de todas as sessões WhatsApp conectadas por tenant: status QR, reconexão, tempo de uptime e histórico de quedas
        │
        ├── suporte/                   # 07. Central de Suporte
        │   └── index.tsx              # Tíquetes abertos pelos tenants com prioridade, status, atribuição de agente interno e histórico de atendimento
        │
        ├── equipe/                    # 08. Gestão da Equipe Interna
        │   └── index.tsx              # Contas do staff operacional com permissões por módulo (somente-leitura, editor, admin). Controle de acesso ao painel operations/
        │
        ├── analytics/                 # 09. BI e Indicadores SaaS
        │   └── index.tsx              # Painel de KPIs estratégicos: MRR, ARR, LTV médio, CAC, Churn Rate mensal, Net Revenue Retention e cohort de retenção
        │
        ├── logs/                      # 10. Auditoria e Segurança
        │   └── index.tsx              # Log de todas as ações críticas do sistema: logins, alterações de plano, acessos ao painel operations, erros 5xx e eventos de segurança
        │
        └── admin/                     # 11. Configurações Globais
            └── index.tsx              # Feature flags por tenant ou global, configurações de limites padrão de planos, manutenção do sistema e variáveis operacionais editáveis em runtime

### Regras adicionais para o módulo operations/:
- Nenhuma rota de operations/ deve ser acessível por tokens de tenant. O AuthGuard deve verificar role === 'saas_operator' antes de renderizar qualquer sub-módulo
- O sub-módulo central/ é a tela inicial (index route) do painel operations/
- Os sub-módulos de analytics/ e financeiro-saas/ consomem endpoints exclusivos do backend/src/modules/operations/ — nunca os endpoints dos módulos de tenant
```

---

## 3. NOVO DIAGRAMA DE ENTIDADE-RELACIONAMENTO (DER ENTERPRISE)

```sql
-- 1. TENANTS SECTOR (Isolamento total e multi-tenancy rígido)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  subdomain VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'pro', -- starter, pro, enterprise
  status VARCHAR(20) DEFAULT 'active', -- active, suspended, canceled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS (Contas administrativas e profissionais)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- super_admin, barber_owner, barber, financial, operations_manager
  phone VARCHAR(25),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. BARBERS (Profissionais e comissionamentos adicionais)
CREATE TABLE barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  specialties TEXT[] DEFAULT '{}',
  commission_rate NUMERIC(5,2) DEFAULT 50.00,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- 4. SERVICES CATALOG (Catálogo de Preços e Tempos de Execução)
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  duration INT NOT NULL, -- tempo em minutos
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- 5. CLIENTS / CRM PLATFORM (Estrutura de retenção)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(25) NOT NULL,
  birthday DATE,
  classification VARCHAR(30) DEFAULT 'regular', -- regular, vip, inactive
  total_spent NUMERIC(10,2) DEFAULT 0.00,
  appointments_count INT DEFAULT 0,
  last_appointment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. APPOINTMENTS (Agenda e Status da transação de serviços)
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(30) DEFAULT 'scheduled', -- scheduled, confirmed, finished, canceled
  total_price NUMERIC(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. COMMISSIONS (Lançamento de comissões por barbeiro)
CREATE TABLE commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  barber_id UUID REFERENCES barbers(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. COMMUNICATIONS & CHATS (Módulo do Atendente)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active', -- active, bot_handling, manual, closed
  last_message_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender VARCHAR(20) NOT NULL, -- client, bot, human
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. AI CONFIG (Parametrização dos Atendentes Inteligentes)
CREATE TABLE ai_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE UNIQUE,
  agent_name VARCHAR(100) DEFAULT 'Atendente Virtual',
  personality VARCHAR(50) DEFAULT 'friendly', -- professional, friendly, casual, classic
  custom_rules TEXT,
  trigger_reactivation_days INT DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. BILLING & SUBSCRIPTIONS (Controle de faturamento do SaaS)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  plan_price NUMERIC(10,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'active', -- active, past_due, trial, suspended
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. AUDIT & LOG ENGINE (Segurança e Rastreabilidade)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID,
  action VARCHAR(100) NOT NULL, -- CREATE_BARBER, DELETE_APPOINTMENT, UPDATE_PLAN
  entity VARCHAR(50) NOT NULL,
  entity_id UUID,
  ip_address VARCHAR(45),
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. CONSTRAINTS E DECISÕES TÉCNICAS MANDATÓRIAS
- **Filtros Multi-Tenant em Banco**: É expressamente proibida qualquer query no banco Postgres sem filtragem no escopo da base por `tenant_id`. Em implementações futuras, o uso de Row Level Security (RLS) via Postgres é o padrão ouro de refatoração para blindagem física.
- **Acoplamento Zero entre Domínios**: Nenhum módulo do backend pode importar código funcional interno de outro módulo diretamente. Quando houver dependências de execução, deve ser utilizada injeção de microsserviços via Eventos Descentralizados (EventEmitter / Kafka / Redis PubSub) ou interfaces desacopladas.
- **Tratamento Escrito de Chaves e Ambientes**: A leitura de variáveis globais usando `process.env` fora da pasta `config/` gerará rejeição em builds automatizados de CI/CD. Os módulos sempre devem solicitar configurações injetadas pelo singleton configurador.
- **Validação de Entrada e Saída (DTO)**: Todos os controllers backend exigem assinatura obrigatória através de schemas Zod/Class-Validator para saneamento de strings, impedindo SQL Injection, Cross-Site Scripting (XSS) ou estouro de buffer nos módulos.

---

## 5. ORDEM DE MIGRAÇÃO RECOMENDADA (PASSO A PASSO)

Para migrar a estrutura atual para o novo blueprint 10/10 sem interromper o serviço em produção ou quebrar referências, siga esta sequência ordenada de passos:

```
[FASE 1: Config & Shared Inicial] -> [FASE 2: Database & Conexão Singleton] -> [FASE 3: Estrutura Modular por Domínio] -> [FASE 4: Ambiente de Testes Integrados] -> [FASE 5: Jobs & BullMQ Redis] -> [FASE 6: Frontend Refactoring]
```

### Passo 1: Construir a Camada Config e Validação de Ambiente (Backend)
1. Crie os arquivos em `backend/src/config/`.
2. Habilite o validador Zod em `backend/src/config/env.ts` para verificar as variáveis de banco de dados, chaves de APIs e portas globais.
3. Altere o boot em `backend/src/index.ts` para ler as configurações validadas a partir do import central `backend/src/config`.

### Passo 2: Padronizar o barramento Shared e Tratamento de Eror (Sem Quebra)
1. Escreva o arquivo `backend/src/shared/errors/app.error.ts` e o capturador global de erros `backend/src/shared/errors/handler.ts`.
2. Configure o capturador de erros como o último middleware do Express no roteador raiz.
3. Crie os middlewares básicos lógicos em `backend/src/shared/middlewares`: `auth.middleware.ts` e `tenant.middleware.ts` para que todos os novos endpoints usem esse roteamento unificado.

### Passo 3: Migração de Persistência e Instanciação Singleton
1. Transfira a lógica de inicialização de conexões e pooling para `backend/src/database/connection.ts`.
2. Certifique-se de que todas as consultas ativas utilizem o singleton extraído da conexão do banco de dados, protegendo contra exaustão de pool.

### Passo 4: Migração Dominial Sequencial (Um por Um)
Para cada módulo existente no backend (começando por `auth`, seguido de perto por `core` e `scheduling`):
1. Crie a pasta dedicada em `backend/src/modules/<modulo>/`.
2. Separe as linhas de código existentes nas camadas estritas: `dto.ts` (validação de payloads), `controller.ts` (req/res), `service.ts` (regras e orquestração) e `repository.ts` (queries diretas ao banco).
3. Atualize o arquivo `backend/src/routes.ts` para carregar as rotas isoladas (`<modulo>.routes.ts`) do módulo recém-refatorado, desativando os endpoints anteriores.

### Passo 5: Configuração do Ambiente de Testes de Integração
Descreva detalhadamente a infraestrutura de testes de integração para evitar regressões funcionais durante as migrações:

5.1. Setup global dos testes (`backend/src/tests/setup.ts`):
- Inicialização de banco de dados em memória (PostgreSQL via Docker de teste ou SQLite em modo de teste).
- Reset de dados entre cada suite de forma automatizada (através de truncate das tabelas ou rollback estrutural de transação).
- Carregamento das variáveis de ambiente de teste a partir de um arquivo dedicado `.env.test`.
- Mock global do cliente de IA para evitar chamadas de serviços e faturamentos de APIs externas reais durante o pipeline do CI.
- Mock global do Redis/BullMQ para desacoplar as suites de teste de dependências físicas de infraestrutura local de fila.

5.2. Helpers de teste obrigatórios (`backend/src/tests/helpers/`):
- `auth.helper.ts`: helper funcional de hashing que gera tokens JWT válidos com segredo criptográfico de teste, com variantes completas para SaaS Operator, Tenant Owner e Cliente comum do salão.
- `tenant.helper.ts`: inicia, injeta e retorna o registro de um Tenant isolado e saneado no banco temporário (com seu plano específico, status operacional e parâmetros mínimos), garantindo isolamento total por namespace entre testes paralelos concorrentes.
- `http.helper.ts`: abstração em cima da suite funcional do Supertest que pré-injeta os cabeçalhos obrigatórios "Authorization" de portador e "x-tenant-id" para requisições controladas.

5.3. Critério de aprovação ("Portão Verde" - Safe Deployment):
- Todos os domínios reestruturados e migrados no Passo 4 necessitam possuir pelo menos um teste de integração de ponta-a-ponta validando o caminho feliz (happy path).
- O fluxo contínuo (CI Pipeline) deve invocar e validar a suite completa de testes integrados antes de disponibilizar novos merges de branches.
- Índice de cobertura mínimo de linhas de 60% focado estritamente nos três domínios críticos: `auth`, `billing` e `appointments`.

5.4. Estrutura de diretórios resultante para testes:
```txt
backend/src/tests/
├── setup.ts                     # Setup global: DB, mocks, env
├── helpers/
│   ├── auth.helper.ts           # Gera tokens JWT de teste (admin, owner, user)
│   ├── tenant.helper.ts         # Cria tenants isolados por suite
│   └── http.helper.ts           # Wrapper supertest com headers automáticos
└── integration/
    ├── auth.test.ts             # Login, refresh, revogação de token
    ├── appointments.test.ts     # Criação, conflito de horário, cancelamento
    ├── billing.test.ts          # Criação de assinatura, webhook de pagamento
    └── ai.test.ts               # Limites de cota, retorno mockado da API
```

### Passo 6: Configuração de Filas Concorrentes (BullMQ)
1. Instale e configure o BullMQ em `backend/src/jobs/queues.ts`.
2. Injete os handlers funcionais assíncronos no diretório `backend/src/jobs/workers/` para WhatsApp, e-mail e billing.
3. Introduza os arquivos `<modulo>.job.ts` nos domínios correspondentes para delegar suas requisições demoradas ao redis/workers centralizados de processamento.

### Passo 7: Alinhamento de Serviços e Hooks (Frontend)
1. No frontend, isole as conexões do Axios na pasta `src/services/` e mova as credenciais de tratamento de cookies ou headers para lá.
2. Divida os tipos que estão inflados em `src/types.ts` movendo-os em blocos de arquivos especialistas para `src/types/*.types.ts` e re-exportando-os em `src/types/index.ts`.
3. Desenvolva os Hooks gerais (`useAuth`, `useTenant`, `useAppointments`) para gerenciar as chamadas funcionais de forma idêntica e integrada entre os sub-painéis do painel principal de navegação.
