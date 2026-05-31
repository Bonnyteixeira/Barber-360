# Architecture Decision Records (ADR) - Barber 360

Este documento reúne os registros de decisões arquiteturais chaves adotados no desenvolvimento do backend da Barber 360.

---

## ADR 001: Seleção do Banco de Dados Relacional (PostgreSQL)

### Contexto
O Barber 360 é um sistema SaaS Multi-Tenant com faturamento corporativo, agendamentos com consistência rígida, e forte necessidade de auditoria e geração de relatórios. Dados financeiros e agendamentos exigem conformidade ACID (Atomicidade, Consistência, Isolamento e Durabilidade).

### Decisão
Decidimos utilizar o **PostgreSQL** como o mecanismo de armazenamento principal de dados da aplicação. Bancos de dados NoSQL (como MongoDB) ou SQLite em memória não serão permitidos como bancos persistentes de produção.

### Consequências
* **Positivas:** Suporte nativo e otimizado a JSONB (permitindo salvar logs estruturados e metadados de IA flexíveis), suporte maduro a transações concorrentes rígidas, facilidade de indexação e restrições de integridade chaves (Foreign Keys, Unique, Check Constraints).
* **Negativas:** Exige maior rigidez no gerenciamento de esquemas (Migrations) em produção se comparado a bancos NoSQL Schema-less.

---

## ADR 002: Isolamento Lógico de Inquilino (SaaS Multi-Tenant)

### Contexto
Sendo uma plataforma B2B modular, as barbearias (tenants) dividem a mesma infraestrutura de banco de dados por motivos de custo, mas exigem isolamento estrito de dados devido à confidencialidade das listas de clientes e registros de faturamento.

### Decisão
Foi escolhida a abordagem **Shared Database, Shared Schema** com isolamento no nível de linhas (coluna `tenant_id`). Todas as tabelas sensíveis ao negócio devem herdar ou incluir a coluna `tenant_id` e possuir índices adequados para otimização de buscas compostas.

### Consequências
* **Positivas:** Menor custo operacional se comparado à criação de um banco por tenant, facilidade em atualizar estruturas de tabelas de uma vez para toda a base de clientes, processos de migração e deploy ágeis.
* **Negativas:** Requer extrema disciplina no código do repositório/service para garantir que o filtro de `tenant_id` nunca seja esquecido em selects, updates e deletes. Mitigado usando middlewares globais de injeção de Tenant e repositórios padronizados.

---

## ADR 003: Fluxo de Exclusão Lógica (Soft Delete)

### Contexto
Erros operacionais de usuários finais apagando agendamentos, clientes ou barbeiros podem arruinar análises estatísticas e comprometer históricos de faturamentos de comissão.

### Decisão
Fica estabelecido o uso de **Soft Delete** nas entidades principais de negócio utilizando a coluna TIMESTAMP `deleted_at`. Nenhuma linha será excluída fisicamente do banco de dados por requisições padrão de usuários comuns do SaaS.

### Consequências
* **Positivas:** Possibilidade imediata de restauração rápida de dados para reverter erros humanos incidentais, integridade garantida de relatórios históricos e dados estatísticos.
* **Negativas:** Consultas SQL comuns exigem filtragem adicional `deleted_at IS NULL`, aumentando o consumo de processamento; mitigado através de mapeamento em indexes parciais em tabelas de grande volume.

---

## ADR 004: Gerenciamento e Controle de Validação com Zod

### Contexto
A API REST corporativa recebe chamadas externas de clientes e serviços associados. Dados inconsistentes podem causar falhas silenciosas na camada de negócios ou abrir margem para injeções indesejadas de código malicioso.

### Decisão
Adoção do pacote **Zod** para validação robusta, desacoplada e tipagem estática integrada de todas as entradas da API na camada de controle (Request Payload, Query Strings, Route Parameters).

### Consequências
* **Positivas:** Falha rápida (Fail Fast) antes de encadear transações na aplicação, tratamento de erros automático, geração direta de tipos TypeScript a partir do esquema de validação, facilitando a manutenção e reduzindo bugs de tipagem insegura.
* **Negativas:** Adiciona uma pequena overhead de parsing no início do pipeline do Express.

---

## ADR 005: Padronização de Autenticação Segura (JWT + Rotação)

### Contexto
Usuários do SaaS operam o dia todo em várias abas, inclusive em dispositivos compartilhados dentro do salão. Sessões devem ser protegidas contra roubos de credenciais secundárias.

### Decisão
Uso de assinatura de autenticação híbrida: JWT assinado (`Access Token` de 15 minutos) e `Refresh Token` rotativo mantido em cookies com flag HTTP-Only. Caso o mesmo Refresh Token tente ser reutilizado ilegalmente, a cadeia de tokens daquela sessão é revogada instantaneamente.

### Consequências
* **Positivas:** Alta segurança contra-ataques de interceptação e XSS, flexibilidade para revogar sessões remotamente sem sobrecarregar o banco com persistência síncrona frequente de Access Tokens de curta duração.
* **Negativas:** Exige manipulação cuidadosa de CORS, cookies seguros e lógica de renovação silenciosa no frontend parceiro.
