import React, { useEffect, useState, useRef } from 'react';
import Layout from '../components/Layout';
import VerticalJourney from '../components/VerticalJourney';
import ScrollReveal from '../components/ScrollReveal';
import TechGroups from '../components/TechGroups';
import { useI18n, selectLocalizedArray, selectLocalizedColumn } from '../i18n';
import { api } from '../services/api';
import { trackEvent } from '../services/analytics';
import { ProfileInfo, ProjectWithSkills, Competency, SkillWithProjects } from '../types';

const HeroSection = () => {
  const { t, language } = useI18n();
  const [profile, setProfile] = useState<ProfileInfo | null>(null);

  useEffect(() => {
    api.getProfile().then(setProfile);
  }, []);

  const profileBadge = selectLocalizedColumn(profile, 'badge', language) || t('hero.badge');
  const profileName = selectLocalizedColumn(profile, 'display_name', language) || profile?.display_name;
  const profileHeadline = selectLocalizedColumn(profile, 'headline', language) || profile?.headline;
  const profileAction = selectLocalizedColumn(profile, 'action_phrase', language) || profile?.action_phrase;
  const profileBio = selectLocalizedColumn(profile, 'bio', language) || profile?.bio;

  const handleScrollToNext = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    trackEvent({ name: 'cta_click', props: { source: 'hero' } });
    const target = document.getElementById('projects');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative min-h-[80vh] md:min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-x-hidden pt-4 pb-20 md:pt-20 md:pb-32 lg:pt-8 lg:pb-10 xl:pt-12 xl:pb-16 scroll-mt-24 md:scroll-mt-0">
      {/* Background Decor com Blob Morphing */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] opacity-60 md:opacity-100 pointer-events-none"></div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 xl:gap-20 items-center relative z-10">
        
        {/* Text Content */}
        <div className="flex flex-col items-start space-y-4 md:space-y-6 lg:space-y-5 order-1 pt-0 lg:pt-1">
          
          {/* 1. Badge de Status com Pulse Soft */}
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass-morphism border border-slate-700 rounded-full shadow-lg shadow-black/20">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400/60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-300 tracking-wide">
                {profileBadge}
              </span>
            </div>
          </ScrollReveal>

          {/* 2. Título Principal (H1) */}
          <ScrollReveal delay={80}>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {t('hero.greeting')} {profileName || "..."}
            </h1>
          </ScrollReveal>

          {/* 3. Manchete / Headline (H2) - Gradiente Animado */}
          <ScrollReveal delay={160}>
            <h2 className="text-2xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-green-400 leading-tight">
              {profileHeadline || t('hero.title.highlight')}
            </h2>
          </ScrollReveal>

          {/* 4. Divisor Visual com Border Rotate */}
          <ScrollReveal delay={240}>
            <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full my-2 md:my-4 animate-border-rotate"></div>
          </ScrollReveal>

          {/* 5. Proposta de Valor (H3) */}
          <ScrollReveal delay={320}>
            <h3 className="text-lg md:text-xl text-slate-100 font-bold">
               {profileAction}
            </h3>
          </ScrollReveal>

          {/* 6. Bio / Resumo (P) */}
          <ScrollReveal delay={400}>
            <p className="text-base md:text-lg text-slate-400 mb-6 md:mb-10 max-w-xl leading-relaxed">
              {profileBio || t('hero.description')}
            </p>
          </ScrollReveal>

          {/* 7. CTA Principal */}
          <ScrollReveal delay={480}>
            <div className="flex flex-col gap-4 w-full sm:w-auto pt-2 md:pt-4">
              <a 
                href="#projects" 
                onClick={handleScrollToNext}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-1 text-center"
              >
                {t('hero.cta.more')}
              </a>

              {/* Links sociais secundários */}
              {(profile?.linkedin_url || profile?.git_url) && (
                <div className="flex gap-3">
                  {profile?.linkedin_url && (
                    <a 
                      href={profile.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all flex items-center justify-center"
                      title="LinkedIn"
                      onClick={() => trackEvent({ name: 'external_link_click', props: { type: 'linkedin' } })}
                    >
                      <i className="fa-brands fa-linkedin-in text-lg"></i>
                    </a>
                  )}
                  {profile?.git_url && (
                    <a 
                      href={profile.git_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-10 h-10 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all flex items-center justify-center"
                      title="GitHub"
                      onClick={() => trackEvent({ name: 'external_link_click', props: { type: 'github' } })}
                    >
                      <i className="fa-brands fa-github text-lg"></i>
                    </a>
                  )}
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Image Composition */}
        <div className="order-2 flex justify-center lg:justify-end relative">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 rounded-full blur-3xl -z-10 opacity-60 md:opacity-100"></div>

          <div className="relative w-full max-w-md lg:max-w-sm xl:max-w-md mx-auto">
             <div className="absolute inset-0 border-2 border-slate-700/50 rounded-3xl rotate-6 transform translate-x-4 translate-y-4 z-0"></div>
             
             <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-sm rounded-3xl -rotate-3 transform -translate-x-2 -translate-y-2 z-0"></div>

             <div className="relative rounded-2xl overflow-hidden shadow-2xl z-10 bg-slate-900 border border-slate-700/50 group hover-3d">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-green-500/10 z-20 group-hover:opacity-0 transition-opacity duration-500"></div>
                
                <img 
                  src="https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/image/Matos_sem_fundo.png" 
                  alt={t('hero.avatar_alt')} 
                  className="relative w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out transform group-hover:scale-105"
                />
                
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-20"></div>
             </div>

             <div className="absolute -bottom-8 -left-8 md:-left-12 z-30 glass-morphism border border-slate-700/50 p-4 rounded-2xl shadow-xl flex items-center gap-4 max-w-[200px] hover-scale">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg animate-pulse-soft">
                   <i className="fa-solid fa-code text-lg"></i>
                </div>
                <div>
                   <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t('hero.experience.label')}</p>
                   <p className="text-xl font-bold text-white">{t('hero.experience.value')}</p>
                </div>
             </div>

             <div className="absolute -top-6 -right-6 z-0 text-slate-800/50 text-6xl hover-scale opacity-50 md:opacity-100">
                <i className="fa-brands fa-react"></i>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CompetenciesSection = () => {
  const { t, language } = useI18n();
  const [competencies, setCompetencies] = useState<Competency[]>([]);

  useEffect(() => {
    api.getCompetencies().then(setCompetencies);
  }, []);

  return (
    <section id="skills" className="py-16 md:py-24 bg-slate-950 relative border-b border-slate-900 scroll-mt-24 md:scroll-mt-0">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal delay={0}>
          <div className="text-center mb-12 md:mb-16">
            <span className="text-indigo-500 font-semibold tracking-wider uppercase text-sm mb-2 block">{t('nav.skills')}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-50 mb-4">{t('skills.title')}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">{t('skills.subtitle')}</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {competencies.map((comp, idx) => (
            <ScrollReveal key={comp.id} delay={idx * 80}>
              <div 
                className="group flex flex-col h-full glass-morphism border border-slate-800 rounded-2xl p-5 md:p-6 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover-3d"
              >
              {/* Header: Ícone Circular Translúcido */}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center ring-1 ring-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:ring-indigo-500/40 transition-all duration-300 hover-scale glow-effect">
                   <i className={`${comp.icon} text-xl text-indigo-400 group-hover:text-indigo-300 transition-colors`}></i>
                </div>
              </div>

              {/* Título e Subtítulo */}
              <div className="mb-4">
                 <h3 className="text-base md:text-lg font-bold text-white mb-2 group-hover:text-indigo-100 transition-colors">
                    {selectLocalizedColumn(comp, 'title', language) || comp.title}
                 </h3>
                 {comp.subtitle && (
                  <p className="text-sm text-slate-500 font-normal leading-relaxed">
                    {selectLocalizedColumn(comp, 'subtitle', language) || comp.subtitle}
                  </p>
                 )}
              </div>
              
              {/* Lista de Tópicos com Linha Vertical */}
              <div className="mt-4 space-y-3">
                {(selectLocalizedArray(comp, 'items', language).length
                  ? selectLocalizedArray(comp, 'items', language)
                  : comp.items
                )?.map((item, idx) => (
                   <div 
                     key={idx} 
                     className="relative pl-3 border-l-2 border-indigo-500/30 group-hover/item:border-indigo-500 transition-all duration-300 group/line"
                   >
                     <p className="text-sm text-slate-400 font-medium group-hover/line:text-white transition-colors">
                       {item}
                     </p>
                   </div>
                ))}
              </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechStackSection = ({ onProjectSelect }: { onProjectSelect?: (projectId: string) => void }) => {
  const { t, language } = useI18n();
  const [skills, setSkills] = useState<SkillWithProjects[]>([]);

  useEffect(() => {
    api.getSkillsWithProjects().then(setSkills);
  }, []);

  return (
    <section id="tech" className="py-16 md:py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-slate-950 to-slate-950 pointer-events-none"></div>
      <div className="container mx-auto px-6 relative z-10">
        <ScrollReveal delay={0}>
          <div className="text-center mb-12 md:mb-16">
            <span className="text-indigo-500 font-semibold tracking-wider uppercase text-sm mb-2 block">{t('tech.badge')}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-50 mb-4">{t('tech.title')}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">{t('tech.subtitle')}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={40}>
          <TechGroups skills={skills} language={language} onProjectSelect={onProjectSelect} />
        </ScrollReveal>
      </div>
    </section>
  );
};

const ProjectsSection = ({ highlightProjectId }: { highlightProjectId?: string | null }) => {
  const { t, language } = useI18n();
  const [projects, setProjects] = useState<ProjectWithSkills[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerScreen, setItemsPerScreen] = useState(3);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    api.getProjectsWithSkills().then(setProjects);

    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerScreen(1);
      else if (window.innerWidth < 1024) setItemsPerScreen(2);
      else setItemsPerScreen(3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!highlightProjectId || projects.length === 0) return;
    const targetIndex = projects.findIndex((project) => project.id === highlightProjectId);
    if (targetIndex === -1) return;
    const maxIndex = Math.max(0, projects.length - itemsPerScreen);
    const nextIndex = Math.min(targetIndex, maxIndex);
    setCurrentIndex(nextIndex);
  }, [highlightProjectId, itemsPerScreen, projects]);

  const formatSkill = (skillName: string) => skillName.trim();

  const nextSlide = () => {
    const maxIndex = Math.max(0, projects.length - itemsPerScreen);
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const isAtStart = currentIndex === 0;
  const isAtEnd = currentIndex >= projects.length - itemsPerScreen;
  const swipeThreshold = 40;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.innerWidth >= 768) return;
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    touchDelta.current = { x: 0, y: 0 };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.innerWidth >= 768 || !touchStart.current) return;
    const touch = e.touches[0];
    touchDelta.current = {
      x: touch.clientX - touchStart.current.x,
      y: touch.clientY - touchStart.current.y,
    };
  };

  const handleTouchEnd = () => {
    if (window.innerWidth >= 768 || !touchStart.current) return;
    const { x, y } = touchDelta.current;
    if (Math.abs(x) > Math.abs(y) && Math.abs(x) > swipeThreshold) {
      if (x < 0) nextSlide();
      if (x > 0) prevSlide();
    }
    touchStart.current = null;
  };

  return (
    <section id="projects" className="py-16 md:py-24 bg-slate-950 scroll-mt-24 md:scroll-mt-0">
      <div className="container mx-auto px-6">
        <ScrollReveal delay={0}>
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16">
            <div>
              <span className="text-indigo-500 font-semibold tracking-wider uppercase text-sm mb-2 block">{t('projects.badge')}</span>
              <h2 className="text-2xl md:text-4xl font-bold text-slate-50 mb-4">{t('projects.title')}</h2>
              <p className="text-slate-400 max-w-xl text-base md:text-lg leading-relaxed">{t('projects.subtitle')}</p>
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
        </ScrollReveal>

        {/* Carousel Container */}
        <div
          className="relative overflow-hidden -mx-2 p-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-0 md:gap-8"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerScreen)}%)` }}
          >
            {projects.map((project, idx) => (
              <div 
                key={project.id} 
                className="flex-shrink-0 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)] flex justify-center md:justify-start"
              >
                <ScrollReveal delay={idx * 80}>
                  <div
                    id={`project-${project.id}`}
                    className={`h-full group glass-morphism border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all duration-300 flex flex-col hover-3d w-[92%] md:w-full ${
                      highlightProjectId === project.id
                        ? 'ring-2 ring-indigo-500/60 shadow-[0_0_40px_-18px_rgba(99,102,241,0.9)]'
                        : ''
                    }`}
                  >
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent z-10 transition-colors"></div>
                    <img 
                      src={project.image_url || "https://picsum.photos/800/600"} 
                      alt={project.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 md:p-6 flex-1 flex flex-col">
                    <div className="mb-2">
                       {!project.live_url && (
                         <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wider text-amber-300 border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 rounded-full mb-2">
                           {t('projects.status.prep')}
                         </span>
                       )}
                       <h3 className="text-base md:text-xl font-bold text-slate-100">
                         {selectLocalizedColumn(project, 'title', language) || project.title}
                       </h3>
                       {project.role && (
                         <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                           {selectLocalizedColumn(project, 'role', language) || project.role}
                         </p>
                       )}
                    </div>
                    <p className="text-slate-400 text-sm md:text-base mb-3 md:mb-4 line-clamp-3 leading-snug md:leading-relaxed">
                      {selectLocalizedColumn(project, 'description', language) || project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                      {(project.skills || []).map((skill) => (
                        <span
                          key={skill.id}
                          className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700"
                        >
                          {formatSkill(skill.name)}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-auto flex gap-4 pt-4 border-t border-slate-900">
                       {project.live_url && (
                         <a
                           href={project.live_url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-xs md:text-sm font-medium text-slate-200 hover:text-indigo-400 flex items-center"
                           onClick={() => trackEvent({ name: 'project_open', props: { type: 'live', id: project.id } })}
                         >
                           <i className="fa-solid fa-arrow-up-right-from-square mr-2"></i> {t('projects.liveDemo')}
                         </a>
                       )}
                       {project.github_url && (
                         <a
                           href={project.github_url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-xs md:text-sm font-medium text-slate-500 hover:text-white flex items-center"
                           onClick={() => trackEvent({ name: 'project_open', props: { type: 'code', id: project.id } })}
                         >
                           <i className="fa-brands fa-github mr-2"></i> {t('projects.code')}
                         </a>
                       )}
                    </div>
                  </div>
                </div>
                </ScrollReveal>
              </div>
            ))}
            {projects.length === 0 && (
                    <div className="w-full text-center py-10 text-slate-500">
                    {t('projects.empty')}
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
    
    trackEvent({ name: 'external_link_click', props: { type: 'whatsapp', source: 'contact_form' } });
    // Abre em nova aba
    window.open(url, '_blank');
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-slate-950 relative overflow-hidden scroll-mt-24 md:scroll-mt-0">
      <div className="container mx-auto px-6">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
           {/* Form */}
           <ScrollReveal delay={0}>
             <div className="glass-morphism p-5 md:p-6 rounded-2xl border border-slate-800 hover-3d">
             <h3 className="text-xl md:text-2xl font-bold text-slate-50 mb-5">{t('contact.title')}</h3>
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
                      placeholder={t('contact.placeholder.name')} 
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
                      placeholder={t('contact.placeholder.email')} 
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
                    placeholder={t('contact.placeholder.subject')} 
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
                    placeholder={t('contact.placeholder.message')}
                    required
                   ></textarea>
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-600/20 inline-flex items-center justify-center">
                  <i className="fa-brands fa-whatsapp mr-3 text-2xl"></i>
                  {t('contact.send')}
                </button>
             </form>
           </div>
           </ScrollReveal>

           {/* Info */}
           <ScrollReveal delay={200}>
             <div className="flex flex-col justify-center space-y-10">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold text-slate-50 mb-5">
                  {t('contact.touch.title')}
                </h2>
                <p className="text-base md:text-lg text-slate-400 leading-relaxed">
                  {t('contact.touch.desc')}
                </p>
              </div>

              <div className="space-y-6">
                 <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                      <i className="fa-solid fa-envelope text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-slate-100 font-medium text-lg">{t('contact.touch.email')}</h4>
                      <a
                        href={`mailto:${profile?.email_contact || "hello@alexdev.com"}`}
                        className="text-slate-400 hover:text-white transition-colors"
                        onClick={() => trackEvent({ name: 'external_link_click', props: { type: 'email' } })}
                      >
                        {profile?.email_contact || "hello@alexdev.com"}
                      </a>
                    </div>
                 </div>
                 {profile?.linkedin_url && (
                   <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                        <i className="fa-brands fa-linkedin-in text-xl"></i>
                      </div>
                      <div>
                        <h4 className="text-slate-100 font-medium text-lg">{t('contact.social.linkedin')}</h4>
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          className="text-slate-400 hover:text-white transition-colors"
                          onClick={() => trackEvent({ name: 'external_link_click', props: { type: 'linkedin' } })}
                        >
                          {t('contact.view_profile')}
                        </a>
                      </div>
                   </div>
                 )}
                 {profile?.git_url && (
                   <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                        <i className="fa-brands fa-github text-xl"></i>
                      </div>
                      <div>
                        <h4 className="text-slate-100 font-medium text-lg">{t('contact.social.github')}</h4>
                        <a
                          href={profile.git_url}
                          target="_blank"
                          className="text-slate-400 hover:text-white transition-colors"
                          onClick={() => trackEvent({ name: 'external_link_click', props: { type: 'github' } })}
                        >
                          {t('contact.view_profile')}
                        </a>
                      </div>
                   </div>
                 )}
              </div>

              
             </div>
           </ScrollReveal>
         </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  const [highlightProjectId, setHighlightProjectId] = useState<string | null>(null);

  const handleProjectSelect = (projectId: string) => {
    setHighlightProjectId(projectId);
    const section = document.getElementById('projects');
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      const card = document.getElementById(`project-${projectId}`);
      card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300);
    setTimeout(() => setHighlightProjectId(null), 2600);
  };

  return (
    <Layout>
      <HeroSection />
      <ProjectsSection highlightProjectId={highlightProjectId} />
      <VerticalJourney /> {/* Novo Componente Injetado */}
      <CompetenciesSection />
      <TechStackSection onProjectSelect={handleProjectSelect} />
      <ContactSection />
    </Layout>
  );
};

export default Home;
