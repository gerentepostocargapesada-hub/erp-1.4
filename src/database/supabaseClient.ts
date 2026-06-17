/**
 * FuelOps Pro — Cliente Supabase
 *
 * Credenciais do projeto já embutidas como fallback.
 * Para sobrescrever, configure as variáveis no Vercel:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL_DEFAULT  = 'https://qmafdxxwmusdmqoajide.supabase.co';
const SUPABASE_KEY_DEFAULT  =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtYWZkeHh3bXVzZG1xb2FqaWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDgwNTEsImV4cCI6MjA5NzI4NDA1MX0.hYEENRIPJzVpTqLa6K65sIqJ1rsmWciYe-rxnjmqckc';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     || SUPABASE_URL_DEFAULT;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_KEY_DEFAULT;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------------------------
// Types TypeScript para todas as tabelas do banco de dados
// ---------------------------------------------------------------------------

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: 'frentista' | 'caixa' | 'gerente' | 'administrador';
  created_at: string;
}

export interface ParametrosSistema {
  id: string;
  nome_empresa: string;
  cnpj: string;
  endereco: string | null;
  telefone: string | null;
  email_corporativo: string | null;
  created_at: string;
}

export interface Arquivo {
  id: string;
  nome_arquivo: string;
  modulo_origem: string;
  registro_relacionado_id: string | null;
  tamanho_bytes: number | null;
  url_supabase_storage: string | null;
  usuario_id: string | null;
  is_orfao: boolean;
  created_at: string;
}

export interface RegulamentacaoDocumento {
  id: string;
  nome_documento: string;
  categoria: string | null;
  orgao_fiscalizador: string;
  data_emissao: string | null;
  data_vencimento: string | null;
  versao: number;
  observacoes: string | null;
  arquivo_id: string | null;
  created_at: string;
}

export interface ManutencaoBomba {
  id: string;
  identificacao: string;
  qtd_bicos: number;
  combustivel: string | null;
  status: 'operando' | 'manutencao' | 'interditada';
  created_at: string;
}

export interface ManutencaoRegistro {
  id: string;
  data_hora: string;
  equipamento_tipo: string;
  bomba_id: string | null;
  bico_id: string | null;
  tipo_manutencao: string;
  descricao: string | null;
  responsavel: string | null;
  valor_peca: number;
  valor_mao_obra: number;
  custo_total: number;
  observacoes: string | null;
  created_at: string;
}
