import { createClient } from '@supabase/supabase-js';

// Valores de fallback para desenvolvimento local ou caso as env vars falhem
const FALLBACK_URL = "https://iquantqgsrgwbqfwbhfq.supabase.co";
const FALLBACK_KEY = "sb_publishable_5LjSKfbZIrnPTm-7do--Eg_2rZIvmBP";

// ⚡ IMPORTANTE: O Vite substitui estaticamente 'import.meta.env.VITE_...' durante o build.
// Usamos optional chaining (?.) para evitar crash (TypeError) caso import.meta.env seja undefined
// em ambientes onde o replace não ocorreu corretamente.
const supabaseUrl = import.meta.env?.VITE_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = import.meta.env?.VITE_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

// Log discreto apenas em desenvolvimento ou se estiver usando fallback
if (supabaseUrl === FALLBACK_URL) {
  console.debug('ℹ️ Supabase: Usando configuração de fallback/pública.');
}

// Cria uma instância única do cliente para ser usada em toda a aplicação
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey
);