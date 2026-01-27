import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n, Language } from '../i18n';
import { api } from '../services/api';
import { ProfileInfo } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  const currentLang = languages.find(l => l.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-700 hover:border-indigo-500 bg-slate-900/50 backdrop-blur-md transition-all text-slate-300 hover:text-white group"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-xs font-semibold uppercase tracking-wide group-hover:text-indigo-400 transition-colors">
          {language === 'pt-BR' ? 'BR' : language.toUpperCase()}
        </span>
        <i className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      <div className={`absolute top-full right-0 mt-3 w-40 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-top-right ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
        <div className="py-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                language === lang.code 
                  ? 'bg-indigo-600/10 text-indigo-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.label}</span>
              {language === lang.code && <i className="fa-solid fa-check ml-auto text-xs"></i>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface NavbarProps {
  profile: ProfileInfo | null;
}

const Navbar: React.FC<NavbarProps> = ({ profile }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.includes('admin');
  const { t } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), href: '#' },
    { name: t('nav.skills'), href: '#skills' },
    { name: t('nav.experience'), href: '#experience' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  const logoAlt = profile?.display_name ? `${profile.display_name} Logo` : 'Logo';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/image/logo_sem_fundo.png" 
            alt={logoAlt} 
            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </Link>

        {/* Desktop Nav */}
        {!isAdmin && (
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-indigo-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}

        {/* Action Button & Lang Switcher */}
        <div className="flex items-center space-x-4">
           <LanguageSwitcher />
           
           {isAdmin ? (
             <Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block">
               <i className="fa-solid fa-arrow-left mr-2"></i> {t('nav.back')}
             </Link>
           ) : (
             <Link
              to="/admin"
              className="px-5 py-2 text-sm font-semibold rounded-full border border-slate-700 hover:border-indigo-500 hover:text-indigo-400 transition-all duration-300 hidden sm:block"
            >
              {t('nav.admin')}
            </Link>
           )}
        </div>
      </div>
    </nav>
  );
};

interface FooterProps {
  profile: ProfileInfo | null;
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div className="mb-6 md:mb-0 flex flex-col items-start">
             <img 
               src="https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/image/logo_sem_fundo.png" 
               alt={profile?.display_name ? `${profile.display_name} Logo` : 'Logo'} 
               className="h-10 w-auto object-contain mb-4 opacity-90" 
             />
             <p className="mt-2 text-slate-500 max-w-sm text-sm">
               {profile?.action_phrase || t('footer.tagline')}
             </p>
          </div>
          <div className="flex space-x-6">
            <a href={profile?.git_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300">
              <i className="fa-brands fa-github"></i>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-blue-500 hover:text-white transition-all duration-300">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href={profile?.linkedin_url || "#"} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white transition-all duration-300">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          </div>
        </div>
        <div className="border-t border-slate-900 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} {profile?.display_name || "Portfólio"}. {t('footer.rights')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400">{t('footer.privacy')}</a>
            <a href="#" className="text-xs text-slate-600 hover:text-slate-400">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileInfo | null>(null);

  useEffect(() => {
    // Busca o perfil uma vez no nível do layout para compartilhar entre Navbar e Footer
    api.getProfile().then(setProfile);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar profile={profile} />
      <main className="flex-grow pt-20">
        {children}
      </main>
      
      {/* Botão Flutuante do WhatsApp (FAB) */}
      {profile?.whatsapp && (
        <a 
          href={`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent("Olá, vi o seu portfólio e gostaria de conversar um pouco mais!")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-bounce-slow group"
          aria-label="Conversar no WhatsApp"
        >
          <i className="fa-brands fa-whatsapp text-3xl"></i>
          <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700 pointer-events-none shadow-lg">
             Fale Comigo
          </span>
        </a>
      )}

      <Footer profile={profile} />
    </div>
  );
};

export default Layout;