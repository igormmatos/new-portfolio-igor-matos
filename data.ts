import { Project, ExperienceItem, Skill, Service } from './types';
import { Language } from './i18n';

// Dados que não mudam entre idiomas
export const skills: Skill[] = [
  { id: 1, name: "React", icon: "fa-brands fa-react", level: 95 },
  { id: 2, name: "TypeScript", icon: "fa-brands fa-js", level: 90 },
  { id: 3, name: "Tailwind CSS", icon: "fa-solid fa-wind", level: 98 },
  { id: 4, name: "Node.js", icon: "fa-brands fa-node", level: 85 },
  { id: 5, name: "AWS", icon: "fa-brands fa-aws", level: 75 },
  { id: 6, name: "UI/UX Design", icon: "fa-solid fa-pen-nib", level: 80 },
  { id: 7, name: "PostgreSQL", icon: "fa-solid fa-database", level: 82 },
  { id: 8, name: "Docker", icon: "fa-brands fa-docker", level: 70 },
];

const experienceData = {
  'pt-BR': [
    {
      id: 1,
      role: "Arquiteto Frontend Sênior",
      company: "TechFlow Solutions",
      period: "2021 - Atualmente",
      description: "Liderando a migração frontend para React 18, estabelecendo um design system com Tailwind e mentoreando uma equipe de 6 desenvolvedores.",
      type: "work"
    },
    {
      id: 2,
      role: "Desenvolvedor Full Stack",
      company: "Creative Pulse Agency",
      period: "2018 - 2021",
      description: "Desenvolvi mais de 15 aplicações web de alta performance para clientes empresariais. Integrei pagamentos com Stripe e recursos em tempo real via socket.",
      type: "work"
    },
    {
      id: 3,
      role: "Bacharelado em Ciência da Computação",
      company: "Universidade de Tecnologia",
      period: "2014 - 2018",
      description: "Graduado com Honras. Especialização em Interação Humano-Computador e Sistemas Distribuídos.",
      type: "education"
    }
  ],
  'en': [
    {
      id: 1,
      role: "Senior Frontend Architect",
      company: "TechFlow Solutions",
      period: "2021 - Present",
      description: "Leading the frontend migration to React 18, establishing a design system with Tailwind, and mentoring a team of 6 developers.",
      type: "work"
    },
    {
      id: 2,
      role: "Full Stack Developer",
      company: "Creative Pulse Agency",
      period: "2018 - 2021",
      description: "Developed 15+ high-performance web applications for enterprise clients. Integrated Stripe payments and real-time socket features.",
      type: "work"
    },
    {
      id: 3,
      role: "B.S. Computer Science",
      company: "University of Technology",
      period: "2014 - 2018",
      description: "Graduated with Honors. Specialized in Human-Computer Interaction and Distributed Systems.",
      type: "education"
    }
  ],
  'fr': [
    {
      id: 1,
      role: "Architecte Frontend Senior",
      company: "TechFlow Solutions",
      period: "2021 - Présent",
      description: "Direction de la migration frontend vers React 18, mise en place d'un système de design avec Tailwind et mentorat d'une équipe de 6 développeurs.",
      type: "work"
    },
    {
      id: 2,
      role: "Développeur Full Stack",
      company: "Creative Pulse Agency",
      period: "2018 - 2021",
      description: "Développement de plus de 15 applications web haute performance. Intégration des paiements Stripe et fonctionnalités temps réel.",
      type: "work"
    },
    {
      id: 3,
      role: "Licence en Informatique",
      company: "Université de Technologie",
      period: "2014 - 2018",
      description: "Diplômé avec mention. Spécialisation en Interaction Homme-Machine et Systèmes Distribués.",
      type: "education"
    }
  ]
};

const projectsData = {
  'pt-BR': [
    {
      id: 1,
      title: "FinDash Pro",
      description: "Um dashboard abrangente de análise financeira com visualização de dados em tempo real usando D3.js e Recharts.",
      image: "https://picsum.photos/800/600?random=1",
      tags: ["React", "D3.js", "Tailwind"],
      demoLink: "#",
      codeLink: "#"
    },
    {
      id: 2,
      title: "E-Commerce Ultra",
      description: "Loja virtual headless construída com Next.js e Shopify API, atingindo pontuação 99/100 no Lighthouse.",
      image: "https://picsum.photos/800/600?random=2",
      tags: ["Next.js", "Shopify", "Redis"],
      demoLink: "#",
      codeLink: "#"
    },
    {
      id: 3,
      title: "TaskFlow AI",
      description: "Ferramenta de gestão de projetos impulsionada por IA que sugere automaticamente quebras de tarefas usando a API Gemini.",
      image: "https://picsum.photos/800/600?random=3",
      tags: ["TypeScript", "OpenAI", "Node"],
      demoLink: "#",
      codeLink: "#"
    }
  ],
  'en': [
    {
      id: 1,
      title: "FinDash Pro",
      description: "A comprehensive financial analytics dashboard featuring real-time data visualization using D3.js and Recharts.",
      image: "https://picsum.photos/800/600?random=1",
      tags: ["React", "D3.js", "Tailwind"],
      demoLink: "#",
      codeLink: "#"
    },
    {
      id: 2,
      title: "E-Commerce Ultra",
      description: "Headless e-commerce storefront built with Next.js and Shopify API, achieving a 99/100 Lighthouse score.",
      image: "https://picsum.photos/800/600?random=2",
      tags: ["Next.js", "Shopify", "Redis"],
      demoLink: "#",
      codeLink: "#"
    },
    {
      id: 3,
      title: "TaskFlow AI",
      description: "AI-powered project management tool that auto-suggests task breakdowns using the Gemini API.",
      image: "https://picsum.photos/800/600?random=3",
      tags: ["TypeScript", "OpenAI", "Node"],
      demoLink: "#",
      codeLink: "#"
    }
  ],
  'fr': [
    {
      id: 1,
      title: "FinDash Pro",
      description: "Un tableau de bord d'analyse financière complet avec visualisation de données en temps réel utilisant D3.js et Recharts.",
      image: "https://picsum.photos/800/600?random=1",
      tags: ["React", "D3.js", "Tailwind"],
      demoLink: "#",
      codeLink: "#"
    },
    {
      id: 2,
      title: "E-Commerce Ultra",
      description: "Vitrine e-commerce headless construite avec Next.js et l'API Shopify, atteignant un score Lighthouse de 99/100.",
      image: "https://picsum.photos/800/600?random=2",
      tags: ["Next.js", "Shopify", "Redis"],
      demoLink: "#",
      codeLink: "#"
    },
    {
      id: 3,
      title: "TaskFlow AI",
      description: "Outil de gestion de projet alimenté par l'IA qui suggère automatiquement la répartition des tâches via l'API Gemini.",
      image: "https://picsum.photos/800/600?random=3",
      tags: ["TypeScript", "OpenAI", "Node"],
      demoLink: "#",
      codeLink: "#"
    }
  ]
};

const servicesData = {
  'pt-BR': [
    {
      id: 1,
      title: "Desenvolvimento de Apps Web",
      description: "Aplicações web escaláveis, seguras e de alta performance, sob medida para suas necessidades de negócio.",
      priceStart: 2500,
      icon: "fa-solid fa-code"
    },
    {
      id: 2,
      title: "Design System e UI/UX",
      description: "Design systems abrangentes incluindo arquivos Figma, bibliotecas de componentes e documentação.",
      priceStart: 1200,
      icon: "fa-solid fa-layer-group"
    },
    {
      id: 3,
      title: "Otimização de Performance",
      description: "Auditoria e refatoração de aplicações existentes para melhorar os Core Web Vitals e tempos de carregamento.",
      priceStart: 800,
      icon: "fa-solid fa-gauge-high"
    }
  ],
  'en': [
    {
      id: 1,
      title: "Web Application Development",
      description: "Scalable, secure, and high-performance web apps tailored to your business needs.",
      priceStart: 2500,
      icon: "fa-solid fa-code"
    },
    {
      id: 2,
      title: "UI/UX Design System",
      description: "Comprehensive design systems including Figma files, component libraries, and documentation.",
      priceStart: 1200,
      icon: "fa-solid fa-layer-group"
    },
    {
      id: 3,
      title: "Performance Optimization",
      description: "Audit and refactor existing applications to improve Core Web Vitals and load times.",
      priceStart: 800,
      icon: "fa-solid fa-gauge-high"
    }
  ],
  'fr': [
    {
      id: 1,
      title: "Développement d'Apps Web",
      description: "Applications web évolutives, sécurisées et performantes, adaptées aux besoins de votre entreprise.",
      priceStart: 2500,
      icon: "fa-solid fa-code"
    },
    {
      id: 2,
      title: "Système de Design UI/UX",
      description: "Systèmes de design complets comprenant fichiers Figma, bibliothèques de composants et documentation.",
      priceStart: 1200,
      icon: "fa-solid fa-layer-group"
    },
    {
      id: 3,
      title: "Optimisation des Performances",
      description: "Audit et refonte des applications existantes pour améliorer les Core Web Vitals et les temps de chargement.",
      priceStart: 800,
      icon: "fa-solid fa-gauge-high"
    }
  ]
};

export const getExperience = (lang: Language): ExperienceItem[] => {
  return experienceData[lang] as ExperienceItem[];
};

export const getProjects = (lang: Language): Project[] => {
  // Map raw data to the Project interface
  return projectsData[lang].map((p) => ({
    id: p.id.toString(),
    title: p.title,
    description: p.description,
    technologies: p.tags.join(', '),
    image_url: p.image,
    live_url: p.demoLink,
    github_url: p.codeLink,
    display_order: p.id,
    // Add missing properties or optional ones
    role: undefined 
  }));
};

export const getServices = (lang: Language): Service[] => {
  return servicesData[lang] as Service[];
};

// Exporting mapped data for backwards compatibility if needed
export const projects = getProjects('pt-BR');
export const experience = experienceData['pt-BR'];
export const services = servicesData['pt-BR'];