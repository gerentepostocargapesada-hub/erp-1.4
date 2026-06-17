/**
 * FuelOps Pro — Camada de Persistência via Supabase (EXCLUSIVA)
 *
 * Todos os dados são armazenados SOMENTE no Supabase PostgreSQL.
 * Arquivos são armazenados no Supabase Storage (bucket "documentos").
 * Não há fallback para localStorage.
 */

import { supabase } from "../database/supabaseClient";

// ════════════════════════════════════════════════════════════
// NOMES DOS MÓDULOS
// ════════════════════════════════════════════════════════════

export const MODULE_NAMES = {
  REGULAMENTACAO: "regulamentacao",
  MANUTENCAO: "manutencao",
  FINANCEIRO: "financeiro",
  ESTRATEGIA: "estrategia",
  ATENDIMENTO: "atendimento",
  CONFIGURACOES: "configuracoes",
  LUBRIFICACAO: "lubrificacao",
  PONTO: "ponto",
} as const;

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════

function makeKey(year: number, monthIdx: number): string {
  return `${year}-${String(monthIdx + 1).padStart(2, "0")}`;
}

// ════════════════════════════════════════════════════════════
// CARREGAR DADOS DE UM MÓDULO PARA UM PERÍODO ESPECÍFICO
// ════════════════════════════════════════════════════════════

export async function loadModuleData<T>(
  moduleName: string,
  periodKey: string
): Promise<T | null> {
  const { data, error } = await supabase
    .from("module_data")
    .select("data")
    .eq("module_name", moduleName)
    .eq("period_key", periodKey)
    .single();

  if (error || !data) return null;
  return data.data as T;
}

// ════════════════════════════════════════════════════════════
// CARREGAR TODOS OS PERÍODOS DE UM MÓDULO
// ════════════════════════════════════════════════════════════

export async function loadAllModuleData<T>(
  moduleName: string
): Promise<Record<string, T>> {
  const { data, error } = await supabase
    .from("module_data")
    .select("period_key, data")
    .eq("module_name", moduleName);

  if (error || !data) return {};

  const result: Record<string, T> = {};
  for (const row of data) {
    result[row.period_key] = row.data as T;
  }
  return result;
}

// ════════════════════════════════════════════════════════════
// SALVAR DADOS DE UM MÓDULO PARA UM PERÍODO ESPECÍFICO
// ════════════════════════════════════════════════════════════

export async function saveModuleData<T>(
  moduleName: string,
  periodKey: string,
  moduleData: T
): Promise<void> {
  const { error } = await supabase.from("module_data").upsert(
    {
      module_name: moduleName,
      period_key: periodKey,
      data: moduleData as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "module_name,period_key" }
  );

  if (error) {
    console.error(`[Supabase] saveModuleData error for "${moduleName}" [${periodKey}]:`, error);
    throw error;
  }
}

// ════════════════════════════════════════════════════════════
// SALVAR TODOS OS PERÍODOS DE UM MÓDULO (substituição completa)
// ════════════════════════════════════════════════════════════

export async function saveAllModuleData<T>(
  moduleName: string,
  allData: Record<string, T>
): Promise<void> {
  // Deletar todos os registros existentes deste módulo
  const { error: delError } = await supabase
    .from("module_data")
    .delete()
    .eq("module_name", moduleName);

  if (delError) {
    console.error(`[Supabase] saveAllModuleData delete error for "${moduleName}":`, delError);
    throw delError;
  }

  // Inserir todos os períodos
  const entries = Object.entries(allData);
  if (entries.length > 0) {
    const rows = entries.map(([period_key, data]) => ({
      module_name: moduleName,
      period_key,
      data: data as unknown as Record<string, unknown>,
    }));

    const { error: insError } = await supabase
      .from("module_data")
      .insert(rows);

    if (insError) {
      console.error(`[Supabase] saveAllModuleData insert error for "${moduleName}":`, insError);
      throw insError;
    }
  }
}

// ════════════════════════════════════════════════════════════
// CARREGAR DADOS SIMPLES (Configuracoes empresa, etc.)
// ════════════════════════════════════════════════════════════

export async function loadSimpleData<T>(
  moduleName: string,
  periodKey: string,
  defaultValue: T
): Promise<T> {
  const { data, error } = await supabase
    .from("module_data")
    .select("data")
    .eq("module_name", moduleName)
    .eq("period_key", periodKey)
    .single();

  if (error || !data) return defaultValue;
  return data.data as T;
}

// ════════════════════════════════════════════════════════════
// UPLOAD DE ARQUIVOS PARA SUPABASE STORAGE
// ════════════════════════════════════════════════════════════

const STORAGE_BUCKET = "documentos";

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });

  if (error) {
    console.error(`[Supabase Storage] Upload error for "${path}":`, error);
    throw error;
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return urlData?.publicUrl ?? null;
}

/**
 * Upload de arquivo de documento para o bucket padrão "documentos"
 * Retorna a URL pública do arquivo no Supabase Storage
 */
export async function uploadDocumento(
  file: File,
  orgaoId: string,
  docId: string
): Promise<string | null> {
  const timestamp = Date.now();
  const extension = file.name.split(".").pop() || "pdf";
  const path = `regulamentacao/${orgaoId}/${docId}/${timestamp}.${extension}`;

  return uploadFile(STORAGE_BUCKET, path, file);
}

export async function deleteFile(
  bucket: string,
  path: string
): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`[Supabase Storage] Delete error for "${path}":`, error);
    return false;
  }
  return true;
}

export async function getFileUrl(
  bucket: string,
  path: string
): Promise<string | null> {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl ?? null;
}

/**
 * Gera uma URL de download temporária (signed URL) para um arquivo privado
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data) return null;
  return data.signedUrl;
}

export { makeKey };
