import { createClient } from '@supabase/supabase-js';

// Valores de fallback para garantir funcionamento mesmo se a injeção de env falhar
const FALLBACK_URL = "https://iquantqgsrgwbqfwbhfq.supabase.co";
const FALLBACK_KEY = "sb_publishable_5LjSKfbZIrnPTm-7do--Eg_2rZIvmBP";

// Função para obter variáveis de ambiente com segurança
const getEnvVar = (key: string): string | undefined => {
  try {
    // Tenta acessar import.meta.env (Vite)
    const metaEnv = (import.meta as any).env;
    if (metaEnv && metaEnv[key]) {
      return metaEnv[key];
    }
  } catch (e) {
    console.warn('Erro ao acessar import.meta.env', e);
  }
  return undefined;
};

const supabaseUrl = getEnvVar('VITE_PUBLIC_SUPABASE_URL') || FALLBACK_URL;
const supabaseAnonKey = getEnvVar('VITE_PUBLIC_SUPABASE_ANON_KEY') || FALLBACK_KEY;

if (supabaseUrl === FALLBACK_URL) {
  console.log('ℹ️ Usando credenciais de fallback do Supabase.');
}

// Cria uma instância única do cliente para ser usada em toda a aplicação
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey
);