import React from 'react';

type TechStackCardProps = {
  icon: string;
  name: string;
};

const cardShell =
  'group relative rounded-2xl border border-slate-800/80 bg-slate-900/45 p-5 md:p-6 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 focus-visible:ring-offset-0 hover:-translate-y-1 hover:border-indigo-400/50 hover:shadow-[0_18px_50px_-24px_rgba(99,102,241,0.8)]';
const glowLayer =
  'pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/12 via-transparent to-cyan-500/12 opacity-0 transition-opacity duration-300 group-hover:opacity-100';
const borderLayer =
  'pointer-events-none absolute -inset-px rounded-2xl border border-indigo-500/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100';
const iconShell =
  'flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950/50 ring-1 ring-slate-700/60 text-3xl text-slate-200 transition-all duration-300 group-hover:text-white group-hover:ring-indigo-500/45';
const nameStyle =
  'text-sm md:text-base font-semibold tracking-[0.12em] uppercase text-slate-100';

const TechStackCard: React.FC<TechStackCardProps> = ({ icon, name }) => (
  <div className={cardShell} tabIndex={0} aria-label={name}>
    <div className={glowLayer}></div>
    <div className={borderLayer}></div>
    <div className="relative flex flex-col items-center gap-4">
      <div className={iconShell}>
        <i className={icon}></i>
      </div>
      <h3 className={nameStyle}>{name}</h3>
    </div>
  </div>
);

export default TechStackCard;
