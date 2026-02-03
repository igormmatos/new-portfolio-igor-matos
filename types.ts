
export interface ProfileInfo {
  id: string;
  display_name: string;
  display_name_pt?: string;
  display_name_en?: string;
  display_name_fr?: string;
  headline: string;
  headline_pt?: string;
  headline_en?: string;
  headline_fr?: string;
  bio: string;
  bio_pt?: string;
  bio_en?: string;
  bio_fr?: string;
  badge: string; // Novo campo para o status/pill
  badge_pt?: string;
  badge_en?: string;
  badge_fr?: string;
  action_phrase: string; // Texto de destaque colorido
  action_phrase_pt?: string;
  action_phrase_en?: string;
  action_phrase_fr?: string;
  whatsapp: string;
  linkedin_url: string;
  git_url: string;
  email_contact: string;
}

export interface JourneyItem {
  id: string;
  title: string;
  title_pt?: string;
  title_en?: string;
  title_fr?: string;
  company: string;
  company_pt?: string;
  company_en?: string;
  company_fr?: string;
  period: string;
  period_pt?: string;
  period_en?: string;
  period_fr?: string;
  description: string;
  description_pt?: string;
  description_en?: string;
  description_fr?: string;
  type: 'experience' | 'education';
  display_order: number;
}

export interface Project {
  id: string;
  slug?: string;
  title: string;
  title_pt?: string;
  title_en?: string;
  title_fr?: string;
  role?: string;
  role_pt?: string;
  role_en?: string;
  role_fr?: string;
  description: string;
  description_pt?: string;
  description_en?: string;
  description_fr?: string;
  technologies: string; // Mantido como TEXT conforme solicitado
  technologies_pt?: string;
  technologies_en?: string;
  technologies_fr?: string;
  github_url?: string;
  live_url?: string;
  image_url: string;
  display_order: number;
  status?: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
}

export interface Competency {
  id: string;
  title: string;
  title_pt?: string;
  title_en?: string;
  title_fr?: string;
  subtitle?: string;
  subtitle_pt?: string;
  subtitle_en?: string;
  subtitle_fr?: string;
  icon: string;
  items: string[]; // Array de strings no banco
  items_pt?: string[];
  items_en?: string[];
  items_fr?: string[];
  color_theme?: string;
  display_order: number;
}

export interface TechnicalSkill {
  id: string;
  name: string;
  name_pt?: string;
  name_en?: string;
  name_fr?: string;
  slug?: string;
  category?: string;
  icon?: string;
  icon_key?: string;
  is_active?: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectSkillRef {
  id: string;
  slug: string;
  name: string;
  category: string;
  icon_key: string | null;
}

export interface ProjectWithSkills extends Project {
  skills: ProjectSkillRef[];
}

export interface SkillProjectRef {
  id: string;
  slug: string;
  title: string;
  role?: string;
  image_url?: string;
  display_order?: number;
}

export interface SkillWithProjects extends TechnicalSkill {
  projects_count: number;
  projects: SkillProjectRef[];
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}

// Interfaces adicionadas para compatibilidade com data.ts
export interface Skill {
  id: number;
  name: string;
  icon: string;
  level: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  priceStart: number;
  icon: string;
}

export interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  type: string;
}
