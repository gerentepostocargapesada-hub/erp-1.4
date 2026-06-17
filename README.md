# FuelOps Pro

Sistema de gestão para postos de combustível.

## Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Storage)
- **Deploy:** Vercel (automático via GitHub)

## Setup rápido

### 1. Banco de dados (Supabase)

1. Acesse [supabase.com](https://supabase.com) → seu projeto
2. Vá em **SQL Editor**
3. Cole e execute o conteúdo de `src/database/supabase_migration.sql`
4. Vá em **Storage** → crie um bucket chamado `documentos` (Public: ✅)
5. Em **Storage → Policies**, crie políticas de INSERT/SELECT/UPDATE/DELETE com `USING (true)`

### 2. Deploy no Vercel

1. Importe este repositório no [vercel.com](https://vercel.com)
2. Framework: **Vite**
3. Build command: `pnpm run build`
4. Output directory: `dist`
5. As credenciais do Supabase já estão embutidas no código — **não é necessário configurar variáveis de ambiente**

### 3. Desenvolvimento local

```bash
pnpm install
pnpm dev
```

## Estrutura

```
src/
├── database/
│   ├── supabaseClient.ts       # Cliente Supabase com credenciais embutidas
│   └── supabase_migration.sql  # Script SQL para criar tabelas e bucket
├── services/
│   └── supabasePersistence.ts  # Funções de load/save/upload
├── pages/
│   ├── AtendimentoCliente.tsx
│   ├── Configuracoes.tsx
│   ├── ControleEstoque.tsx
│   ├── EstrategiaVendas.tsx
│   ├── Financeiro.tsx
│   ├── GestaoEquipe.tsx
│   ├── GestaoOperacoes.tsx     # iframe → public/gestao-operacoes.html
│   ├── Manutencao.tsx
│   ├── Regulamentacao.tsx
│   └── TrocaOleoLubrificacao.tsx
└── App.tsx
public/
└── gestao-operacoes.html       # Aba de operações (HTML standalone com Supabase)
```

## Persistência de dados

Todos os dados são salvos na tabela `module_data` do Supabase:

| Aba | module_name |
|-----|-------------|
| Atendimento ao Cliente | `atendimento` |
| Configurações | `configuracoes` |
| Controle de Estoque | `estoque` |
| Estratégia de Vendas | `estrategia` |
| Financeiro | `financeiro` |
| Gestão de Equipe | `equipe` |
| Gestão de Operações | `gestao-operacoes` |
| Manutenção | `manutencao` |
| Regulamentação | `regulamentacao` |
| Troca de Óleo / Lubrificação | `lubrificacao` |
