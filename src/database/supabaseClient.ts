/**
 * FuelOps Pro — Inicialização do Cliente Supabase
 *
 * INSTRUÇÕES:
 *   1. Crie um arquivo .env na raiz do projeto com:
 *        VITE_SUPABASE_URL=https://seu-projeto.supabase.co
 *        VITE_SUPABASE_ANON_KEY=sua-chave-anon-aqui
 *
 *   2. Obtenha as credenciais em:
 *        Supabase Dashboard → Settings → API → Project URL / anon public
 *
 *   3. NUNCA commite o arquivo .env no repositório.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('As variáveis de ambiente do Supabase estão ausentes. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ---------------------------------------------------------------------------
// Types TypeScript para todas as tabelas do banco de dados
// Estes types são usados em toda a aplicação para tipagem segura.
// ---------------------------------------------------------------------------

/** Usuário do sistema */
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: 'frentista' | 'caixa' | 'gerente' | 'administrador';
  created_at: string;
}

/** Parâmetros cadastrais da empresa */
export interface ParametrosSistema {
  id: string;
  nome_empresa: string;
  cnpj: string;
  endereco: string | null;
  telefone: string | null;
  email_corporativo: string | null;
  created_at: string;
}

/** Arquivo armazenado no Supabase Storage */
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

// --- Regulamentação ---

export interface RegulamentacaoDocumento {
  id: string;
  nome_documento: string;
  categoria: string | null;
  orgao_fiscalizador: 'IPEM' | 'ANP' | 'Bombeiros' | 'Prefeitura' | 'PRF' |
    'PMR' | 'SEMA' | 'IBAMA' | 'CREA' | 'VISA' | 'MT' | 'Concessionaria' | 'Outro';
  data_emissao: string | null;
  data_vencimento: string | null;
  versao: number;
  observacoes: string | null;
  arquivo_id: string | null;
  created_at: string;
}

export interface RegulamentacaoHistorico {
  id: string;
  documento_id: string;
  acao: string;
  justificativa: string | null;
  usuario_id: string | null;
  created_at: string;
}

// --- Manutenção ---

export interface ManutencaoBomba {
  id: string;
  identificacao: string;
  qtd_bicos: number;
  combustivel: string | null;
  status: 'operando' | 'manutencao' | 'interditada';
  created_at: string;
}

export interface ManutencaoBico {
  id: string;
  bomba_id: string;
  identificacao: string;
  produto: string | null;
  status: 'operando' | 'manutencao' | 'substituido';
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

export interface ManutencaoPreventiva {
  id: string;
  equipamento: string;
  tipo: string;
  data_prevista: string;
  responsavel: string | null;
  status: 'programada' | 'em_andamento' | 'concluida' | 'atrasada';
  created_at: string;
}

export interface ControleGerador {
  id: string;
  data: string;
  horimetro_inicial: number | null;
  horimetro_final: number | null;
  horas_trabalhadas: number | null;
  litros_abastecidos: number | null;
  consumo_medio: number | null;
  responsavel: string | null;
  created_at: string;
}

export interface GastosLimpeza {
  id: string;
  data: string;
  produto: string;
  quantidade: number | null;
  valor_total: number | null;
  observacao: string | null;
  created_at: string;
}

export interface TetoOrcamentario {
  id: string;
  ano_mes: string;
  valor_teto: number;
  created_at: string;
}

// --- Comercial ---

export interface ComercialKPIs {
  id: string;
  ano_mes: string;
  leads_captados: number;
  propostas_enviadas: number;
  novos_clientes: number;
  atividades_onboarding: number;
  taxa_retencao: number;
  comissao_prevista: number;
  comissao_realizada: number;
  created_at: string;
}

export interface ComercialEstrategia {
  id: string;
  ano_mes: string;
  nome_estrategia: string;
  objetivo: string | null;
  descricao: string | null;
  data_inicio: string | null;
  data_termino: string | null;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  resultado_esperado: string | null;
  resultado_obtido: string | null;
  created_at: string;
}

// --- Atendimento ---

export interface AtendimentoSatisfacao {
  id: string;
  ano_mes: string;
  nps_google: number;
  nota_google: number;
  qtd_avaliacoes_google: number;
  indice_totem: number;
  indice_presencial: number;
  created_at: string;
}

export interface AtendimentoReclamacao {
  id: string;
  data: string;
  cliente: string;
  canal_origem: string | null;
  tipo_reclamacao: string | null;
  descricao: string | null;
  responsavel: string | null;
  status: 'aberta' | 'em_analise' | 'em_andamento' | 'resolvida' | 'encerrada';
  created_at: string;
}

export interface AtendimentoElogio {
  id: string;
  data: string;
  cliente: string;
  funcionario_citado: string | null;
  descricao: string | null;
  created_at: string;
}

export interface AtendimentoPlanoAcao {
  id: string;
  nome_plano: string;
  problema_identificado: string | null;
  objetivo: string | null;
  responsavel: string | null;
  data_inicio: string | null;
  data_conclusao: string | null;
  status: 'planejado' | 'em_andamento' | 'concluido' | 'cancelado';
  resultado_esperado: string | null;
  resultado_obtido: string | null;
  created_at: string;
}
