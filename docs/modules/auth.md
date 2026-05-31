# Módulo: Auth

## Visão Geral

O módulo **Auth** é a espinha dorsal de segurança do Barber 360, estabelecendo as bases de identificação, autenticidade e controle de acesso a todo o ecossistema SaaS. Ele é encarregado de atestar a identidade de cada agente (seja ele um operador da plataforma, dono de barbearia, funcionário ou cliente final) e ancorar as transações de forma isolada através do paradigma multi-tenant lógico. Todas as requisições de barramento privado dependem umbilicalmente das chaves de autorização geradas por este microssistema.

Este módulo implementa uma estratégia de autenticação baseada em tokens JSON Web Tokens (JWT) puros no modelo sem estado (stateless), blindando as requisições subsequentes por meio de middlewares que interceptam e validam assinaturas criptográficas em nível de entrada. Ao assegurar o canal, o módulo injeta o escopo de Tenant identificado (`tenantId`) e o perfil de controle de acesso atribuído àquele portador em todas as camadas internas do ciclo de vida da requisição (Request).

Ficam estritamente **fora do escopo** deste módulo a coordenação financeira de contratos e faturamentos (que pertencem ao escopo exclusivo do módulo de `billing`), a verificação de limitações físicas e cotas dinâmicas de processamento de Inteligência Artificial (que residem sob a alçada dos `shared/guards`), a gestão das chaves lógicas de conexões e sessões ativas do WhatsApp (geridas no domínio de `communication`), assim como quaisquer atividades ligadas à marcação direta de calendários ou agendamento (pertencentes aos domínios de `scheduling` e `appointments`).

---

## Regras de Domínio

O funcionamento do domínio de autenticação e identificação é regido por uma suite de premissas duras e regulamentações imutáveis. Qualquer desvio técnico destas premissas invalida a conformidade da arquitetura de segurança da plataforma:

1. **Criptografia Indevassável de Senhas**: Sob nenhuma circunstância ou de forma temporária uma senha de usuário poderá ser gravada ou trafegada no banco de dados em formato de texto plano (cleartext). Toda senha precisa passar por um algoritmo hashing de via única implementado através do `bcryptjs`, configurado com fator de trabalho (work factor/rounds) mínimo igual a `12`.
2. **Multi-Tenancy Mandatório e Inviolável**: À exceção das contas sob o perfil de Operador Global (`saas_operator`), todo usuário criado na base deve estar incondicionalmente vinculado a apenas um único e exclusivo Tenant. É expressamente vedado o cruzamento lógico de dados de usuários entre Tenants distintos, devendo a coluna `tenant_id` atuar como barreira principal nas queries direcionadas à tabela `users`.
3. **Resolução de Escopo Multitenant**: Para requisições autenticadas de uso do Tenant, o valor de `tenantId` obtido através do payload decodificado do JWT possui soberania absoluta sobre o cabeçalho provido `x-tenant-id`. Uma disparidade comprovada no ciclo de requisição ativa acarreta em punição instantória com lançamento de erro HTTP 403 (Forbidden - Incompatibilidade de Tenant).
4. **Hierarquia e Isolamento de Perfis (RBAC - Role Based Access Control)**:
   - `saas_operator`: Proprietário operacional supremo do SaaS. Possui acesso transversal a múltiplos tenants, gerenciamento global de planos históricos e não recebe imposição de filtros de isolamento locais do Postgres.
   - `tenant_owner`: Proprietário administrativo de uma barbearia contratante. Acesso completo e irrestrito sobre as faturas, faturamentos, equipe de barbeiros, agenda e configurações de IA de seu próprio locatário.
   - `tenant_staff`: Barbeiro ou assistente técnico contratado. Acesso operacional limitado para manipulação e visualização de sua respectiva agenda, visualização parcial do CRM e sem capacidade de alteração de dados do plano SaaS ou exclusão de logs de segurança.
   - `client`: Perfil do cliente final da barbearia. Capaz unicamente de gerir sua própria conta de consumidor, listar barbeiros e programar os horários de seus próprios agendamentos pessoais.
5. **Política Estrita de Expiração e Assinaturas**: Todos os tokens Jwt gerados pela plataforma devem possuir validade máxima limitada (default: `24 horas`). Toda assinatura criptográfica deve ser gerada utilizando a chave master parametrizada (`JWT_SECRET`) validada no boot.
6. **Contingência e Bloqueio de Login Malsucedido (Brute Force Prevention)**: A ocorrência de 5 tentativas consecutivas de preenchimento incorreto de senha de login para um mesmo endereço de e-mail, num intervalo inferior a 10 minutos, sinaliza ataque severo de força bruta, resultando no bloqueio da respectiva conta pelo período de 30 minutos ou até uma liberação controlada via painel admin.
7. **Estado e Ativação Operacional**: Um usuário cuja propriedade `is_active` esteja definida como `false` impede instantaneamente qualquer tipo de login, invalida seus tokens gerados nas últimas requisições e retorna erro de credenciais restritas durante as validações.

---

## Modelo de Dados

As tabelas de gerenciamento abaixo representam o arcabouço estrutural do banco de dados PostgreSQL no nível físico, mantendo isolamento de escopo por `tenant_id` e sem uso de abstrações mapeadas (ORMs).

### Tabela: `tenants`
Armazena a entidade raiz de cada locatário corporativo (barbearia).

| Coluna | Tipo | Nulo | Padrão | Descrição |
|---|---|---|---|---|
| `id` | `UUID` | Não | `gen_random_uuid()` | Chave primária física da barbearia (UUIDv4) |
| `name` | `VARCHAR(150)` | Não | - | Nome fantasia oficial da barbearia cadastrada |
| `slug` | `VARCHAR(100)` | Não | - | Identificador único textual de subdomínio em URL (Ex: `classic-barber`) |
| `plan` | `VARCHAR(50)` | Não | `'starter'` | Plano de serviço de faturamento atual (`starter`, `pro`, `enterprise`) |
| `status` | `VARCHAR(20)` | Não | `'active'` | Status operacional do negócio (`active`, `suspended`, `canceled`) |
| `created_at` | `TIMESTAMP` | Não | `CURRENT_TIMESTAMP` | Registro histórico de abertura e cadastro inicial |
| `updated_at` | `TIMESTAMP` | Não | `CURRENT_TIMESTAMP` | Marca temporal da mais recente alteração de dados cadastrais |

- **Índices**: 
  - `idx_tenants_slug` ON `tenants` (`slug`) — Pesquisa rápida de rota por subdomínio
- **Chaves Estrangeiras**: Nenhuma.

---

### Tabela: `users`
Armazena as credenciais de identificação e perfil de todos os participantes cadastrados.

| Coluna | Tipo | Nulo | Padrão | Descrição |
|---|---|---|---|---|
| `id` | `UUID` | Não | `gen_random_uuid()` | Chave primária de identificação do usuário (UUIDv4) |
| `tenant_id` | `UUID` | Sim | `NULL` | Chave referencial de vínculo a barbearia. É nulo se role for `saas_operator` |
| `email` | `VARCHAR(150)` | Não | - | E-mail corporativo único e indexado utilizado para credenciamento |
| `password_hash`| `VARCHAR(255)` | Não | - | Assinatura digest hash criptográfico unidirecional de senhas |
| `role` | `VARCHAR(50)` | Não | `'client'` | Papel estratégico de permissão (`saas_operator`, `tenant_owner`, `tenant_staff`, `client`) |
| `name` | `VARCHAR(150)` | Não | - | Nome de exibição legal ou apelido operacional |
| `avatar_url` | `VARCHAR(255)` | Sim | `NULL` | Caminho de arquivo do bucket R2 correspondente à foto do perfil |
| `is_active` | `BOOLEAN` | Não | `TRUE` | Status de ativação da conta. Flag bloqueadora em caso de desativação |
| `created_at` | `TIMESTAMP` | Não | `CURRENT_TIMESTAMP` | Data exata de registro de usuário |
| `updated_at` | `TIMESTAMP` | Não | `CURRENT_TIMESTAMP` | Registro temporal de redefinições cadastrais mais recentes |

- **Índices**:
  - `idx_users_email` ON `users` (`email`) UNIQUE — Blindagem dupla de unicidade no canal físico
  - `idx_users_tenant_id` ON `users` (`tenant_id`) — Otimização de barreira multitenant nas consultas Postgres
- **Chaves Estrangeiras**:
  - `fk_users_tenant_id`: `tenant_id` REFERENCES `tenants` (`id`) ON DELETE CASCADE
- **Tratamento de Exclusão (Cascading)**: Exclusões de registros em `tenants` acorrem em efeito cascata integral na tabela `users` sob o respectivo locatário.

---

## Referência de API

Todos os payloads e transações de API para o escopo de autenticação seguem a especificação estrita do cabeçalho de requisição JSON.

### POST `/auth/register`
**Autenticação**: Não requerida  
**Role**: Público  
**Descrição**: Cria uma nova conta administrativa e registra um novo Tenant (barbearia) associado em uma única operação isolada (Transaction).

**Corpo da Requisição (Input Model):**
```json
{
  "tenantName": "string — Nome de exibição fantasia da barbearia",
  "tenantSlug": "string — Endereço slug de URL desejado para o subdomínio",
  "ownerName": "string — Nome completo do administrador do Tenant",
  "email": "string — E-mail de cadastro exclusivo para acesso administrativo",
  "password": "string — Senha para login (comprimento de 8 a 128 caracteres)"
}
```

**Resposta 201 (Created):**
```json
{
  "accessToken": "string — JWT contendo ID do usuário, ID de tenant e role cadastrados",
  "user": {
    "id": "string — Chave identificadora gerada (UUIDv4) para o fundador",
    "name": "string — Nome de exibição administrativa cadastrado",
    "email": "string — E-mail associado de login único",
    "role": "string — Retorna incondicionalmente o perfil 'tenant_owner'",
    "createdAt": "string — Data ISO-8601 registrada no banco do servidor"
  },
  "tenant": {
    "id": "string — Chave identificadora gerada (UUIDv4) para o negócio",
    "slug": "string — Slug de subdomínio confirmado",
    "status": "string — Estado do cadastro (Padrão: 'active')"
  }
}
```

**Erros:**
| Código | HTTP | Mensagem | Causa |
|---|---|---|---|
| `AUTH_001` | 409 | E-mail já cadastrado | O e-mail solicitado já possui registro ativo na tabela users |
| `AUTH_010` | 409 | Slug de domínio indisponível | O slug já é usado por outra empresa cadastrada |
| `AUTH_011` | 400 | Payload de entrada malformado | Violação de tamanho ou caracteres no corpo JSON |

---

### POST `/auth/login`
**Autenticação**: Não requerida  
**Role**: Público  
**Descrição**: Valida as credenciais fornecidas (E-mail + Senha) e retorna o token de acesso.

**Corpo da Requisição:**
```json
{
  "email": "string — E-mail de identificação principal",
  "password": "string — Senha cadastrada associada"
}
```

**Resposta 200 (Success):**
```json
{
  "accessToken": "string — JWT assinado pronto para anexação no cabeçalho Authorization",
  "user": {
    "id": "string — Identificador único do usuário logado (UUIDv4)",
    "name": "string — Nome cadastrado",
    "email": "string — E-mail pessoal autenticado",
    "role": "string — Perfil do usuário logado (ex: 'tenant_staff')",
    "tenantId": "string — UUIDv4 da barbearia proprietária (pode ser null se saas_operator)"
  }
}
```

**Erros:**
| Código | HTTP | Mensagem | Causa |
|---|---|---|---|
| `AUTH_002` | 401 | Credenciais inválidas | Senha digitada incorreta ou e-mail inexistente na base |
| `AUTH_008` | 403 | Conta inativa | Usuário ativo mas bloqueado temporariamente por `is_active` false |

---

### POST `/auth/logout`
**Autenticação**: Requerida  
**Role**: `saas_operator`, `tenant_owner`, `tenant_staff`, `client`  
**Descrição**: Invalida e revoga na camada de persistência o token atual.

**Corpo da Requisição**: Vazio.

**Resposta 204 (No Content)**: Sucesso sem retorno de corpo.

**Erros:**
| Código | HTTP | Mensagem | Causa |
|---|---|---|---|
| `AUTH_004` | 401 | Token inválido | Falha de autenticação do cabeçalho correspondente |

---

### GET `/auth/me`
**Autenticação**: Requerida  
**Role**: `saas_operator`, `tenant_owner`, `tenant_staff`, `client`  
**Descrição**: Retorna os detalhes de cadastro do usuário ativo contido na sessão do token JWT.

**Corpo da Requisição**: Vazio.

**Resposta 200 (Success):**
```json
{
  "id": "string — UUID contido no token",
  "name": "string — Nome de exibição ativo",
  "email": "string — E-mail associado",
  "role": "string — Perfil funcional com nível de acesso",
  "avatarUrl": "string — URL de imagem hospedada no bucket (pode ser null)",
  "tenantId": "string — UUID do tenant de amarração física",
  "isActive": "boolean — Confirmação se a conta segue desbloqueada"
}
```

**Erros:**
| Código | HTTP | Mensagem | Causa |
|---|---|---|---|
| `AUTH_006` | 404 | Usuário não encontrado | UUID no token válido não possui correspondência real ativa no banco |

---

### POST `/auth/refresh`
**Autenticação**: Não requerida (Segurança via Token de Refresh efêmero)  
**Role**: Público (Comando de atualização interna de tokens na sessão)  
**Descrição**: Rota futura planejada para rotação e recálculo temporizado de tokens expirados.

**Corpo da Requisição:**
```json
{
  "refreshToken": "string — Token opaco de refresh previamente guardado"
}
```

**Resposta 200 (Success):**
```json
{
  "accessToken": "string — Novo JWT operante renovado por 24 horas",
  "refreshToken": "string — Novo token de rotação associado de persistência redundante"
}
```

**Erros:**
| Código | HTTP | Mensagem | Causa |
|---|---|---|---|
| `AUTH_009` | 401 | Refresh Token expirado ou nulo | Token apresentado falso ou já utilizado anteriormente |

---

### PATCH `/auth/password`
**Autenticação**: Requerida  
**Role**: `saas_operator`, `tenant_owner`, `tenant_staff`, `client`  
**Descrição**: Altera de forma segura a senha cadastrada com validações adicionais.

**Corpo da Requisição:**
```json
{
  "currentPassword": "string — Senha atual cadastrada para fins de reautenticação",
  "newPassword": "string — Nova chave com comprimento ou complexidade validados"
}
```

**Resposta 204 (No Content)**: Redefinição concluída sem dados de corpo extras.

**Erros:**
| Código | HTTP | Mensagem | Causa |
|---|---|---|---|
| `AUTH_002` | 401 | Credenciais inválidas | Campo de senha atual fornecido incorreto |
| `AUTH_011` | 400 | Payload de entrada malformado | Nova senha é idêntica à anterior ou fraca |

---

## Contrato de Serviço

As interfaces formais TypeScript delineiam de forma imutável a lógica de orquestração interna e contratos estruturados no nível de arquitetura de software para o `AuthService`.

```typescript
export interface JWTPayload {
  userId: string;
  tenantId: string | null;
  role: 'saas_operator' | 'tenant_owner' | 'tenant_staff' | 'client';
}

export interface RegisterDTO {
  tenantName: string;
  tenantSlug: string;
  ownerName: string;
  email: string;
  password_plain: string;
}

export interface LoginDTO {
  email: string;
  password_plain: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'saas_operator' | 'tenant_owner' | 'tenant_staff' | 'client';
    createdAt: Date;
    tenantId: string | null;
  };
  tenant?: {
    id: string;
    slug: string;
    status: string;
  };
}

export interface UserProfileResponse {
  id: string;
  name: string;
  email: string;
  role: 'saas_operator' | 'tenant_owner' | 'tenant_staff' | 'client';
  avatarUrl: string | null;
  tenantId: string | null;
  isActive: boolean;
  createdAt: Date;
}

export interface ChangePasswordDTO {
  userId: string;
  tenantId: string | null;
  currentPasswordPlain: string;
  newPasswordPlain: string;
}

export interface AuthService {
  /**
   * Registra uma nova empresa parceira e cria seu fundador proprietário
   * em uma transação segura com rollback no banco de dados.
   * @throws AppError se e-mail ou slug apresentarem duplicidade (AUTH_001 ou AUTH_010).
   */
  register(dto: RegisterDTO): Promise<AuthResponse>;

  /**
   * Autentica as credenciais, confirma o estado de ativação da conta
   * e assina um novo token JWT de 24 horas.
   * @throws AppError em caso de dados digitados errados ou conta inativa (AUTH_002 ou AUTH_008).
   */
  login(dto: LoginDTO): Promise<AuthResponse>;

  /**
   * Loga a saída e inutiliza o token ativo atual nas persistências lógicas.
   */
  logout(userId: string): Promise<void>;

  /**
   * Realiza o parsing de assinatura no JWT criptografado fornecido pelo cabeçalho.
   * @throws AppError se expirado ou assinatura suspeita (AUTH_003 ou AUTH_004).
   */
  validateToken(token: string): Promise<JWTPayload>;

  /**
   * Gera uma assinatura hash bcrypt unidirecional irreversível de 12 salt rounds.
   */
  hashPassword(plain: string): Promise<string>;

  /**
   * Compara uma string plana de entrada contra a assinatura persistida.
   */
  comparePassword(plain: string, hash: string): Promise<boolean>;

  /**
   * Obtém os metadados cadastrais do usuário autenticado ativo no banco.
   * @throws AppError se o usuário não for encontrado no banco de dados (AUTH_006).
   */
  getCurrentUser(userId: string, tenantId: string | null): Promise<UserProfileResponse>;

  /**
   * Redefine de forma controlada a senha operacional do usuário logado.
   * @throws AppError se a validação contra a senha antiga falhar (AUTH_002).
   */
  changePassword(dto: ChangePasswordDTO): Promise<void>;
}
```

---

## Eventos

Todos os disparos de microsserviços utilizam o mecanismo síncrono descentralizado do `eventBus` interno da aplicação.

### Emitidos
| Evento | Payload | Gatilho |
|---|---|---|
| `auth.user.registered` | ` { userId: string, tenantId: string, role: string } ` | Imediatamente após a conclusão bem-sucedida do commit de registro da transação de uma barbearia com seu criador administrativo |
| `auth.user.login` | ` { userId: string, tenantId: string \| null, ip: string, device: string } ` | No instante em que o login de um usuário obtém sucesso com retorno favorável do JWT assinado |
| `auth.password.changed` | ` { userId: string, changedAt: Date } ` | Imediatamente após alteração e commit de nova assinatura hash no banco de dados |

---

### Consumidos
| Evento | Módulo de Origem | Ação e Lógica Relacionada |
|---|---|---|
| `billing.subscription.cancelled`| `billing` | Altera dinamicamente o status de todas as contas associadas ao `tenant_id` cancelado para `is_active = false`, deslogando-os em runtime |
| `billing.subscription.restored` | `billing` | Reativa em lote as contas sob o `tenant_id` re-ativado voltando as propriedades `is_active = true` para reingresso imediato |

---

## Filas e Jobs

Na implementação `v1` da arquitetura, o módulo operará de modo semi-stateless sem controle de concorrências agendadas locais. Em integrações assíncronas planejadas pós-instalação do Redis e do módulo `BullMQ`, duas filas automatizadas serão estabelecidas:

1. **`auth-token-cleanup` (Fila de Manutenção Diária)**:
   - **Gatilho**: Executado via Cron em ambiente background todas as noites à meia Noite (00:00:00).
   - **Finalidade**: Varre o cache secundário do Redis para purgar chaves obsoletas expiradas de tokens marcados para bloqueio em logout (tokens no blacklist temporal), mantendo o consumo de memória otimizado.
2. **`auth-security-alert` (Fila Reativa de Resolução de Segurança)**:
   - **Gatilho**: Ativado imediatamente após a verificação de 5+ erros consecutivos de acesso de logins mapeados num mesmo provedor cadastrado.
   - **Finalidade**: Consome evento em background gerando templates de alertas visuais para avisar o proprietário do tenant da tentativa fraudulenta, disparando e-mails dinâmicos de alerta.

---

## Catálogo de Erros

Abaixo estão definidos todos os erros catalogados pelo sistema com códigos específicos no padrão `AUTH_NNN`.

| Código | Status HTTP | Mensagem | Escopo e Descrição |
|---|---|---|---|
| `AUTH_001` | 409 | E-mail já cadastrado | Tentativa de registro onde o e-mail de entrada possui correspondência indexada |
| `AUTH_002` | 401 | Credenciais inválidas | Tentativa incorreta de login em senha não condizente com hashes ou e-mail nulo |
| `AUTH_003` | 401 | Token expirado | Validação falhou porque o tempo delimitado contido na claim expirou |
| `AUTH_004` | 401 | Token inválido | Token malformado, assinatura falsificada ou chave secreta corrompida |
| `AUTH_005` | 403 | Permissão insuficiente | Ativação do RBAC constatou que o tipo de perfil não possui autorização funcional na rota |
| `AUTH_006` | 404 | Usuário não encontrado | Verificação falhou em buscar a chave física de ID em requisições de Me secundárias |
| `AUTH_007` | 403 | Tenant incompatível | O valor de `tenant_id` declarado no payload token diverge frontalmente do enviado |
| `AUTH_008` | 403 | Conta inativa | Usuário ativo mas restrito por desativação arbitrária funcional |
| `AUTH_009` | 401 | Refresh Token expirado ou nulo | Token de refresh fornecido na renovação encontra-se obsoleto, corrompido ou já usado |
| `AUTH_010` | 409 | Slug de domínio indisponível | Tentativa de iniciar um negócio com slug textual já ocupado por concorrente de plataforma |
| `AUTH_011` | 400 | Payload de entrada malformado | Dados de entrada corrompidos ou que falharam em validações zod primárias |

---

## Dependências

O módulo de autenticação e seguranças possui dependência direta e indireta com camadas utilitárias e estruturas específicas:

```
                            +--------------------------+
                            |         config/          |
                            | (JWT_SECRET, JWT_EXPIRES) |
                            +------------+-------------+
                                         |
                                         v
+--------------------------+    +--------+---------+    +--------------------------+
|   database/connection    |--->|   modules/auth   |<---|    shared/utils/crypto   |
| (PostgreSQL driver / pg) |    |  (Core Domain)   |    | (bcryptjs cryptographic) |
+--------------------------+    +--------+---------+    +--------------------------+
                                         |
                                         v
                            +------------+-------------+
                            |     shared/middlewares   |
                            |  (auth.middleware.ts)    |
                            +------------+-------------+
                                         |
                                         v
                            +------------+-------------+
                            |       OUTROS MÓDULOS     |
                            |  (Aplica controle RBAC)  |
                            +--------------------------+
```

### Este módulo consome:
- `database/connection`: Motor de conexão primário para executar queries rápidas sem ORMs no Postgres para as tabelas `users` e `tenants`.
- `shared/utils/crypto`: Utilitários encapsulados de criptografia para geração segura de salt e comparação de hash digest.
- `config/env`: Chaves secretas criptográficas (`JWT_SECRET`) de assinatura do token e métricas de tempo expiração (`JWT_EXPIRES_IN`).

### Este módulo é consumido por:
- **TODOS os módulos privados**: O middleware interceptor de autenticação (`auth.middleware.ts`) verifica e confere o status de validade e desempacota as claims do JWT em cada chamada recebida.
- `billing`: Verifica de forma complementar os níveis contratuais no token de sessões ativas do Tenant antes de autorizar rotas premium.
- `operations`: Analisa a correspondência e bloqueia o tráfego a menos que a role no JWT resolva estritamente como `saas_operator` autoritativo.

---

## Changelog

Registros cronológicos de versões e modificações técnicas oficiais efetuadas no módulo:

| Versão | Data | Autor | Alterações Técnicas Efetuadas |
|---|---|---|---|
| `1.0.0` | 2025-01-01 | Barber 360 Engineering Team | Escrita e documentação técnica unificada original de modelagem de dados, rotas de API e contratos de autenticação base |
| `1.1.0` | 2026-05-31 | Barber 360 AI Engineering | Adição do planejamento de filas de proteção por brute-force do Redis/BullMQ, especificação e contratos tipados TypeScript de redefinição profunda de senhas e expansão analítica do catálogo de erros |
