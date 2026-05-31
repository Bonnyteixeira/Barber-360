# Diagrama de Entidades e Relacionamentos (DER) - Barber 360

Este documento apresenta a modelagem detalhada de banco de dados relacional para o sistema da Barber 360 usando o dialeto do **PostgreSQL**.

---

## 1. Visão Geral das Relações (Esquema Conceitual)

```txt
[tenants] 
   ├──1:N──> [users] ────1:N──> [user_roles] <──N:1──── [roles] <──1:N── [permissions]
   ├──1:N──> [subscriptions] <──N:1──── [plans]
   ├──1:N──> [barbers]
   ├──1:N──> [clients]
   ├──1:N──> [services]
   ├──1:N──> [appointments] <──N:1── [barbers] / [clients] / [services]
   ├──1:N──> [conversations] ────1:N──> [messages]
   ├──1:N──> [campaigns]
   ├──1:N──> [financial_entries]
   ├──1:N──> [commissions]
   ├──1:N──> [support_tickets]
   ├──1:N──> [audit_logs]
   └──1:1──> [settings]
```

---

## 2. Tabelas do Núcleo Multi-Tenant e Administrativo

### 2.1. `tenants` (Inquilinos/Estabelecimentos)
Representa cada barbearia cadastrada no ecossistema do SaaS.

| Campo | Tipo | Restrições / Índices | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID único global do estabelecimento |
| `name` | VARCHAR(150) | NOT NULL | Nome comercial do salão |
| `slug` | VARCHAR(100) | NOT NULL, UNIQUE, INDEX | URL amigável do salão |
| `cnpj` | VARCHAR(14) | UNIQUE, NULLABLE | Documento oficial do tenant |
| `status` | VARCHAR(20) | NOT NULL, CHECK (status IN ('active', 'suspended', 'trial')) | Status do estabelecimento |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de criação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data da última alteração |
| `deleted_at` | TIMESTAMP | NULLABLE | Data de exclusão lógica |

---

### 2.2. `plans` (Planos do SaaS)
Representa as modalidades de planos comerciais oferecidas pela operação.

| Campo | Tipo | Restrições / Índices | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID interno do plano |
| `name` | VARCHAR(100) | NOT NULL | Nome do plano (ex: Lite, Pro, Enterprise) |
| `price_monthly` | NUMERIC(10,2) | NOT NULL, CHECK (price_monthly >= 0) | Preço mensal cobrado do tenant |
| `max_barbers` | INTEGER | NOT NULL, DEFAULT 5 | Limite máx. de barbeiros no estabelecimento |
| `features` | JSONB | NOT NULL, DEFAULT '{}' | Recursos liberados (ex: chatbot, suporte 24h) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de cadastro |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data da última alteração |

---

### 2.3. `subscriptions` (Assinaturas dos Tenants)
Controla o histórico financeiro de licenças de uso de cada tenant.

| Campo | Tipo | Restrições / Índices | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID único do registro de assinatura |
| `tenant_id` | UUID | FOREIGN KEY REFERENCES tenants(id), NOT NULL, INDEX | Associação com o estabelecimento |
| `plan_id` | UUID | FOREIGN KEY REFERENCES plans(id), NOT NULL | Plano assinado pelo cliente |
| `status` | VARCHAR(20) | CHECK (status IN ('active', 'past_due', 'canceled', 'unpaid')) | Situação do faturamento corrente |
| `current_period_start`| TIMESTAMP| NOT NULL | início do ciclo atual de cobrança |
| `current_period_end` | TIMESTAMP| NOT NULL, INDEX | Fim do ciclo atual contratado |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de contratação |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data da última alteração |

---

## 3. Controle de Usuários e Autorizações (RBAC)

### 3.1. `users` (Usuários do Sistema)
Contém as credenciais básicas para acesso a tanto Client Platform quanto Operations Platform.

| Campo | Tipo | Restrições / Índices | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID de login único do usuário |
| `tenant_id` | UUID | FOREIGN KEY REFERENCES tenants(id), NULLABLE (Global Admin), INDEX| ID do inquilino a que pertence |
| `name` | VARCHAR(150) | NOT NULL | Nome de exibição principal |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE, INDEX | Email de acesso único do usuário |
| `password_hash` | VARCHAR(255) | NOT NULL | Hash criptográfico bcrypt da senha |
| `phone` | VARCHAR(20) | NULLABLE | Contato telefônico direto do operador |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Define se a conta está ativa |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de registro inicial |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data da atualização de cadastro |
| `deleted_at` | TIMESTAMP | NULLABLE | Data da desativação (soft delete) |

---

### 3.2. `roles` (Perfis de Acesso)
Papéis padrões de fatiamento operacional.

| Campo | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(50) | PRIMARY KEY (ex: 'super_admin', 'barber_owner') | String identificadora do perfil |
| `name` | VARCHAR(100) | NOT NULL | Nome amigável do perfil |
| `description` | TEXT | NULLABLE | Explicação da abrangência do perfil |

---

### 3.3. `permissions` (Permissões Granulares)
Permissões individuais que validam rotas de microserviço.

| Campo | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | VARCHAR(100) | PRIMARY KEY (ex: 'appointments:create', 'financial:view') | Slug identificador de permissão |
| `name` | VARCHAR(100) | NOT NULL | Breve título amigável |
| `module` | VARCHAR(50) | NOT NULL | Identificador do módulo associado |

---

### 3.4. `user_roles` (Associação Usuário x Perfil)
Associação N:N de controle de acessos ativos.

| Campo | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `user_id` | UUID | FOREIGN KEY REFERENCES users(id), PRIMARY KEY(user_id, role_id) | ID do usuário relacionado |
| `role_id` | VARCHAR(50) | FOREIGN KEY REFERENCES roles(id), PRIMARY KEY(user_id, role_id) | ID do perfil relacionado |

---

## 4. Tabelas de Operações Comerciais do Tenant

### 4.1. `barbers` (Profissionais Barbeiros)
Lista de profissionais que executam os serviços da barbearia.

| Campo | Tipo | Restrições / Índices | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID interno do profissional |
| `tenant_id` | UUID | FOREIGN KEY REFERENCES tenants(id), NOT NULL, INDEX | Dono do profissional |
| `user_id` | UUID | FOREIGN KEY REFERENCES users(id), NULLABLE | Vinculo com usuário de login se houver |
| `name` | VARCHAR(150) | NOT NULL | Nome do profissional |
| `specialties` | TEXT[] | NULLABLE | Habilidades extras do profissional |
| `commission_rate` | NUMERIC(5,2) | CHECK (commission_rate BETWEEN 0 AND 100), DEFAULT 50.00| Ganhos percentuais fixos sobre cortes |
| `is_available` | BOOLEAN | NOT NULL, DEFAULT TRUE | Define se está ativo na escala diária |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de início de atividades |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data de última atualização |
| `deleted_at` | TIMESTAMP | NULLABLE | Data de remoção |

---

### 4.2. `clients` (Clientes Consumidores das Barbearias)
Cadastro de clientes fidelizados de cada estabelecimento.

| Campo | Tipo | Restrições / Índices | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID do cliente |
| `tenant_id` | UUID | FOREIGN KEY REFERENCES tenants(id), NOT NULL, INDEX | ID da barbearia proprietária |
| `name` | VARCHAR(150) | NOT NULL | Nome de usuário completo |
| `email` | VARCHAR(150) | NULLABLE | Email pessoal do cliente |
| `phone` | VARCHAR(20) | NOT NULL, INDEX | WhatsApp para alertas automatizados |
| `avatar_url` | TEXT | NULLABLE | Link de foto opcional do cliente |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data do cadastro rápido |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Última alteração das informações |
| `deleted_at` | TIMESTAMP | NULLABLE | Soft delete do cliente |

---

### 4.3. `services` (Catálogo de Serviços)
Opções de menu de cortes e barbas ofertadas individualmente.

| Campo | Tipo | Restrições / Índices | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID do serviço comercial |
| `tenant_id` | UUID | FOREIGN KEY REFERENCES tenants(id), NOT NULL, INDEX | Dono do serviço |
| `name` | VARCHAR(150) | NOT NULL | Título (Corte Degradê, Barboterapia) |
| `price` | NUMERIC(10,2) | NOT NULL, CHECK (price > 0) | Valor em R$ cobrado |
| `duration` | INTEGER | NOT NULL, CHECK (duration > 0), DEFAULT 30 | Minutos previstos para execução |
| `category` | VARCHAR(50) | DEFAULT 'cabelo' | Agrupamento geral para marketing |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Registro do serviço |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Última autoria de alteração |

---

### 4.4. `appointments` (Agenda de Atendimentos)
Registros de agendamentos no salão.

| Campo | Tipo | Restrições / Índices | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID único de agendamento registrado |
| `tenant_id` | UUID | FOREIGN KEY REFERENCES tenants(id), NOT NULL, INDEX | Inquilino detentor da agenda |
| `barber_id` | UUID | FOREIGN KEY REFERENCES barbers(id), NOT NULL, INDEX | Barbeiro encarregado |
| `client_id` | UUID | FOREIGN KEY REFERENCES clients(id), NOT NULL, INDEX | Cliente que reservou |
| `service_id` | UUID | FOREIGN KEY REFERENCES services(id), NOT NULL | Serviço escolhido |
| `start_time` | TIMESTAMP | NOT NULL, INDEX | Data e hora exatas de início da reserva |
| `end_time` | TIMESTAMP | NOT NULL | Data e hora exatas de fim calculado |
| `status` | VARCHAR(25) | NOT NULL, CHECK (status IN ('scheduled', 'confirmed', 'completed', 'canceled')) | Estado contemporâneo da reserva |
| `total_price` | NUMERIC(10,2) | NOT NULL, CHECK (total_price >= 0) | Valor final fechado |
| `notes` | TEXT | NULLABLE | Observações feitas na criação do corte |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Data em que agendou na plataforma |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Registro de sincronização operacional |

---

## 5. Auditoria e Logs

### 5.1. `audit_logs` (Histórico de Modificações)
Tabela de persistência imutável contendo todas as alterações de negócio da API.

| Campo | Tipo | Restrições / Índices | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identificador exclusivo do log |
| `tenant_id` | UUID | FOREIGN KEY REFERENCES tenants(id), NULLABLE, INDEX | ID do tenant onde ocorreu a alteração |
| `user_id` | UUID | FOREIGN KEY REFERENCES users(id), NULLABLE, INDEX | Operador responsável pelo fluxo |
| `action` | VARCHAR(100) | NOT NULL | Tipo da ação (LOGIN, CREATE_APPOINTMENT) |
| `entity` | VARCHAR(100) | NOT NULL | Tabela afetada (ex: 'appointments') |
| `entity_id` | VARCHAR(100) | NULLABLE | Chave UUID da linha afetada |
| `old_value` | JSONB | NULLABLE | Snapshot do bloco de dados prévio |
| `new_value` | JSONB | NULLABLE | Novo bloco atualizado da entidade |
| `ip_address` | VARCHAR(45) | NOT NULL | Endereço IP emissor do cliente |
| `user_agent` | TEXT | NULLABLE | Dispositivo / Navegador do cliente |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Carimbo exato de registro |

---

## 6. Configurações e IA

### 6.1. `settings` (Configurações Gerais do Tenant)
Metadados operacionais e comportamentais da barbearia.

| Campo | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | ID primário do registro |
| `tenant_id` | UUID | FOREIGN KEY REFERENCES tenants(id), NOT NULL, UNIQUE, INDEX | Vinculado exclusivamente a um tenant |
| `business_hours` | JSONB | NOT NULL, DEFAULT '{}' | Painel de abertura (Seg-Sex, Sáb, Dom) |
| `notification_rules` | JSONB | NOT NULL, DEFAULT '{}' | Horários para envio de alertas WhatsApp |
| `ai_personality` | TEXT | NULLABLE | Tom de fala (Moderno, Bruto, Clássico) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Inicialização da tabela para o tenant |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Última edição |

---

## 7. Estruturas Adicionais e Índices Compostos

Para consultas de alto desempenho aplicamos os seguintes índices compostos recomendados:

* `idx_appointments_barber_time`: Composição `(tenant_id, barber_id, start_time)` para verificar colisões de horário na agenda de um profissional.
* `idx_appointments_client_status`: Composição `(tenant_id, client_id, status)` para relatórios de comparecimento e absenteísmo por cliente.
* `idx_app_pricing`: Composição `(tenant_id, deleted_at)` em tabelas principais, facilitando filtragem de registros ativos sem varredura completa.
