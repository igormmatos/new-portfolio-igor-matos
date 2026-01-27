
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt-BR' | 'en' | 'fr';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const translations = {
  'pt-BR': {
    'nav.home': 'Início',
    'nav.skills': 'Habilidades',
    'nav.experience': 'Experiência',
    'nav.projects': 'Projetos',
    'nav.contact': 'Contato',
    'nav.admin': 'Admin',
    'nav.back': 'Voltar ao Site',
    
    'hero.badge': 'Disponível para contratação',
    'hero.greeting': 'Olá, eu sou',
    'hero.cta.more': 'Conhecer Mais',
    'hero.cta.primary': 'Iniciar Projeto',
    'hero.cta.secondary': 'Ver Trabalhos',

    'skills.title': 'Áreas de Atuação Estratégica',
    'skills.subtitle': 'As frentes em que aplico minha experiência para transformar desafios em soluções concretas.',

    'tech.title': 'Tecnologias que Domino',
    'tech.subtitle': 'Ferramentas, linguagens e frameworks que utilizo com proficiência para entregar soluções robustas e escaláveis.',

    'experience.title': 'Minha Jornada',
    'experience.subtitle': 'Uma linha do tempo da minha carreira profissional e formação educacional, mostrando meu crescimento e marcos.',

    'projects.title': 'Projetos em Destaque',
    'projects.subtitle': 'Trabalhos selecionados que demonstram minha habilidade em entregar soluções complexas.',
    'projects.viewGithub': 'Ver Github',
    'projects.liveDemo': 'Demo Online',
    'projects.code': 'Código',

    'contact.title': 'Vamos trabalhar juntos',
    'contact.name': 'Nome',
    'contact.email': 'Email',
    'contact.subject': 'Assunto',
    'contact.message': 'Mensagem',
    'contact.send': 'Enviar Mensagem',
    'contact.touch.title': 'Entre em contato',
    'contact.touch.desc': 'Tem um projeto em mente ou apenas quer dar um oi? Estou sempre aberto a discutir novos projetos, ideias criativas ou oportunidades.',
    'contact.touch.email': 'Me envie um email',
    'contact.touch.whatsapp': 'Conversar no WhatsApp',

    'footer.rights': 'Todos os direitos reservados.',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
    'footer.tagline': 'Construindo produtos digitais que são tão performáticos quanto bonitos.',

    'admin.dashboard': 'Painel',
    'admin.profile': 'Perfil',
    'admin.projects': 'Projetos',
    'admin.journey': 'Jornada',
    'admin.skills': 'Habilidades',
    'admin.tech': 'Tecnologias',
    'admin.manage': 'Gerencie o conteúdo do seu portfólio.',
    'admin.add': 'Adicionar Novo',
    'admin.save': 'Salvar Alterações',
    'admin.cancel': 'Cancelar',
    'admin.edit': 'Editar',
    'admin.create': 'Criar',
    'admin.table.actions': 'Ações',
    'admin.form.title': 'Título',
    'admin.form.desc': 'Descrição',
  },
  'en': {
    'nav.home': 'Home',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.back': 'Back to Site',

    'hero.badge': 'Available for hire',
    'hero.greeting': 'Hi, I am',
    'hero.cta.more': 'Learn More',
    'hero.cta.primary': 'Start a Project',
    'hero.cta.secondary': 'View Work',

    'skills.title': 'Strategic Areas of Expertise',
    'skills.subtitle': 'The fronts where I apply my experience to transform challenges into concrete solutions.',

    'tech.title': 'Technologies I Master',
    'tech.subtitle': 'Tools, languages, and frameworks I use with proficiency to deliver robust and scalable solutions.',

    'experience.title': 'My Journey',
    'experience.subtitle': 'A timeline of my professional career and educational background, showcasing my growth and milestones.',

    'projects.title': 'Featured Projects',
    'projects.subtitle': 'Selected works that demonstrate my ability to deliver complex solutions.',
    'projects.viewGithub': 'View Github',
    'projects.liveDemo': 'Live Demo',
    'projects.code': 'Code',

    'contact.title': 'Let\'s work together',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.touch.title': 'Get in touch',
    'contact.touch.desc': 'Have a project in mind or just want to say hi? I\'m always open to discussing new projects, creative ideas or opportunities.',
    'contact.touch.email': 'Email me at',
    'contact.touch.whatsapp': 'Chat on WhatsApp',

    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.tagline': 'Building digital products that are as performant as they are beautiful.',

    'admin.dashboard': 'Dashboard',
    'admin.profile': 'Profile',
    'admin.projects': 'Projects',
    'admin.journey': 'Journey',
    'admin.skills': 'Skills',
    'admin.tech': 'Technologies',
    'admin.manage': 'Manage your portfolio content.',
    'admin.add': 'Add New',
    'admin.save': 'Save Changes',
    'admin.cancel': 'Cancel',
    'admin.edit': 'Edit',
    'admin.create': 'Create',
    'admin.table.actions': 'Actions',
    'admin.form.title': 'Title',
    'admin.form.desc': 'Description',
  },
  'fr': {
    'nav.home': 'Accueil',
    'nav.skills': 'Compétences',
    'nav.experience': 'Expérience',
    'nav.projects': 'Projets',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.back': 'Retour au site',

    'hero.badge': 'Disponible pour embauche',
    'hero.greeting': 'Salut, je suis',
    'hero.cta.more': 'En savoir plus',
    'hero.cta.primary': 'Lancer un projet',
    'hero.cta.secondary': 'Voir mon travail',

    'skills.title': 'Domaines d\'Expertise Stratégique',
    'skills.subtitle': 'Les domaines où j\'applique mon expérience pour transformer les défis en solutions concrètes.',

    'tech.title': 'Technologies que je maîtrise',
    'tech.subtitle': 'Outils, langages et frameworks que j\'utilise avec compétence pour livrer des solutions robustes et évolutives.',

    'experience.title': 'Mon Parcours',
    'experience.subtitle': 'Une chronologie de ma carrière professionnelle et de ma formation, montrant ma croissance et mes étapes clés.',

    'projects.title': 'Projets en Vedette',
    'projects.subtitle': 'Travaux sélectionnés démontrant ma capacité à livrer des solutions complexes.',
    'projects.viewGithub': 'Voir Github',
    'projects.liveDemo': 'Démo Live',
    'projects.code': 'Code',

    'contact.title': 'Travaillons ensemble',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.subject': 'Sujet',
    'contact.message': 'Message',
    'contact.send': 'Envoyer le message',
    'contact.touch.title': 'Contactez-moi',
    'contact.touch.desc': 'Vous avez un projet en tête ou voulez simplement dire bonjour ? Je suis toujours ouvert aux nouveaux projets et idées créatives.',
    'contact.touch.email': 'Envoyez-moi un email',
    'contact.touch.whatsapp': 'Discuter sur WhatsApp',

    'footer.rights': 'Tous droits réservés.',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'utilisation',
    'footer.tagline': 'Création de produits numériques aussi performants que beaux.',

    'admin.dashboard': 'Tableau de bord',
    'admin.profile': 'Profil',
    'admin.projects': 'Projets',
    'admin.journey': 'Parcours',
    'admin.skills': 'Compétences',
    'admin.tech': 'Technologies',
    'admin.manage': 'Gérez le contenu de votre portfolio.',
    'admin.add': 'Ajouter',
    'admin.save': 'Sauvegarder',
    'admin.cancel': 'Annuler',
    'admin.edit': 'Modifier',
    'admin.create': 'Créer',
    'admin.table.actions': 'Actions',
    'admin.form.title': 'Titre',
    'admin.form.desc': 'Description',
  }
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('pt-BR');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && (savedLang === 'pt-BR' || savedLang === 'en' || savedLang === 'fr')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['pt-BR']] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
