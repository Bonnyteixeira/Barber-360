# Barber 360 - Backend Enterprise Architecture

Este documento descreve a arquitetura geral do backend da plataforma **Barber 360**, um SaaS Multi-Tenant projetado com foco em alta escalabilidade, segurança rigorosa, observabilidade e prontidão para produção.

---

## 1. Visão Arquitetural

Adotamos o padrão **Modular Monolith (Monólito Modular)** orientado a domínios (DDD) seguindo os princípios de **Clean Architecture** e **SOLID**. Essa decisão permite uma separação lógica estrita entre módulos enquanto mantém o deploy simplificado e os custos operacionais controlados. Caso a demanda cresça, cada módulo está 100% pronto para ser extraído em um microsserviço independente, pois compartilha interfaces bem definidas e comunicações via eventos/contratos.

### Camadas de Design por Módulo

Cada módulo corporativo é segregado em camadas de responsabilidade única:
1. **Domain (Entities / Value Objects):** Regras de negócio essenciais e núcleo do domínio, independentes de infraestrutura ou frameworks.
2. **Application (Services / Use Cases / DTOs):** Orquestração dos casos de uso, validação de inputs (Zod schemas), tratamento de fluxos de dados e políticas de domínio.
3. **Infrastructure (Controllers / Repositories / Routes / Middlewares):** Adaptação para o Express, conectores de banco de dados (PostgreSQL/PG pool), e integrações de rede.

---

## 2. Padrão Multi-Tenant

A plataforma Barber 360 adota a abordagem **Database-Shared, Schema-Shared (Bancos e Esquemas Compartilhados)** com isolamento lógico via coluna `tenant_id`.

* **Filtro Ativo:** Toda e qualquer consulta SQL ao banco de dados referente a dados do negócio *deve* incluir uma cláusula `WHERE tenant_id = $1`.
* **Tenant Middleware:** Responsável por extrair o ID do tenant a partir dos metadados das requisições (JWT decodificado ou subdomínio/cabeçalho) e injetar essa variável no escopo de execução do ciclo de vida da requisição.
* **Segurança de Contorno:** É vedada qualquer junção (`JOIN`) ou consulta global que cruze dados entre diferentes ID de tenants, exceto em rotas executadas por administradores da plataforma no escopo da `Operations Platform`.

---

## 3. Autenticação, Autorização e Sessões

### Fluxo de Autenticação Enterprise
* **Mecanismo Principal:** JWT (JSON Web Tokens) de vida curta (~15 minutos) assinado com algoritmo simétrico robusto (HS256).
* **Refresh Tokens:** Armazenados de forma segura sob a flag HTTP-Only, Secure e SameSite, com validade estendida (~7 dias).
* **Rotação e Detecção de Reuso:** Sempre que um Refresh Token é consumido para gerar um novo Access Token, o token antigo é invalidado e substituído por um novo na cadeia. Se um token antigo for reutilizado (tentativa de invasão por roubo de cookie), o backend invalida imediatamente toda a cadeia de tokens daquela sessão do usuário.
* **Revogação Remota:** Armazenamento em cache de tokens bloqueados (Blacklist) para permitir logout global e cancelamento de sessões individuais nos dispositivos ativos.

### Fluxo de Autorização (RBAC)
* **Padrão de Perfis (Roles):**
  * `Super Admin`: Acesso absoluto e global à infraestrutura e dados do SaaS.
  * `Operations Manager`: Gerenciamento do produto, planos, faturamento e base de clientes.
  * `Support`: Visualização limitada para chamados de suporte técnico de tenants.
  * `Financial`: Acesso a metas globais de faturamento, split de pagamentos e taxas do SaaS.
  * `Barbershop Owner`: Controle total sobre o tenant específico da barbearia.
  * `Barber`: Acesso exclusivo aos seus agendamentos, comissões de serviço e perfil de trabalho.
* **Filtros Granulares (Permissions):** Vinculados às rotas por meio do middleware `authorizePermissions([...])`.

---

## 4. Comunicação Interna e Filas

Para evitar gargalos de I/O em tarefas demoradas (como geração de relatórios de fechamento, disparos de mensagens automáticas de lembrete pelo WhatsApp ou rotinas de IA), implementamos um barramento assíncrono interno baseado em **Filas de Prioridade (In-Memory queues & Event Emitters)** desacoplados, prontos para plugar Redis/BullMQ se necessário.

1. **WhatsApp Queue:** Agenda mensagens do chatbot e lembretes de agendamentos prioritários.
2. **Campaign Queue:** Efetua o envio em lote de promoções para a base de clientes do tenant sem onerar a API.
3. **AI Queue:** Envia dados das conversas para processamento conceitual dos assistentes inteligentes de forma assíncrona.

---

## 5. Auditoria de Dados (Audit Trail)

Toda alteração de estado no banco de dados (Criação, Edição, Remoção) e ações críticas (Logins fracassados/bem sucedidos, alteração de faixas de faturamento, reset de senhas) gravam obrigatoriamente um registro na tabela `audit_logs`.
* O Log é imutável: Sem suporte a operações de `UPDATE` ou `DELETE` nesta tabela.
* Inclui estado anterior (`old_value`) e posterior (`new_value`) em formato JSON, mapeando precisamente quem realizou a modificação, quando e a partir de qual endereço de IP.

---

## 6. Cache e Otimização

* Mecanismo de Cache em memória para dados estáticos de alta concorrência:
  * Configurações globais da barbearia.
  * Cardápio de serviços básico do estabelecimento.
  * Estado de assinaturas ativas para bypass de checagem pesada do banco em middlewares.
* Validade de Cache com política robusta de **Mecanismo TTL (Time-To-Live)** e invalidação proativa no momento de qualquer atualização dos dados.
