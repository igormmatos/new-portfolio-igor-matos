import React from 'react';
import Layout from '../components/Layout';
import { skills, getExperience, getProjects, getServices } from '../data';
import { useI18n } from '../i18n';

const HeroSection = () => {
  const { t } = useI18n();
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 lg:py-0">
      {/* Background Decor - Adjusted for better centering */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Text Content */}
        <div className="space-y-8 order-2 lg:order-1 pt-10 lg:pt-0">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full backdrop-blur-sm shadow-lg shadow-black/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-slate-300 tracking-wide">{t('hero.badge')}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-slate-50 tracking-tight">
            {t('hero.title.prefix')} <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-blue-400 to-green-400">
              {t('hero.title.highlight')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed font-light">
            {t('hero.description')}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a href="#contact" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-1">
              {t('hero.cta.primary')}
            </a>
            <a href="#projects" className="px-8 py-4 bg-transparent border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl font-medium transition-all hover:-translate-y-1">
              {t('hero.cta.secondary')}
            </a>
          </div>
        </div>

        {/* Image Composition */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
          
          {/* Central Glow behind image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

          <div className="relative w-full max-w-md mx-auto">
             {/* Decorative Frame Back */}
             <div className="absolute inset-0 border-2 border-slate-700/50 rounded-3xl rotate-6 transform translate-x-4 translate-y-4 z-0"></div>
             
             {/* Decorative Fill Back */}
             <div className="absolute inset-0 bg-slate-800/40 backdrop-blur-sm rounded-3xl -rotate-3 transform -translate-x-2 -translate-y-2 z-0"></div>

             {/* Main Image Container */}
             <div className="relative rounded-2xl overflow-hidden shadow-2xl z-10 bg-slate-900 border border-slate-700/50 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-green-500/10 z-20 group-hover:opacity-0 transition-opacity duration-500"></div>
                
                <img 
                  src="https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/image/Matos_sem_fundo.png" 
                  alt="Alex Avatar" 
                  className="relative w-full h-auto object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out transform group-hover:scale-105"
                />
                
                {/* Bottom Fade Gradient - Crucial for blending */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent z-20"></div>
             </div>

             {/* Floating Glass Card (Badge) */}
             <div className="absolute -bottom-8 -left-8 md:-left-12 z-30 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float max-w-[200px]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg">
                   <i className="fa-solid fa-code text-lg"></i>
                </div>
                <div>
                   <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Experience</p>
                   <p className="text-xl font-bold text-white">5+ Years</p>
                </div>
             </div>

             {/* Top Right Decorative Icon */}
             <div className="absolute -top-6 -right-6 z-0 text-slate-800/50 text-6xl animate-pulse">
                <i className="fa-brands fa-react"></i>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SkillsSection = () => {
  const { t } = useI18n();
  return (
    <section id="skills" className="py-24 bg-slate-900 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">{t('skills.title')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">{t('skills.subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div 
              key={skill.id}
              className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:-translate-y-1 hover:border-indigo-500 transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4 group-hover:bg-indigo-500/10 transition-colors">
                  <i className={`${skill.icon} text-3xl text-slate-400 group-hover:text-indigo-400 transition-colors`}></i>
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3">{skill.name}</h3>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" 
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
  const { t, language } = useI18n();
  const experience = getExperience(language);

  return (
    <section id="experience" className="py-24 bg-slate-955">
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
                        <h3 className="text-xl font-bold text-white">{item.role}</h3>
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
  const { t, language } = useI18n();
  const projects = getProjects(language);

  return (
    <section id="projects" className="py-24 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">{t('projects.title')}</h2>
            <p className="text-slate-400 max-w-xl">{t('projects.subtitle')}</p>
          </div>
          <a href="#" className="hidden md:inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium mt-4 md:mt-0">
            {t('projects.viewGithub')} <i className="fa-brands fa-github ml-2"></i>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all duration-300 flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent z-10 transition-colors"></div>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-100 mb-2">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto flex gap-4 pt-4 border-t border-slate-900">
                   <a href={project.demoLink} className="text-sm font-medium text-white hover:text-indigo-400 flex items-center">
                     <i className="fa-solid fa-arrow-up-right-from-square mr-2"></i> {t('projects.liveDemo')}
                   </a>
                   <a href={project.codeLink} className="text-sm font-medium text-slate-500 hover:text-white flex items-center">
                     <i className="fa-brands fa-github mr-2"></i> {t('projects.code')}
                   </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const { t, language } = useI18n();
  const services = getServices(language);

  return (
    <section id="services" className="py-24 bg-slate-950">
       <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-4">{t('services.title')}</h2>
          <p className="text-slate-400">{t('services.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
             <div key={service.id} className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 overflow-hidden hover:border-indigo-500/50 transition-colors group">
                <i className={`${service.icon} absolute -right-6 -top-6 text-9xl text-slate-800 opacity-10 group-hover:opacity-20 group-hover:text-indigo-500 transition-all duration-500`}></i>
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center mb-6 text-indigo-400 text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <i className={service.icon}></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="inline-flex items-center px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <span className="text-xs font-medium text-green-400 uppercase tracking-wide mr-2">{t('services.startsAt')}</span>
                    <span className="text-lg font-bold text-green-400">${service.priceStart}</span>
                  </div>
                </div>
             </div>
          ))}
        </div>
       </div>
    </section>
  );
};

const ContactSection = () => {
  const { t } = useI18n();
  return (
    <section id="contact" className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-6">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
           {/* Form */}
           <div className="bg-slate-950 p-8 md:p-10 rounded-3xl border border-slate-800">
             <h3 className="text-2xl font-bold text-white mb-6">{t('contact.title')}</h3>
             <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">{t('contact.name')}</label>
                    <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">{t('contact.email')}</label>
                    <input type="email" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-400">{t('contact.subject')}</label>
                   <input type="text" className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600" placeholder="Project Inquiry" />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-400">{t('contact.message')}</label>
                   <textarea rows={4} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-slate-600" placeholder="Tell me about your project..."></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition-all">
                  {t('contact.send')}
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
                      <p className="text-slate-400">hello@alexdev.com</p>
                    </div>
                 </div>
                 <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
                      <i className="fa-solid fa-location-dot text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">{t('contact.touch.location')}</h4>
                      <p className="text-slate-400">San Francisco, CA</p>
                    </div>
                 </div>
              </div>

              <div className="pt-8">
                 <a href="#" className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-green-600/20">
                   <i className="fa-brands fa-whatsapp mr-3 text-2xl"></i> {t('contact.touch.whatsapp')}
                 </a>
              </div>
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
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ServicesSection />
      <ContactSection />
    </Layout>
  );
};

export default Home;