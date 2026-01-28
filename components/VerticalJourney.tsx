import React, { useState, useEffect, useCallback } from 'react';
import { JourneyItem } from '../types';
import { api } from '../services/api';

// Dados de fallback caso a API não retorne nada
const MOCK_JOURNEY: JourneyItem[] = [
  {
    id: '1',
    title: 'Senior Frontend Architect',
    company: 'TechFlow Solutions',
    period: '2021 – Atual',
    description: 'Liderando a migração para React 18 e definindo padrões de arquitetura para escalabilidade.',
    type: 'work',
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
    type: 'work',
    display_order: 3
  }
];

const VerticalJourney: React.FC = () => {
  const [items, setItems] = useState<JourneyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');

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

  const transformClass = isAnimating 
    ? (direction === 'down' ? '-translate-y-8 opacity-0' : 'translate-y-8 opacity-0')
    : 'translate-y-0 opacity-100';

  return (
    <section id="experience" className="relative bg-slate-950 overflow-hidden min-h-[800px] flex flex-col lg:flex-row border-t border-slate-900">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* --- SIDEBAR TEXTO (Esquerda) --- */}
      <div className="w-full lg:w-[40%] p-8 lg:p-20 flex flex-col justify-center relative z-10 bg-slate-900/50 backdrop-blur-sm lg:border-r border-slate-800">
         <div className="max-w-md">
            <span className="text-indigo-500 font-mono text-sm tracking-wider uppercase mb-4 block">
                Carreira & Educação
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Minha<br />Jornada
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mb-8"></div>
            <p className="text-slate-400 text-lg leading-relaxed">
                Uma linha do tempo da minha carreira profissional e formação educacional, mostrando meu crescimento e marcos importantes.
            </p>
         </div>
      </div>

      {/* --- TIMELINE INTERATIVA (Direita) --- */}
      <div className="w-full lg:w-[60%] p-6 lg:p-20 flex items-center justify-center relative z-10">
         
         <div className="flex w-full max-w-4xl gap-8 md:gap-12 items-center">
            
            {/* 1. TRILHA DA TIMELINE (CONTROLES) */}
            <div className="flex flex-col items-center shrink-0 py-4 h-[400px] justify-between relative">
                
                {/* Linha Vertical de Fundo */}
                <div className="absolute top-12 bottom-12 left-1/2 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-slate-700/50 z-0"></div>

                {/* Botão Cima */}
                <button 
                    onClick={handlePrev}
                    className="z-10 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-600 transition-all flex items-center justify-center shadow-lg"
                >
                    <i className="fa-solid fa-chevron-up text-sm"></i>
                </button>

                {/* Nós da Timeline (Pontos) */}
                <div className="flex-1 flex flex-col justify-center gap-6 z-10 py-4">
                    {items.map((item, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                            <button
                                key={item.id}
                                onClick={() => changeSlide(idx)}
                                className={`group relative flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-125' : 'hover:scale-110'}`}
                            >
                                {/* Tooltip no Hover (Só mostra se não for o ativo para não poluir) */}
                                {!isActive && (
                                    <span className="absolute left-8 px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {item.period.split('–')[0]} {/* Mostra só o ano inicial */}
                                    </span>
                                )}

                                {/* O Ponto */}
                                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    isActive 
                                    ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)] ring-4 ring-indigo-500/20' 
                                    : 'bg-slate-700 group-hover:bg-slate-500'
                                }`}></div>

                                {/* Linha Conectora Ativa (Liga o ponto ao Card) */}
                                {isActive && (
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 md:w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-transparent"></div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Botão Baixo */}
                <button 
                    onClick={handleNext}
                    className="z-10 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-indigo-600 transition-all flex items-center justify-center shadow-lg"
                >
                    <i className="fa-solid fa-chevron-down text-sm"></i>
                </button>
            </div>


            {/* 2. O CARD (CONTEÚDO) */}
            <div className="flex-1 min-w-0"> {/* min-w-0 evita overflow em flex children */}
                <div 
                  className={`
                     relative w-full bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-8 md:p-10 shadow-2xl
                     transition-all duration-500 ease-out
                     ${transformClass}
                  `}
                >
                   {/* Background Decor */}
                   <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none overflow-hidden rounded-2xl">
                      <i className={`fa-solid ${activeItem.type === 'work' ? 'fa-briefcase' : 'fa-graduation-cap'} text-9xl -mr-4 -mt-4`}></i>
                   </div>

                   {/* Header do Card */}
                   <div className="relative z-10">
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
                            activeItem.type === 'work' 
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                         }`}>
                            {activeItem.type === 'work' ? 'Experiência' : 'Formação'}
                         </span>
                         <span className="flex items-center gap-2 text-slate-400 text-sm font-mono bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50">
                            <i className="fa-regular fa-calendar text-xs"></i>
                            {activeItem.period}
                         </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                         {activeItem.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-lg text-slate-400 mb-8 font-medium">
                         <i className="fa-solid fa-building-columns text-slate-600 text-sm"></i>
                         {activeItem.company}
                      </div>

                      {/* Descrição com linha lateral decorativa */}
                      <div className="relative pl-6 border-l-2 border-indigo-500/30">
                         <p className="text-slate-300 text-lg leading-relaxed">
                            {activeItem.description}
                         </p>
                      </div>
                   </div>
                   
                   {/* Efeito Glow atrás do card para o item ativo */}
                   <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-10 -z-10 transition-opacity duration-500"></div>
                </div>
                
                {/* Contador Mobile (só aparece se a tela for pequena e a timeline lateral sumir/quebrar, mas pelo design mantivemos a timeline visivel) */}
                <div className="mt-4 text-center text-xs text-slate-600 font-mono lg:hidden">
                    {currentIndex + 1} de {items.length}
                </div>
            </div>

         </div>
      </div>
    </section>
  );
};

export default VerticalJourney;