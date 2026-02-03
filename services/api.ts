import { supabase } from '../supabaseClient';
import { ProfileInfo, JourneyItem, Project, Competency, TechnicalSkill } from '../types';
import { skills as staticSkills } from '../data';

type TranslatableTable =
  | 'profile_info'
  | 'projects'
  | 'journey_items'
  | 'competencies'
  | 'technical_skills';

const TRANSLATABLE_FIELDS: Record<TranslatableTable, { fields: string[]; arrayFields?: string[] }> = {
  profile_info: {
    fields: ['display_name', 'headline', 'bio', 'badge', 'action_phrase'],
  },
  projects: {
    fields: ['title', 'role', 'description', 'technologies'],
  },
  journey_items: {
    fields: ['title', 'company', 'period', 'description'],
  },
  competencies: {
    fields: ['title', 'subtitle', 'items'],
    arrayFields: ['items'],
  },
  technical_skills: {
    fields: ['name'],
  },
};

const buildLocalizedPayload = async (table: TranslatableTable, payload: any) => {
  const config = TRANSLATABLE_FIELDS[table];
  if (!config) return payload;

  const texts: Record<string, string | string[]> = {};
  config.fields.forEach((field) => {
    const value = payload[field];
    if (value === undefined || value === null) return;
    if (config.arrayFields?.includes(field)) {
      if (Array.isArray(value)) texts[field] = value;
      return;
    }
    if (typeof value === 'string') texts[field] = value;
  });

  if (Object.keys(texts).length === 0) return payload;

  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { texts },
    });
    if (error || !data?.translations) throw error || new Error('Translation failed');

    const en = data.translations.en || {};
    const fr = data.translations.fr || {};
    const result: any = { ...payload };

    Object.keys(texts).forEach((field) => {
      const ptValue = texts[field];
      result[`${field}_pt`] = ptValue;
      if (en[field] !== undefined && en[field] !== null) {
        result[`${field}_en`] = en[field];
      } else if (result[`${field}_en`] === undefined || result[`${field}_en`] === null) {
        result[`${field}_en`] = ptValue;
      }
      if (fr[field] !== undefined && fr[field] !== null) {
        result[`${field}_fr`] = fr[field];
      } else if (result[`${field}_fr`] === undefined || result[`${field}_fr`] === null) {
        result[`${field}_fr`] = ptValue;
      }
      result[field] = ptValue;
    });

    return result;
  } catch (err) {
    if (import.meta?.env?.MODE !== 'production') {
      console.warn(`[i18n] Translation failed for ${table}; falling back to pt-BR.`, err);
    }
    const result: any = { ...payload };
    Object.keys(texts).forEach((field) => {
      const ptValue = texts[field];
      result[`${field}_pt`] = ptValue;
      if (result[`${field}_en`] === undefined || result[`${field}_en`] === null) {
        result[`${field}_en`] = ptValue;
      }
      if (result[`${field}_fr`] === undefined || result[`${field}_fr`] === null) {
        result[`${field}_fr`] = ptValue;
      }
      result[field] = ptValue;
    });
    return result;
  }
};

export const api = {
  // --- Generic Reorder ---
  // Atualiza a ordem dos itens.
  // NOTA: É necessário passar o objeto completo para o upsert para satisfazer constraints NOT NULL
  reorderItems: async (table: string, items: any[]) => {
    if (items.length === 0) return;
    
    // Upsert permite atualizar registros existentes se o ID bater
    const { error } = await supabase
      .from(table)
      .upsert(items, { onConflict: 'id' }); 
      
    if (error) throw error;
  },

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
    const localized = await buildLocalizedPayload('profile_info', updates);
    const { data, error } = await supabase.from('profile_info').update(localized).eq('id', id).select();
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
    const localized = await buildLocalizedPayload('journey_items', item);
    const { data, error } = await supabase.from('journey_items').insert([localized]).select();
    if (error) throw error;
    return data;
  },

  updateJourney: async (id: string, updates: Partial<JourneyItem>) => {
    const localized = await buildLocalizedPayload('journey_items', updates);
    const { data, error } = await supabase.from('journey_items').update(localized).eq('id', id).select();
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
    const localized = await buildLocalizedPayload('projects', project);
    const { data, error } = await supabase.from('projects').insert([localized]).select();
    if (error) throw error;
    return data;
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    const localized = await buildLocalizedPayload('projects', updates);
    const { data, error } = await supabase.from('projects').update(localized).eq('id', id).select();
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
    const localized = await buildLocalizedPayload('competencies', item);
    const { data, error } = await supabase.from('competencies').insert([localized]).select();
    if (error) throw error;
    return data;
  },

  updateCompetency: async (id: string, updates: Partial<Competency>) => {
    const localized = await buildLocalizedPayload('competencies', updates);
    const { data, error } = await supabase.from('competencies').update(localized).eq('id', id).select();
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

    // Fallback para consumo público (erro ou tabela vazia)
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

    return data || [];
  },

  getTechnicalSkillsWithMeta: async (): Promise<{ data: TechnicalSkill[]; fromFallback: boolean }> => {
    const { data, error } = await supabase
      .from('technical_skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching technical skills (using fallback):', error);
      return {
        data: staticSkills.map(s => ({
          id: s.id.toString(),
          name: s.name,
          icon: s.icon,
          level: s.level,
          display_order: s.id
        })),
        fromFallback: true
      };
    }

    return { data: data || [], fromFallback: false };
  },

  createTechnicalSkill: async (item: Omit<TechnicalSkill, 'id'>) => {
    const localized = await buildLocalizedPayload('technical_skills', item);
    const { data, error } = await supabase.from('technical_skills').insert([localized]).select();
    if (error) throw error;
    return data;
  },

  updateTechnicalSkill: async (id: string, updates: Partial<TechnicalSkill>) => {
    const localized = await buildLocalizedPayload('technical_skills', updates);
    const { data, error } = await supabase.from('technical_skills').update(localized).eq('id', id).select();
    if (error) throw error;
    return data;
  },

  deleteTechnicalSkill: async (id: string) => {
    const { error } = await supabase.from('technical_skills').delete().eq('id', id);
    if (error) throw error;
  }
};
