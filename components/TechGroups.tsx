import React, { useMemo, useState } from 'react';
import { SkillWithProjects } from '../types';
import { Language, selectLocalizedColumn } from '../i18n';

type TechGroupsProps = {
  skills: SkillWithProjects[];
  language: Language;
  onProjectSelect?: (projectId: string) => void;
};

type Group = {
  id: string;
  label: string;
};

const groups: Group[] = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'data', label: 'Data' },
  { id: 'infra', label: 'Infra' },
  { id: 'ai-tools', label: 'Ferramentas de IA' },
  { id: 'other', label: 'Outros' },
];


const TechGroups: React.FC<TechGroupsProps> = ({ skills, language, onProjectSelect }) => {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [activeSkill, setActiveSkill] = useState<SkillWithProjects | null>(null);

  const { grouped } = useMemo(() => {
    const filteredSkills = skills.filter((skill) => (skill.projects_count || 0) > 0);
    const groupedSkills: Record<string, SkillWithProjects[]> = {};
    groups.forEach((group) => {
      groupedSkills[group.id] = [];
    });

    filteredSkills.forEach((skill) => {
      const rawGroup = (skill.category || 'other').toLowerCase();
      const group = groupedSkills[rawGroup] ? rawGroup : 'other';
      groupedSkills[group].push(skill);
    });

    Object.values(groupedSkills).forEach((items) => {
      items.sort((a, b) =>
        (selectLocalizedColumn(a, 'name', language) || a.name).localeCompare(
          selectLocalizedColumn(b, 'name', language) || b.name,
        ),
      );
    });

    return { grouped: groupedSkills };
  }, [skills, language]);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3 md:hidden">
        {groups
          .filter((group) => (grouped[group.id] ?? []).length > 0)
          .map((group) => {
          const isOpen = openGroups.has(group.id);
          const items = grouped[group.id] ?? [];
          const isActiveGroup =
            activeSkill && items.some((skill) => skill.id === activeSkill.id);
          return (
            <div
              key={group.id}
              className={`rounded-2xl border bg-slate-950/60 transition-all ${
                activeSkill
                  ? isActiveGroup
                    ? 'border-indigo-500/40 shadow-[0_0_30px_-18px_rgba(99,102,241,0.7)]'
                    : 'border-slate-800/70 opacity-60'
                  : 'border-slate-800/80'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
                  {group.label}
                </span>
                <span className="text-[11px] text-slate-500">{items.length} itens</span>
              </button>
              {isOpen && (
                <div className="border-t border-slate-800/70 px-4 py-4">
                  <div className="flex flex-col gap-2">
                    {items.map((skill) => {
                      const name = selectLocalizedColumn(skill, 'name', language) || skill.name;
                      const count = skill.projects_count || 0;
                      const isActive = activeSkill?.id === skill.id;
                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => setActiveSkill(skill)}
                          className={`relative flex items-center justify-between gap-4 rounded-xl border px-3 py-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                            isActive
                              ? 'border-indigo-500/60 bg-indigo-500/10 text-slate-100 shadow-[0_0_20px_-16px_rgba(99,102,241,0.9)]'
                              : 'border-slate-800 bg-slate-950/40 text-slate-200'
                          }`}
                        >
                          <span className="flex items-center gap-3 text-sm font-medium">
                            <i className={`${skill.icon_key || skill.icon} text-base text-slate-300`}></i>
                            {name}
                          </span>
                          <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                            {count} projetos
                          </span>
                          {isActive && (
                            <>
                              <span className="pointer-events-none absolute -left-1 -top-1 h-3 w-3 border-l border-t border-indigo-400/70"></span>
                              <span className="pointer-events-none absolute -right-1 -top-1 h-3 w-3 border-r border-t border-indigo-400/70"></span>
                              <span className="pointer-events-none absolute -left-1 -bottom-1 h-3 w-3 border-l border-b border-indigo-400/70"></span>
                              <span className="pointer-events-none absolute -right-1 -bottom-1 h-3 w-3 border-r border-b border-indigo-400/70"></span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {activeSkill && items.some((skill) => skill.id === activeSkill.id) && (
                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                            Resultados · {activeSkill.name}
                          </p>
                          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mt-1">
                            {activeSkill.projects?.length || 0} projetos encontrados
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveSkill(null)}
                          className="text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-slate-200"
                        >
                          Limpar
                        </button>
                      </div>
                      {activeSkill.projects?.length ? (
                        <div className="mt-3 space-y-2">
                          {activeSkill.projects.map((project) => (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() => onProjectSelect?.(project.id)}
                              className="w-full rounded-xl border border-slate-800 bg-slate-900/40 px-3 py-2 text-left transition-all hover:border-indigo-400/50 hover:bg-slate-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                            >
                              <p className="text-sm font-semibold text-slate-100">
                                {selectLocalizedColumn(project as any, 'title', language) || project.title}
                              </p>
                              {project.role && (
                                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                                  {selectLocalizedColumn(project as any, 'role', language) || project.role}
                                </p>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-slate-500">Sem projetos relacionados.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-6">
        {groups
          .filter((group) => (grouped[group.id] ?? []).length > 0)
          .map((group) => {
          const items = grouped[group.id] ?? [];
          const isActiveGroup =
            activeSkill && items.some((skill) => skill.id === activeSkill.id);
          return (
            <div
              key={group.id}
              className={`rounded-3xl border bg-slate-950/60 p-5 transition-all ${
                activeSkill
                  ? isActiveGroup
                    ? 'border-indigo-500/40 shadow-[0_0_35px_-20px_rgba(99,102,241,0.7)]'
                    : 'border-slate-800/70 opacity-60'
                  : 'border-slate-800/80'
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                    {group.label}
                  </p>
                  <p className="text-[11px] text-slate-500">{items.length} itens</p>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((skill) => {
                  const name = selectLocalizedColumn(skill, 'name', language) || skill.name;
                  const count = skill.projects_count || 0;
                  const isActive = activeSkill?.id === skill.id;
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => setActiveSkill(skill)}
                      className={`relative flex w-full items-center justify-between gap-4 rounded-xl border px-3 py-2 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                        isActive
                          ? 'border-indigo-500/60 bg-indigo-500/10 text-slate-100 shadow-[0_0_22px_-16px_rgba(99,102,241,0.9)]'
                          : 'border-slate-800 bg-slate-950/40 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-3 text-sm font-medium">
                        <i className={`${skill.icon_key || skill.icon} text-base text-slate-300`}></i>
                        {name}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {count} projetos
                      </span>
                      {isActive && (
                        <>
                          <span className="pointer-events-none absolute -left-1 -top-1 h-3 w-3 border-l border-t border-indigo-400/70"></span>
                          <span className="pointer-events-none absolute -right-1 -top-1 h-3 w-3 border-r border-t border-indigo-400/70"></span>
                          <span className="pointer-events-none absolute -left-1 -bottom-1 h-3 w-3 border-l border-b border-indigo-400/70"></span>
                          <span className="pointer-events-none absolute -right-1 -bottom-1 h-3 w-3 border-r border-b border-indigo-400/70"></span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block">
        <div
          className={`mt-6 rounded-3xl border bg-slate-950/60 p-6 transition-all ${
            activeSkill
              ? 'border-indigo-500/40 shadow-[0_0_35px_-20px_rgba(99,102,241,0.7)]'
              : 'border-slate-800/80'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Resultados · {activeSkill?.name || 'Tecnologia'}
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mt-1">
                {activeSkill ? `${activeSkill.projects?.length || 0} projetos encontrados` : 'Selecione uma tecnologia'}
              </p>
            </div>
            {activeSkill && (
              <button
                type="button"
                onClick={() => setActiveSkill(null)}
                className="text-[10px] uppercase tracking-[0.2em] text-slate-500 hover:text-slate-200"
              >
                Limpar
              </button>
            )}
          </div>
          {activeSkill && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeSkill.projects?.length ? (
                activeSkill.projects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => onProjectSelect?.(project.id)}
                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 text-left transition-all hover:border-indigo-400/50 hover:bg-slate-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
                  >
                    <p className="text-sm font-semibold text-slate-100">
                      {selectLocalizedColumn(project as any, 'title', language) || project.title}
                    </p>
                    {project.role && (
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {selectLocalizedColumn(project as any, 'role', language) || project.role}
                      </p>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-sm text-slate-500">Sem projetos relacionados.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechGroups;
