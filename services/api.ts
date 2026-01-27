import { supabase } from '../supabaseClient';
import { ProfileInfo, JourneyItem, Project, Competency, TechnicalSkill } from '../types';
import { skills as staticSkills } from '../data';

export const api = {
  // --- Profile ---
  getProfile: async (): Promise<ProfileInfo | null> => {
    const { data, error } = await supabase
      .from('profile_info')
      .select('*')
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  updateProfile: async (id: string, updates: Partial<ProfileInfo>) => {
    const { data, error } = await supabase.from('profile_info').update(updates).eq('id', id).select();
    if (error) throw error;
    return data;
  },

  // --- Journey ---
  getJourney: async (): Promise<JourneyItem[]> => {
    const { data, error } = await supabase
      .from('journey_items')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching journey:', error);
      return [];
    }
    return data || [];
  },

  createJourney: async (item: Omit<JourneyItem, 'id'>) => {
    const { data, error } = await supabase.from('journey_items').insert([item]).select();
    if (error) throw error;
    return data;
  },

  updateJourney: async (id: string, updates: Partial<JourneyItem>) => {
    const { data, error } = await supabase.from('journey_items').update(updates).eq('id', id).select();
    if (error) throw error;
    return data;
  },

  deleteJourney: async (id: string) => {
    const { error } = await supabase.from('journey_items').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Projects ---
  getProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    return data || [];
  },

  createProject: async (project: Omit<Project, 'id'>) => {
    const { data, error } = await supabase.from('projects').insert([project]).select();
    if (error) throw error;
    return data;
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select();
    if (error) throw error;
    return data;
  },

  deleteProject: async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Competencies (Strategic Areas) ---
  getCompetencies: async (): Promise<Competency[]> => {
    const { data, error } = await supabase
      .from('competencies')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching competencies:', error);
      return [];
    }
    return data || [];
  },

  createCompetency: async (item: Omit<Competency, 'id'>) => {
    const { data, error } = await supabase.from('competencies').insert([item]).select();
    if (error) throw error;
    return data;
  },

  updateCompetency: async (id: string, updates: Partial<Competency>) => {
    const { data, error } = await supabase.from('competencies').update(updates).eq('id', id).select();
    if (error) throw error;
    return data;
  },

  deleteCompetency: async (id: string) => {
    const { error } = await supabase.from('competencies').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Technical Skills (New Section) ---
  getTechnicalSkills: async (): Promise<TechnicalSkill[]> => {
    const { data, error } = await supabase
      .from('technical_skills')
      .select('*')
      .order('display_order', { ascending: true });

    // Fallback se houver erro ou se não houver dados
    if (error || !data || data.length === 0) {
      if (error) console.error('Error fetching technical skills (using fallback):', error);
      
      // Mapeia os dados estáticos para o formato do banco
      return staticSkills.map(s => ({
        id: s.id.toString(), // Converte number para string
        name: s.name,
        icon: s.icon,
        level: s.level,
        display_order: s.id
      }));
    }

    return data;
  },

  createTechnicalSkill: async (item: Omit<TechnicalSkill, 'id'>) => {
    const { data, error } = await supabase.from('technical_skills').insert([item]).select();
    if (error) throw error;
    return data;
  },

  updateTechnicalSkill: async (id: string, updates: Partial<TechnicalSkill>) => {
    const { data, error } = await supabase.from('technical_skills').update(updates).eq('id', id).select();
    if (error) throw error;
    return data;
  },

  deleteTechnicalSkill: async (id: string) => {
    const { error } = await supabase.from('technical_skills').delete().eq('id', id);
    if (error) throw error;
  }
};
