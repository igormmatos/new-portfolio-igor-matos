import React, { useState, useEffect, useCallback, useRef } from 'react';
import { JourneyItem } from '../types';
import { api } from '../services/api';
import ScrollReveal from './ScrollReveal';
import RichTextContent from './RichTextContent';
import { useI18n, selectLocalizedColumn } from '../i18n';

// Dados de fallback caso a API não retorne nada
const MOCK_JOURNEY: JourneyItem[] = [
  {
    id: '1',
    title: 'Senior Frontend Architect',
    company: 'TechFlow Solutions',
    period: '2021 – Atual',
    description: 'Liderando a migração para React 18 e definindo padrões de arquitetura para escalabilidade.',
    type: 'experience',
    display_order: 1
  },
  {
    id: '2',
    title: 'MBA em IA e Gestão',
    company: 'Tech University',
    period: '2019 – 2020',
    description: 'Especialização em aplicação de inteligência artificial em processos de negócio.',
    type: 'education',
    display_order: 2
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'Creative Pulse',
    period: '2017 – 2021',
    description: 'Desenvolvimento de aplicações web de alta performance utilizando Node.js e React.',
    type: 'experience',
    display_order: 3
  }
];

const CV_URL =
  'https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/src/CV-Igor-MATOS.pdf';

const VerticalJourney: React.FC = () => {
  const { t, language } = useI18n();
  const [items, setItems] = useState<JourneyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchDelta = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getJourney();
        if (data && data.length > 0) {
          setItems(data);
        } else {
          setItems(MOCK_JOURNEY);
        }
      } catch (error) {
        console.error("Erro ao carregar jornada, usando mock", error);
        setItems(MOCK_JOURNEY);
      }
    };
    fetchData();
  }, []);

  const changeSlide = useCallback((newIndex: number) => {
    if (newIndex === currentIndex) return;
    setDirection(newIndex > currentIndex ? 'down' : 'up');
    setIsAnimating(true);
    setTimeout(() => {
        setCurrentIndex(newIndex);
        setIsAnimating(false);
    }, 300);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (items.length === 0) return;
    const nextIndex = (currentIndex + 1) % items.length;
    changeSlide(nextIndex);
  }, [items.length, currentIndex, changeSlide]);

  const handlePrev = useCallback(() => {
    if (items.length === 0) return;
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    changeSlide(prevIndex);
  }, [items.length, currentIndex, changeSlide]);

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
      if (x < 0) handleNext();
      if (x > 0) handlePrev();
    }
    touchStart.current = null;
  };

  // Navegação por Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  if (items.length === 0) return null;

  const activeItem = items[currentIndex];
  const activeTitle = selectLocalizedColumn(activeItem, 'title', language) || activeItem.title;
  const activeCompany = selectLocalizedColumn(activeItem, 'company', language) || activeItem.company;
  const activePeriod = selectLocalizedColumn(activeItem, 'period', language) || activeItem.period;
  const activeDescription = selectLocalizedColumn(activeItem, 'description', language) || activeItem.description;

  const transformClass = isAnimating 
    ? (direction === 'down' ? '-translate-y-8 opacity-0' : 'translate-y-8 opacity-0')
    : 'translate-y-0 opacity-100';

  return (
    <section id="experience" className="relative bg-slate-950 overflow-hidden py-16 md:py-24 border-t border-slate-900 scroll-mt-24 md:scroll-mt-0">
      
      {/* Background Decor Simétrico com Blob Morphing */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] opacity-60 md:opacity-100 pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">

        {/* --- HEADER CENTRALIZADO --- */}
        <ScrollReveal delay={0}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-indigo-500 font-semibold tracking-wider uppercase text-sm mb-2 block">
                {t('experience.badge')}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-50 mb-4">
                {t('experience.title')}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mx-auto mb-6"></div>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                {t('experience.subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* --- CONTEÚDO DA TIMELINE (Trilha + Card) --- */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-start justify-center gap-8 md:gap-16">
            
            {/* 1. TRILHA DA TIMELINE (Lateral Esquerda do Card) - visível apenas em telas médias+ */}
            <div className="hidden md:flex md:flex-col items-center shrink-0 py-4 h-[350px] justify-between relative order-1 md:order-1 md:sticky md:top-24">
                
                {/* Linha Vertical de Fundo */}
                <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-slate-700/50 z-0"></div>

                {/* Botão Cima */}
                <button 
                    onClick={handlePrev}
                    className="z-10 w-10 h-10 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-600 hover:bg-indigo-600 transition-all flex items-center justify-center"
                    aria-label={t('experience.nav.prev')}
                >
                    <i className="fa-solid fa-chevron-up text-sm"></i>
                </button>

                {/* Nós da Timeline (Pontos) */}
                <div className="flex-1 flex flex-col justify-center gap-8 z-10 py-4">
                    {items.map((item, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                            <button
                                key={item.id}
                                onClick={() => changeSlide(idx)}
                                className={`group relative flex items-center justify-center transition-all duration-300 outline-none ${isActive ? 'scale-125' : 'hover:scale-110'}`}
                            >
                                {/* DATA LABEL (SEMPRE VISÍVEL) */}
                                <span className={`absolute right-full mr-6 py-1 px-2 rounded text-xs font-semibold whitespace-nowrap border transition-all duration-300
                                    ${isActive 
                                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 font-bold shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                                        : 'bg-slate-900 text-slate-500 border-slate-800 opacity-70 group-hover:opacity-100'
                                    }`}
                                >
                                    {(selectLocalizedColumn(item, 'period', language) || item.period).split('–')[0]}
                                </span>

                                {/* O Ponto */}
                                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    isActive 
                                    ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] ring-4 ring-indigo-500/20' 
                                    : 'bg-slate-700 group-hover:bg-slate-500'
                                }`}></div>

                                {/* Linha Conectora Ativa (Direita -> Card) */}
                                {isActive && (
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 md:w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent hidden md:block"></div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Botão Baixo */}
                <button 
                    onClick={handleNext}
                    className="z-10 w-10 h-10 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-600 hover:bg-indigo-600 transition-all flex items-center justify-center"
                    aria-label={t('experience.nav.next')}
                >
                    <i className="fa-solid fa-chevron-down text-sm"></i>
                </button>
            </div>

            {/* 2. O CARD (Direita) */}
            <div
              className="flex-1 w-full md:w-auto min-w-0 order-2 md:order-2"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
                <div 
                  className={`
                     relative w-full glass-morphism border border-slate-800 rounded-2xl p-5 md:p-6 shadow-2xl
                     transition-all duration-500 ease-out flex flex-col md:min-h-[350px] justify-center hover-3d
                     ${transformClass}
                  `}
                >
                   {/* Background Icon Decor */}
                   <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none overflow-hidden rounded-2xl">
                      <i className={`fa-solid ${activeItem.type === 'experience' ? 'fa-briefcase' : 'fa-graduation-cap'} text-[10rem] -mr-8 -mt-8`}></i>
                   </div>

                   {/* Header do Card */}
                   <div className="relative z-10">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                            activeItem.type === 'experience'
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                         }`}>
                            {activeItem.type === 'experience' ? t('experience.type.work') : t('experience.type.education')}
                         </span>
                         <span className="flex items-center gap-2 text-slate-400 text-sm font-medium bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                            <i className="fa-regular fa-calendar text-xs"></i>
                            {activePeriod}
                         </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-slate-50 mb-2 leading-tight">
                         {activeTitle}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-base md:text-lg text-slate-400 mb-6 font-medium">
                         <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-500">
                            <i className="fa-solid fa-building text-sm"></i>
                         </div>
                         {activeCompany}
                      </div>

                      {/* Descrição */}
                      <div className="relative border-t border-slate-800/50 pt-6">
                         <RichTextContent
                           html={activeDescription}
                           className="text-slate-400 text-base md:text-lg leading-relaxed"
                         />
                      </div>
                   </div>
                   
                   {/* Efeito Glow Colorido Bottom */}
                   <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${activeItem.type === 'experience' ? 'from-indigo-600 via-blue-600 to-indigo-600' : 'from-emerald-600 via-green-600 to-emerald-600'} opacity-50`}></div>
                </div>

                {/* Navegação e paginação Mobile (quando a linha do tempo lateral não aparece) */}
                <div className="mt-6 lg:hidden flex items-center justify-center gap-4">
                  <button
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-600 hover:bg-indigo-600 transition-all flex items-center justify-center"
                    aria-label={t('experience.nav.prev_full')}
                  >
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>

                  <div className="flex justify-center gap-2">
                    {items.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === currentIndex ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-800'
                        }`}
                      ></div>
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-600 hover:bg-indigo-600 transition-all flex items-center justify-center"
                    aria-label={t('experience.nav.next_full')}
                  >
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </div>
            </div>

        </div>

        <ScrollReveal delay={260}>
          <div className="mt-10 md:mt-12 flex justify-center">
            <a
              href={CV_URL}
              target="_blank"
              rel="noopener noreferrer"
              download="CV-Igor-MATOS.pdf"
              className="inline-flex items-center gap-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-6 py-3 text-sm md:text-base font-semibold text-indigo-200 hover:bg-indigo-500/20 hover:border-indigo-400/50 transition-all"
              aria-label="Baixar currículo em PDF"
            >
              <i className="fa-solid fa-file-arrow-down"></i>
              Baixar Currículo (PDF)
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default VerticalJourney;
