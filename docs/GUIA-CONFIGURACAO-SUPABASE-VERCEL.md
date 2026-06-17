# Guia Completo: Configuração Supabase + GitHub + Vercel

## Visão Geral da Arquitetura

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────────┐
│   Vercel        │      │   Supabase       │      │   GitHub            │
│   (Frontend)    │◄────►│   (Backend)      │      │   (Código Fonte)    │
│                 │      │   • PostgreSQL   │      │                     │
│  React + Vite   │      │   • Storage      │      │  Deploy automático  │
│                 │      │   • Auth (futuro) │      │  via Vercel         │
└─────────────────┘      └──────────────────┘      └─────────────────────┘
```

---

## PASSO 1: Configurar o Supabase

### 1.1 — Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com) e faça login
2. Clique em **"New Project"**
3. Preencha:
   - **Name:** `fuelops-pro`
   - **Database Password:** (guarde em local seguro!)
   - **Region:** Escolha a mais próxima (ex: `South America (São Paulo)`)
4. Clique em **"Create new project"** e aguarde ~2 minutos

### 1.2 — Obter Credenciais

1. No painel do Supabase, vá em **Settings → API**
2. Copie:
   - **Project URL:** `https://qmafdxxwmusdmqoajide.supabase.co` (erp-posto 1.4)
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYWZkeHh3bXVzZG1xb2FqaWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDgwNTEsImV4cCI6MjA5NzI4NDA1MX0.hYEENRIPJzVpTqLa6K65sIqJ1rsmWciYe-rxnjmqckc`

### 1.3 — Criar Tabelas (Banco de Dados)

1. No painel do Supabase, vá em **SQL Editor**
2. Cole TODO o conteúdo do arquivo `src/database/supabase_migration.sql`
3. Clique em **"Run"** para executar
4. Verifique no **Table Editor** se a tabela `module_data` foi criada

### 1.4 — Criar Bucket de Storage (Armazenamento de Arquivos)

1. No painel do Supabase, vá em **Storage**
2. Clique em **"New Bucket"**
3. Configure:
   - **Name:** `documentos`
   - **Public bucket:** ✅ Ativado (para que os arquivos tenham URL pública)
4. Clique em **"Create bucket"**

### 1.5 — Configurar Políticas de Storage

1. Após criar o bucket, clique nele
2. Vá em **Policies** → **New Policy** → **For full customization**
3. Crie 4 políticas:

**Política 1 — INSERT (Upload):**
- Policy name: `allow_upload_documentos`
- Allowed operation: INSERT
- Target roles: (deixe vazio para todos)
- USING expression: `true`
- WITH CHECK expression: `true`

**Política 2 — SELECT (Download/Visualização):**
- Policy name: `allow_read_documentos`
- Allowed operation: SELECT
- Target roles: (deixe vazio para todos)
- USING expression: `true`

**Política 3 — UPDATE:**
- Policy name: `allow_update_documentos`
- Allowed operation: UPDATE
- USING expression: `true`

**Política 4 — DELETE:**
- Policy name: `allow_delete_documentos`
- Allowed operation: DELETE
- USING expression: `true`

> ⚠️ **NOTA:** Essas políticas são permissivas (qualquer um pode acessar). Quando implementarmos autenticação no futuro, vamos restringir para `auth.role() = 'authenticated'`.

---

## PASSO 2: Configurar o GitHub

### 2.1 — Criar Repositório

1. Acesse [https://github.com](https://github.com)
2. Clique em **"New repository"**
3. Configure:
   - **Repository name:** `fuelops-pro`
   - **Visibility:** Private (recomendado)
4. **NÃO** inicialize com README (já temos um)

### 2.2 — Criar arquivo `.gitignore`

Crie um arquivo `.gitignore` na raiz com:

```
node_modules/
dist/
.env
*.local
.DS_Store
```

### 2.3 — Subir o Código

No terminal, na pasta do projeto:

```bash
git init
git add .
git commit -m "feat: FuelOps Pro com persistência Supabase"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/fuelops-pro.git
git push -u origin main
```

> ⚠️ **IMPORTANTE:** O arquivo `.env` NÃO deve ser commitado no GitHub. As variáveis serão configuradas diretamente no Vercel.

---

## PASSO 3: Configurar o Vercel

### 3.1 — Importar Projeto

1. Acesse [https://vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"Add New" → "Project"**
3. Selecione o repositório `fuelops-pro`
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm run build` (ou `npm run build`)
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install` (ou `npm install`)

### 3.2 — Configurar Variáveis de Ambiente

Na tela de configuração do projeto (ou depois em Settings → Environment Variables):

| Variável | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://qmafdxxwmusdmqoajide.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYWZkeHh3bXVzZG1xb2FqaWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDgwNTEsImV4cCI6MjA5NzI4NDA1MX0.hYEENRIPJzVpTqLa6K65sIqJ1rsmWciYe-rxnjmqckc` |

> **IMPORTANTE:** As variáveis DEVEM começar com `VITE_` para serem acessíveis no frontend (requisito do Vite).

### 3.3 — Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (~1-2 minutos)
3. Acesse a URL gerada (ex: `https://fuelops-pro.vercel.app`)

### 3.4 — Deploy Automático

A partir de agora, **todo push no branch `main`** dispara um deploy automático no Vercel. O fluxo:

```
Editar código → Push no GitHub → Vercel detecta → Build automático → Deploy
```

---

## PASSO 4: Verificar Funcionamento

### Teste de Conexão

1. Acesse a aplicação na URL do Vercel
2. Vá na aba **Regulamentação**
3. Abra um órgão fiscalizador
4. Clique em **"+ Novo Documento"**
5. Preencha os dados e faça upload de um arquivo
6. Se tudo funcionar, o documento será salvo no Supabase

### Verificar no Supabase

1. No painel do Supabase, vá em **Table Editor → module_data**
2. Deve aparecer um registro com `module_name = "regulamentacao"`
3. Em **Storage → documentos**, o arquivo enviado deve estar visível

---

## PASSO 5 (Futuro): Autenticação com Supabase Auth

Quando estiver pronto para adicionar autenticação:

### 5.1 — Habilitar Providers

1. No Supabase, vá em **Authentication → Providers**
2. Habilite os providers desejados (Email, Google, GitHub, etc.)

### 5.2 — Configurar Site URL

1. Em **Authentication → URL Configuration**
2. **Site URL:** `https://fuelops-pro.vercel.app` (sua URL do Vercel)
3. **Redirect URLs:** adicione também `http://localhost:5173` para desenvolvimento

### 5.3 — Restringir Políticas RLS

Depois de implementar Auth, altere as políticas para:

```sql
-- Exemplo: Restringir module_data para usuários autenticados
DROP POLICY "anon_access_module_data" ON module_data;
CREATE POLICY "authenticated_access_module_data" ON module_data
    FOR ALL USING (auth.role() = 'authenticated');

-- Restringir Storage
DROP POLICY "allow_public_upload_documentos" ON storage.objects;
CREATE POLICY "authenticated_upload_documentos" ON storage.objects
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'documentos');
```

---

## Resumo das URLs e Credenciais

| Item | Valor |
|------|-------|
| **Supabase URL** | `https://qmafdxxwmusdmqoajide.supabase.co` |
| **Supabase Anon Key** | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Bucket Storage** | `documentos` |
| **Tabela Principal** | `module_data` |
| **Vercel URL** | (será gerada após deploy) |
| **GitHub Repo** | https://github.com/gerentepostocargapesada-hub/erp-1.4 |

---

## Troubleshooting

### "Erro ao enviar arquivo"
- Verifique se o bucket `documentos` foi criado no Supabase Storage
- Verifique se as políticas de INSERT foram criadas

### "Dados não carregam"
- Verifique se a tabela `module_data` existe (execute o SQL de migração)
- Verifique se as variáveis de ambiente estão corretas no Vercel

### "Build falha no Vercel"
- Confirme que `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas
- Verifique se o Framework Preset está como "Vite"

### "CORS Error"
- No Supabase, vá em **Settings → API → CORS Allowed Origins**
- Adicione sua URL do Vercel: `https://fuelops-pro.vercel.app`
