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
    'hero.title.prefix': 'Construindo o',
    'hero.title.highlight': 'Futuro da Web',
    'hero.description': 'Olá, sou Alex. Um Arquiteto Frontend Sênior especializado em construir experiências digitais excepcionais. Unindo expertise técnica com design thinking.',
    'hero.cta.primary': 'Iniciar Projeto',
    'hero.cta.secondary': 'Ver Trabalhos',

    'skills.title': 'Expertise Técnica',
    'skills.subtitle': 'As ferramentas e tecnologias que uso para dar vida às ideias.',

    'experience.title': 'Minha Jornada',
    'experience.subtitle': 'Uma linha do tempo da minha carreira profissional e formação educacional, mostrando meu crescimento e marcos.',

    'projects.title': 'Projetos em Destaque',
    'projects.subtitle': 'Trabalhos selecionados que demonstram minha habilidade em entregar soluções complexas.',
    'projects.viewGithub': 'Ver Github',
    'projects.liveDemo': 'Demo Online',
    'projects.code': 'Código',

    'services.title': 'Serviços',
    'services.subtitle': 'Serviços de alta qualidade sob medida para suas necessidades específicas.',
    'services.startsAt': 'A partir de',

    'contact.title': 'Vamos trabalhar juntos',
    'contact.name': 'Nome',
    'contact.email': 'Email',
    'contact.subject': 'Assunto',
    'contact.message': 'Mensagem',
    'contact.send': 'Enviar Mensagem',
    'contact.touch.title': 'Entre em contato',
    'contact.touch.desc': 'Tem um projeto em mente ou apenas quer dar um oi? Estou sempre aberto a discutir novos projetos, ideias criativas ou oportunidades.',
    'contact.touch.email': 'Me envie um email',
    'contact.touch.location': 'Localização',
    'contact.touch.whatsapp': 'Conversar no WhatsApp',

    'footer.rights': 'Todos os direitos reservados.',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
    'footer.tagline': 'Construindo produtos digitais que são tão performáticos quanto bonitos.',

    'admin.dashboard': 'Painel',
    'admin.projects': 'Projetos',
    'admin.messages': 'Mensagens',
    'admin.settings': 'Configurações',
    'admin.manage': 'Gerencie o conteúdo do seu portfólio.',
    'admin.add': 'Novo Projeto',
    'admin.table.name': 'Nome do Projeto',
    'admin.table.stack': 'Tech Stack',
    'admin.table.actions': 'Ações',
    'admin.construction': 'Este módulo está em construção.',
    'admin.edit': 'Editar Projeto',
    'admin.create': 'Criar Novo Projeto',
    'admin.cancel': 'Cancelar',
    'admin.save': 'Salvar Alterações',
    'admin.form.title': 'Título do Projeto',
    'admin.form.desc': 'Descrição',
    'admin.form.image': 'URL da Imagem',
    'admin.form.tags': 'Tags (separadas por vírgula)'
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
    'hero.title.prefix': 'Building the',
    'hero.title.highlight': 'Future of Web',
    'hero.description': 'I\'m Alex, a Senior Frontend Architect specialized in building exceptional digital experiences. Merging technical expertise with design thinking.',
    'hero.cta.primary': 'Start a Project',
    'hero.cta.secondary': 'View Work',

    'skills.title': 'Technical Expertise',
    'skills.subtitle': 'The tools and technologies I use to bring ideas to life.',

    'experience.title': 'My Journey',
    'experience.subtitle': 'A timeline of my professional career and educational background, showcasing my growth and milestones.',

    'projects.title': 'Featured Projects',
    'projects.subtitle': 'Selected works that demonstrate my ability to deliver complex solutions.',
    'projects.viewGithub': 'View Github',
    'projects.liveDemo': 'Live Demo',
    'projects.code': 'Code',

    'services.title': 'Services',
    'services.subtitle': 'High-quality services tailored to your specific needs.',
    'services.startsAt': 'Starts at',

    'contact.title': 'Let\'s work together',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.touch.title': 'Get in touch',
    'contact.touch.desc': 'Have a project in mind or just want to say hi? I\'m always open to discussing new projects, creative ideas or opportunities.',
    'contact.touch.email': 'Email me at',
    'contact.touch.location': 'Location',
    'contact.touch.whatsapp': 'Chat on WhatsApp',

    'footer.rights': 'All rights reserved.',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.tagline': 'Building digital products that are as performant as they are beautiful.',

    'admin.dashboard': 'Dashboard',
    'admin.projects': 'Projects',
    'admin.messages': 'Messages',
    'admin.settings': 'Settings',
    'admin.manage': 'Manage your portfolio content.',
    'admin.add': 'Add New Project',
    'admin.table.name': 'Project Name',
    'admin.table.stack': 'Tech Stack',
    'admin.table.actions': 'Actions',
    'admin.construction': 'This module is under construction.',
    'admin.edit': 'Edit Project',
    'admin.create': 'Create New Project',
    'admin.cancel': 'Cancel',
    'admin.save': 'Save Changes',
    'admin.form.title': 'Project Title',
    'admin.form.desc': 'Description',
    'admin.form.image': 'Image URL',
    'admin.form.tags': 'Tags (comma separated)'
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
    'hero.title.prefix': 'Construire le',
    'hero.title.highlight': 'Futur du Web',
    'hero.description': 'Je suis Alex, Architecte Frontend Senior spécialisé dans la création d\'expériences numériques exceptionnelles. Alliant expertise technique et design thinking.',
    'hero.cta.primary': 'Lancer un projet',
    'hero.cta.secondary': 'Voir mon travail',

    'skills.title': 'Expertise Technique',
    'skills.subtitle': 'Les outils et technologies que j\'utilise pour donner vie aux idées.',

    'experience.title': 'Mon Parcours',
    'experience.subtitle': 'Une chronologie de ma carrière professionnelle et de ma formation, montrant ma croissance et mes étapes clés.',

    'projects.title': 'Projets en Vedette',
    'projects.subtitle': 'Travaux sélectionnés démontrant ma capacité à livrer des solutions complexes.',
    'projects.viewGithub': 'Voir Github',
    'projects.liveDemo': 'Démo Live',
    'projects.code': 'Code',

    'services.title': 'Services',
    'services.subtitle': 'Services de haute qualité adaptés à vos besoins spécifiques.',
    'services.startsAt': 'À partir de',

    'contact.title': 'Travaillons ensemble',
    'contact.name': 'Nom',
    'contact.email': 'Email',
    'contact.subject': 'Sujet',
    'contact.message': 'Message',
    'contact.send': 'Envoyer le message',
    'contact.touch.title': 'Contactez-moi',
    'contact.touch.desc': 'Vous avez un projet en tête ou voulez simplement dire bonjour ? Je suis toujours ouvert aux nouveaux projets et idées créatives.',
    'contact.touch.email': 'Envoyez-moi un email',
    'contact.touch.location': 'Localisation',
    'contact.touch.whatsapp': 'Discuter sur WhatsApp',

    'footer.rights': 'Tous droits réservés.',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.terms': 'Conditions d\'utilisation',
    'footer.tagline': 'Création de produits numériques aussi performants que beaux.',

    'admin.dashboard': 'Tableau de bord',
    'admin.projects': 'Projets',
    'admin.messages': 'Messages',
    'admin.settings': 'Paramètres',
    'admin.manage': 'Gérez le contenu de votre portfolio.',
    'admin.add': 'Nouveau Projet',
    'admin.table.name': 'Nom du Projet',
    'admin.table.stack': 'Tech Stack',
    'admin.table.actions': 'Actions',
    'admin.construction': 'Ce module est en construction.',
    'admin.edit': 'Modifier le Projet',
    'admin.create': 'Créer un Projet',
    'admin.cancel': 'Annuler',
    'admin.save': 'Sauvegarder',
    'admin.form.title': 'Titre du Projet',
    'admin.form.desc': 'Description',
    'admin.form.image': 'URL de l\'image',
    'admin.form.tags': 'Tags (séparés par des virgules)'
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