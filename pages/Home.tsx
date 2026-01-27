import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useI18n } from '../i18n';
import { api } from '../services/api';
import { ProfileInfo, Project, JourneyItem, Competency, TechnicalSkill } from '../types';

const HeroSection = () => {
  const { t } = useI18n();
  const [profile, setProfile] = useState<ProfileInfo | null>(null);

  useEffect(() => {
    api.getProfile().then(setProfile);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 lg:py-0">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Text Content */}
        <div className="flex flex-col items-start space-y-6 order-2 lg:order-1 pt-10 lg:pt-0">
          
          {/* 1. Badge de Status */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full backdrop-blur-sm shadow-lg shadow-black/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-300 tracking-wide">
              {profile?.badge || t('hero.badge')}
            </span>
          </div>

          {/* 2. Título Principal (H1) */}
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
            {t('hero.greeting')} {profile?.display_name || "..."}
          </h1>

          {/* 3. Manchete / Headline (H2) - Gradiente */}
          <h2 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-green-400 leading-tight">
            {profile?.headline || t('hero.title.highlight')}
          </h2>

          {/* 4. Divisor Visual */}
          <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-green-500 rounded-full my-4"></div>

          {/* 5. Proposta de Valor (H3) */}
          <h3 className="text-xl md:text-2xl text-slate-100 font-medium">
             {profile?.action_phrase}
          </h3>

          {/* 6. Bio / Resumo (P) */}
          <p className="text-lg text-slate-300 mb-12 max-w-xl leading-relaxed">
            {profile?.bio || t('hero.description')}
          </p>

          {/* 7. Botões de Chamada (CTA) */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            {/* Botão Conhecer Mais */}
            <a 
              href="#skills" 
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-1 text-center"
            >
              {t('hero.cta.more')}
            </a>
            
            {/* Botões Sociais */}
            <div className="flex gap-4">
               {profile?.linkedin_url && (
                 <a 
                   href={profile.linkedin_url} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="flex-1 sm:flex-none px-6 py-4 bg-transparent border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white hover:bg-blue-600/10 rounded-xl font-medium transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                   title="LinkedIn"
                 >
                   <i className="fa-brands fa-linkedin-in text-xl"></i>
                   <span className="sm:hidden">LinkedIn</span>
                 </a>
               )}
               {profile?.git_url && (
                 <a 
                   href={profile.git_url} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="flex-1 sm:flex-none px-6 py-4 bg-transparent border border-slate-700 hover:border-slate-400 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl font-medium transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                   title="GitHub"
                 >
                   <i className="fa-brands fa-github text-xl"></i>
                   <span className="sm:hidden">GitHub</span>
                 </a>
               )}
            </div>
          </div>
        </div>

        {/* Image Composition */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

          <div className="relative w-full max-w-md mx-auto">
             <div className="absolute inset-0 border-2 border-slate-700/50 rounded-3xl rotate-6 transform translate-x-4 translate-y-4 z-0"></div>
             
             <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-sm rounded-3xl -rotate-3 transform -translate-x-2 -translate-y-2 z-0"></div>

             <div className="relative rounded-2xl overflow-hidden shadow-2xl z-10 bg-slate-900 border border-slate-700/50 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-green-500/10 z-20 group-hover:opacity-0 transition-opacity duration-500"></div>
                
                <img 
                  src="https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/image/Matos_sem_fundo.png" 
                  alt="Avatar" 
                  className="relative w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out transform group-hover:scale-105"
                />
                
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-20"></div>
             </div>

             <div className="absolute -bottom-8 -left-8 md:-left-12 z-30 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float max-w-[200px]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg">
                   <i className="fa-solid fa-code text-lg"></i>
                </div>
                <div>
                   <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Experience</p>
                   <p className="text-xl font-bold text-white">5+ Years</p>
                </div>
             </div>

             <div className="absolute -top-6 -right-6 z-0 text-slate-800/50 text-6xl animate-pulse">
                <i className="fa-brands fa-react"></i>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CompetenciesSection = () => {
  const { t } = useI18n();
  const [competencies, setCompetencies] = useState<Competency[]>([]);

  useEffect(() => {
    api.getCompetencies().then(setCompetencies);
  }, []);

  return (
    <section id="skills" className="py-24 bg-slate-900 relative border-b border-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">{t('skills.title')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t('skills.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {competencies.map((comp) => (
            <div 
              key={comp.id}
              className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:-translate-y-1 hover:border-indigo-500 transition-all duration-300 flex flex-col items-start"
            >
              <div className="w-14 h-14 rounded-xl bg-slate-800/50 flex items-center justify-center mb-4 group-hover:bg-indigo-500/10 transition-colors">
                <i className={`${comp.icon} text-2xl text-slate-400 group-hover:text-indigo-400 transition-colors`}></i>
              </div>
              <h3 className="text-lg font-bold text-slate-200 mb-1">{comp.title}</h3>
              {comp.subtitle && <p className="text-sm text-slate-500 mb-4">{comp.subtitle}</p>}
              
              <div className="mt-auto pt-4 flex flex-wrap gap-2 w-full">
                {comp.items?.map((item, idx) => (
                   <span key={idx} className="px-2 py-1 text-[10px] font-semibold bg-slate-800 text-slate-300 rounded border border-slate-700">
                     {item}
                   </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechStackSection = () => {
  const { t } = useI18n();
  const [skills, setSkills] = useState<TechnicalSkill[]>([]);

  useEffect(() => {
    api.getTechnicalSkills().then(setSkills);
  }, []);

  return (
    <section className="py-24 bg-slate-950 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">{t('tech.title')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t('tech.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div 
              key={skill.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
            >
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-3xl text-slate-300">
                <i className={skill.icon}></i>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-6">{skill.name}</h3>
              
              <div className="w-full mt-auto">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                     style={{ width: `${skill.level}%` }}
                   ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ExperienceSection = () => {
  const { t } = useI18n();
  const [experience, setExperience] = useState<JourneyItem[]>([]);

  useEffect(() => {
    api.getJourney().then(setExperience);
  }, []);

  return (
    <section id="experience" className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4 sticky top-32">{t('experience.title')}</h2>
            <p className="text-slate-400 sticky top-44">
              {t('experience.subtitle')}
            </p>
          </div>
          <div className="lg:col-span-2">
            <div className="relative border-l-2 border-slate-800 ml-4 md:ml-6 space-y-12">
              {experience.map((item) => (
                <div key={item.id} className="relative pl-12">
                  <div className="absolute -left-[9px] top-2 w-5 h-5 rounded-full border-4 border-slate-950 bg-indigo-500 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]"></div>
                  
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 hover:bg-slate-900 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <p className="text-indigo-400 font-medium mt-1">{item.company}</p>
                      </div>
                      <span className="mt-2 md:mt-0 inline-block px-3 py-1 bg-slate-800 rounded-lg text-xs font-semibold text-slate-400 border border-slate-700">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                      {item.description}
                    </p>
                    <div className="mt-4">
                       <i className={`fa-solid ${item.type === 'work' ? 'fa-briefcase' : 'fa-graduation-cap'} text-slate-600`}></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProjectsSection = () => {
  const { t } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerScreen, setItemsPerScreen] = useState(3);

  useEffect(() => {
    api.getProjects().then(setProjects);

    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerScreen(1);
      else if (window.innerWidth < 1024) setItemsPerScreen(2);
      else setItemsPerScreen(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const parseTech = (tech: string) => {
    if (!tech) return [];
    return tech.split(',').map(s => s.trim());
  };

  const nextSlide = () => {
    const maxIndex = Math.max(0, projects.length - itemsPerScreen);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= projects.length - itemsPerScreen;

  return (
    <section id="projects" className="py-24 bg-slate-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">{t('projects.title')}</h2>
            <p className="text-slate-400 max-w-xl">{t('projects.subtitle')}</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
             {/* Navigation Buttons */}
             <button 
               onClick={prevSlide}
               disabled={isAtStart}
               className={`w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center transition-all ${isAtStart ? 'text-slate-700 cursor-not-allowed' : 'text-slate-300 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white'}`}
             >
               <i className="fa-solid fa-chevron-left"></i>
             </button>
             <button 
               onClick={nextSlide}
               disabled={isAtEnd || projects.length <= itemsPerScreen}
               className={`w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center transition-all ${isAtEnd || projects.length <= itemsPerScreen ? 'text-slate-700 cursor-not-allowed' : 'text-slate-300 hover:bg-indigo-600 hover:border-indigo-600 hover:text-white'}`}
             >
               <i className="fa-solid fa-chevron-right"></i>
             </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden -mx-2 p-2">
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-8"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerScreen)}%)` }}
          >
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="flex-shrink-0 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)]"
              >
                <div className="h-full group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all duration-300 flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent z-10 transition-colors"></div>
                    <img 
                      src={project.image_url || "https://picsum.photos/800/600"} 
                      alt={project.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="mb-2">
                       <h3 className="text-xl font-bold text-slate-100">{project.title}</h3>
                       {project.role && <p className="text-xs text-indigo-400 font-medium uppercase tracking-wide">{project.role}</p>}
                    </div>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {parseTech(project.technologies).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-auto flex gap-4 pt-4 border-t border-slate-900">
                       {project.live_url && (
                         <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-indigo-400 flex items-center">
                           <i className="fa-solid fa-arrow-up-right-from-square mr-2"></i> {t('projects.liveDemo')}
                         </a>
                       )}
                       {project.github_url && (
                         <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-500 hover:text-white flex items-center">
                           <i className="fa-brands fa-github mr-2"></i> {t('projects.code')}
                         </a>
                       )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
                <div className="w-full text-center py-10 text-slate-500">
                    Nenhum projeto cadastrado ainda.
                </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const { t } = useI18n();
  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  
  // State para o formulário de contato
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    api.getProfile().then(setProfile);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.whatsapp) {
      alert("Número de WhatsApp não configurado pelo administrador.");
      return;
    }

    // Formata a mensagem para o WhatsApp
    const message = `Olá! Meu nome é *${contactForm.name}* (${contactForm.email}).\n\n*Assunto:* ${contactForm.subject}\n\n${contactForm.message}`;
    
    // Cria a URL do WhatsApp
    const url = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(message)}`;
    
    // Abre em nova aba
    window.open(url, '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-6">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
           {/* Form */}
           <div className="bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-800">
             <h3 className="text-2xl font-bold text-white mb-6">{t('contact.title')}</h3>
             <form className="space-y-6" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">{t('contact.name')}</label>
                    <input 
                      type="text" 
                      name="name"
                      value={contactForm.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600" 
                      placeholder="John Doe" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">{t('contact.email')}</label>
                    <input 
                      type="email" 
                      name="email"
                      value={contactForm.email}
                      onChange={handleInputChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600" 
                      placeholder="john@example.com" 
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-400">{t('contact.subject')}</label>
                   <input 
                    type="text" 
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600" 
                    placeholder="Project Inquiry" 
                    required
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-400">{t('contact.message')}</label>
                   <textarea 
                    rows={4} 
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600" 
                    placeholder="Tell me about your project..."
                    required
                   ></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition-all">
                  {t('contact.send')} (via WhatsApp)
                </button>
             </form>
           </div>

           {/* Info */}
           <div className="flex flex-col justify-center space-y-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-50 mb-6">
                  {t('contact.touch.title')}
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  {t('contact.touch.desc')}
                </p>
              </div>

              <div className="space-y-6">
                 <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                      <i className="fa-solid fa-envelope text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">{t('contact.touch.email')}</h4>
                      <p className="text-slate-400">{profile?.email_contact || "hello@alexdev.com"}</p>
                    </div>
                 </div>
                 {profile?.linkedin_url && (
                   <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                        <i className="fa-brands fa-linkedin-in text-xl"></i>
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-lg">LinkedIn</h4>
                        <a href={profile.linkedin_url} target="_blank" className="text-slate-400 hover:text-white transition-colors">Ver perfil</a>
                      </div>
                   </div>
                 )}
                 {profile?.git_url && (
                   <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                        <i className="fa-brands fa-github text-xl"></i>
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-lg">GitHub</h4>
                        <a href={profile.git_url} target="_blank" className="text-slate-400 hover:text-white transition-colors">Ver perfil</a>
                      </div>
                   </div>
                 )}
              </div>

              {profile?.whatsapp && (
                <div className="pt-8">
                   <a 
                    href={`https://wa.me/${profile.whatsapp}`}
                    target="_blank"
                    className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-600/20"
                   >
                     <i className="fa-brands fa-whatsapp mr-3 text-2xl"></i> {t('contact.touch.whatsapp')}
                   </a>
                </div>
              )}
           </div>
         </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <CompetenciesSection />
      <TechStackSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </Layout>
  );
};

export default Home;