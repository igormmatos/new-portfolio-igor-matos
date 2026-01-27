
export interface ProfileInfo {
  id: string;
  display_name: string;
  headline: string;
  bio: string;
  badge: string; // Novo campo para o status/pill
  action_phrase: string; // Texto de destaque colorido
  whatsapp: string;
  linkedin_url: string;
  git_url: string;
  email_contact: string;
}

export interface JourneyItem {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  type: 'work' | 'education';
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  role?: string;
  description: string;
  technologies: string; // Mantido como TEXT conforme solicitado
  github_url?: string;
  live_url?: string;
  image_url: string;
  display_order: number;
}

export interface Competency {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  items: string[]; // Array de strings no banco
  color_theme?: string;
  display_order: number;
}

export interface TechnicalSkill {
  id: string;
  name: string;
  icon: string;
  level: number; // 0 a 100
  display_order: number;
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
