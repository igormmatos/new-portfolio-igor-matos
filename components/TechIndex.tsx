import React, { useMemo, useState } from 'react';
import { Project, TechnicalSkill } from '../types';
import { selectLocalizedColumn } from '../i18n';

type TechIndexProps = {
  skills: TechnicalSkill[];
  projects: Project[];
  language: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

const parseTech = (tech: string) => {
  if (!tech) return [];
  return tech.split(',').map((item) => item.trim()).filter(Boolean);
};

const TechIndex: React.FC<TechIndexProps> = ({ skills, projects, language }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const techMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string; icon: string }>();
    skills.forEach((skill) => {
      const name = selectLocalizedColumn(skill, 'name', language) || skill.name;
      map.set(normalize(name), { id: skill.id, name, icon: skill.icon });
    });
    return map;
  }, [skills, language]);

  const relations = useMemo(() => {
    const byTech = new Map<string, Project[]>();
    projects.forEach((project) => {
      const techValue =
        (selectLocalizedColumn(project, 'technologies', language) as string) || project.technologies;
      const techList = parseTech(techValue);
      techList.forEach((tech) => {
        const skill = techMap.get(normalize(tech));
        if (!skill) return;
        if (!byTech.has(skill.id)) byTech.set(skill.id, []);
        byTech.get(skill.id)?.push(project);
      });
    });
    return byTech;
  }, [projects, language, techMap]);

  const activeProjects = activeId ? relations.get(activeId) ?? [] : [];

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="space-y-3">
        {skills.map((skill) => {
          const name = selectLocalizedColumn(skill, 'name', language) || skill.name;
          const isActive = activeId === skill.id;
          return (
            <button
              key={skill.id}
              type="button"
              onClick={() => setActiveId(isActive ? null : skill.id)}
              className={`flex w-full items-center justify-between gap-4 rounded-2xl border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${
                isActive
                  ? 'border-indigo-500/60 bg-slate-900/70 text-slate-50 shadow-[0_12px_30px_-20px_rgba(99,102,241,0.9)]'
                  : 'border-slate-800/80 bg-slate-950/40 text-slate-200 hover:border-slate-700'
              }`}
            >
              <span className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em]">
                <i className={`${skill.icon} text-base text-slate-300`}></i>
                {name}
              </span>
              <span className="text-xs text-slate-500">{relations.get(skill.id)?.length ?? 0}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-3xl border border-slate-800/80 bg-slate-950/60 p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Projetos</p>
          {activeId && (
            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="text-xs uppercase tracking-[0.2em] text-slate-500 hover:text-slate-200"
            >
              Limpar
            </button>
          )}
        </div>
        {activeProjects.length === 0 ? (
          <p className="text-sm text-slate-500">
            {activeId ? 'Sem projetos ligados.' : 'Selecione uma tecnologia.'}
          </p>
        ) : (
          <div className="space-y-3">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4"
              >
                <p className="text-sm font-semibold text-slate-100">
                  {(selectLocalizedColumn(project, 'title', language) as string) || project.title}
                </p>
                {project.role && (
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {(selectLocalizedColumn(project, 'role', language) as string) || project.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TechIndex;
