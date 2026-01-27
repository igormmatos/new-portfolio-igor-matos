import { supabase } from '../supabaseClient';

export const authService = {
  // Login com Email e Senha
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Logout
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Recuperar Sessão Atual
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Método auxiliar para obter o usuário atual
  getUser: async () => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }
};