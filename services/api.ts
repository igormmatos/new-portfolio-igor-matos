import { supabase } from '../supabaseClient';
import {
  ProfileInfo,
  JourneyItem,
  Project,
  ProjectWithSkills,
  Competency,
  TechnicalSkill,
  SkillWithProjects
} from '../types';
import { skills as staticSkills } from '../data';
import { sanitizeRichText, toDisplayHtml } from './richText';

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
    fields: ['title', 'role', 'description'],
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

const RICH_TEXT_FIELDS: Record<TranslatableTable, string[]> = {
  profile_info: ['bio'],
  projects: ['description'],
  journey_items: ['description'],
  competencies: [],
  technical_skills: [],
};

const sanitizeRichTextFields = (table: TranslatableTable, payload: Record<string, any>) => {
  const fields = RICH_TEXT_FIELDS[table];
  if (!fields || fields.length === 0) return payload;

  const next = { ...payload };
  fields.forEach((field) => {
    if (typeof next[field] === 'string') {
      next[field] = sanitizeRichText(toDisplayHtml(next[field]));
    }
  });
  return next;
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
    const normalizeOptional = (value?: string | null) => {
      if (value === undefined || value === null) return value ?? null;
      const trimmed = value.trim();
      return trimmed === '' ? null : trimmed;
    };
    const normalizeRequired = (value?: string | null) => {
      if (value === undefined || value === null) return value ?? null;
      return value.trim();
    };
    const normalizeEmail = (value?: string | null) => {
      const cleaned = normalizeOptional(value);
      if (cleaned === null || cleaned === undefined) return cleaned ?? null;
      // Remove whitespace and zero-width characters that break DB regex
      return cleaned.replace(/[\s\u200B\u200C\u200D\uFEFF]+/g, '');
    };

    const normalizedUpdates: Partial<ProfileInfo> = { ...updates };
    if ('display_name' in updates) normalizedUpdates.display_name = normalizeRequired(updates.display_name);
    if ('headline' in updates) normalizedUpdates.headline = normalizeRequired(updates.headline);
    if ('bio' in updates) normalizedUpdates.bio = sanitizeRichText(toDisplayHtml(updates.bio));
    if ('whatsapp' in updates) normalizedUpdates.whatsapp = normalizeRequired(updates.whatsapp);
    if ('email_contact' in updates) normalizedUpdates.email_contact = normalizeEmail(updates.email_contact);
    if ('linkedin_url' in updates) normalizedUpdates.linkedin_url = normalizeOptional(updates.linkedin_url);
    if ('git_url' in updates) normalizedUpdates.git_url = normalizeOptional(updates.git_url);
    if ('action_phrase' in updates) normalizedUpdates.action_phrase = normalizeOptional(updates.action_phrase);
    if ('badge' in updates) normalizedUpdates.badge = normalizeOptional(updates.badge);

    const localized = await buildLocalizedPayload('profile_info', sanitizeRichTextFields('profile_info', normalizedUpdates as Record<string, any>));
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
    const localized = await buildLocalizedPayload('journey_items', sanitizeRichTextFields('journey_items', item as Record<string, any>));
    const { data, error } = await supabase.from('journey_items').insert([localized]).select();
    if (error) throw error;
    return data;
  },

  updateJourney: async (id: string, updates: Partial<JourneyItem>) => {
    const localized = await buildLocalizedPayload('journey_items', sanitizeRichTextFields('journey_items', updates as Record<string, any>));
    const { data, error } = await supabase.from('journey_items').update(localized).eq('id', id).select();
    if (error) throw error;
    return data;
  },

  deleteJourney: async (id: string) => {
    const { error } = await supabase.from('journey_items').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Projects (Admin / raw table) ---
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

  // --- Projects (Public / view) ---
  getProjectsWithSkills: async (): Promise<ProjectWithSkills[]> => {
    const { data, error } = await supabase
      .from('v_projects_with_skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching projects with skills:', error);
      return [];
    }
    return data || [];
  },

  createProject: async (project: Omit<Project, 'id'>) => {
    const localized = await buildLocalizedPayload('projects', sanitizeRichTextFields('projects', project as Record<string, any>));
    const { data, error } = await supabase.from('projects').insert([localized]).select();
    if (error) throw error;
    return data;
  },

  updateProject: async (id: string, updates: Partial<Project>) => {
    const localized = await buildLocalizedPayload('projects', sanitizeRichTextFields('projects', updates as Record<string, any>));
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

  // --- Technical Skills (Admin / raw table) ---
  getTechnicalSkills: async (): Promise<TechnicalSkill[]> => {
    const { data, error } = await supabase
      .from('technical_skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching technical skills:', error);
      return [];
    }
    return (data || []) as TechnicalSkill[];
  },

  // --- Skills with related projects (Public / view) ---
  getSkillsWithProjects: async (): Promise<SkillWithProjects[]> => {
    const { data, error } = await supabase
      .from('v_skills_with_projects')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching skills with projects:', error);
      return [];
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
          icon_key: s.icon,
          category: 'other',
          is_active: true,
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
  },

  // --- Project ↔ Skills pivot ---
  getProjectSkillIds: async (projectId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('project_technical_skills')
      .select('technical_skill_id')
      .eq('project_id', projectId);

    if (error) {
      console.error('Error fetching project skills:', error);
      return [];
    }
    return (data || []).map((row: any) => row.technical_skill_id);
  },

  syncProjectSkills: async (projectId: string, skillIds: string[]) => {
    const { error } = await supabase.rpc('sync_project_skills', {
      p_project_id: projectId,
      p_skill_ids: skillIds
    });
    if (error) throw error;
  }
};
