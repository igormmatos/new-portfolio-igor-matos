export interface Skill {
  id: number;
  name: string;
  icon: string;
  level: number; // 0 to 100
}

export interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  type: 'work' | 'education';
}

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoLink: string;
  codeLink: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  priceStart: number;
  icon: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
}