import React, { useMemo, useState } from 'react';
import { Project, TechnicalSkill } from '../types';
import { selectLocalizedColumn } from '../i18n';

type TechConstellationProps = {
  skills: TechnicalSkill[];
  projects: Project[];
  language: string;
};

type TechNode = {
  id: string;
  label: string;
  icon: string;
  group: string;
  projects: string[];
  x: number;
  y: number;
};

type TechLink = {
  id: string;
  source: string;
  target: string;
  projects: string[];
};

const groupMap: Record<string, string> = {
  react: 'frontend',
  'vue.js': 'frontend',
  'node.js': 'backend',
  python: 'backend',
  mysql: 'data',
  docker: 'devops',
  aws: 'cloud',
};

const groupLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  data: 'Data',
  devops: 'DevOps',
  cloud: 'Cloud',
  tools: 'Tools',
};

const ringByGroup: Record<string, number> = {
  frontend: 24,
  backend: 24,
  data: 34,
  devops: 34,
  cloud: 42,
  tools: 42,
};

const hashString = (value: string) =>
  value
    .split('')
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 360, 0);

const normalizeName = (value: string) => value.trim().toLowerCase();

const parseTech = (tech: string) => {
  if (!tech) return [];
  return tech.split(',').map((item) => item.trim()).filter(Boolean);
};

const TechConstellation: React.FC<TechConstellationProps> = ({ skills, projects, language }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  const { nodes, links, nodesByGroup } = useMemo(() => {
    const skillLookup = new Map<string, TechnicalSkill>();
    skills.forEach((skill) => {
      const localizedName = selectLocalizedColumn(skill, 'name', language) || skill.name;
      skillLookup.set(normalizeName(localizedName), { ...skill, name: localizedName });
    });

    const projectTechMap = new Map<string, Set<string>>();
    const linkMap = new Map<string, { source: string; target: string; projects: Set<string> }>();

    projects.forEach((project) => {
      const projectTitle =
        (selectLocalizedColumn(project, 'title', language) as string) || project.title;
      const techValue =
        (selectLocalizedColumn(project, 'technologies', language) as string) || project.technologies;
      const techList = parseTech(techValue);
      const linkedIds: string[] = [];

      techList.forEach((tech) => {
        const skill = skillLookup.get(normalizeName(tech));
        if (!skill) return;
        linkedIds.push(skill.id);
        if (!projectTechMap.has(skill.id)) projectTechMap.set(skill.id, new Set());
        projectTechMap.get(skill.id)?.add(projectTitle);
      });

      for (let i = 0; i < linkedIds.length - 1; i += 1) {
        const a = linkedIds[i];
        const b = linkedIds[i + 1];
        if (!a || !b || a === b) continue;
        const key = [a, b].sort().join('::');
        if (!linkMap.has(key)) {
          linkMap.set(key, { source: a, target: b, projects: new Set() });
        }
        linkMap.get(key)?.projects.add(projectTitle);
      }
    });

    const nodes: TechNode[] = skills.map((skill) => {
      const localizedName = selectLocalizedColumn(skill, 'name', language) || skill.name;
      const normalized = normalizeName(localizedName);
      const group = groupMap[normalized] || 'tools';
      const projectSet = projectTechMap.get(skill.id);
      return {
        id: skill.id,
        label: localizedName,
        icon: skill.icon,
        group,
        projects: projectSet ? Array.from(projectSet) : [],
        x: 50,
        y: 50,
      };
    });

    const grouped: Record<string, TechNode[]> = {};
    nodes.forEach((node) => {
      if (!grouped[node.group]) grouped[node.group] = [];
      grouped[node.group].push(node);
    });

    Object.entries(grouped).forEach(([group, groupNodes]) => {
      const radius = ringByGroup[group] ?? 36;
      const offset = hashString(group);
      const step = 360 / groupNodes.length;
      groupNodes.forEach((node, index) => {
        const angle = ((offset + index * step) * Math.PI) / 180;
        node.x = 50 + radius * Math.cos(angle);
        node.y = 50 + radius * Math.sin(angle);
      });
    });

    const links: TechLink[] = Array.from(linkMap.entries()).map(([id, link]) => ({
      id,
      source: link.source,
      target: link.target,
      projects: Array.from(link.projects),
    }));

    return { nodes, links, nodesByGroup: grouped };
  }, [skills, projects, language]);

  const connectedSet = useMemo(() => {
    if (!hovered) return new Set<string>();
    const set = new Set<string>();
    links.forEach((link) => {
      if (link.source === hovered || link.target === hovered) {
        set.add(link.id);
      }
    });
    return set;
  }, [hovered, links]);

  const getNodeProjects = (nodeId: string) => {
    const node = nodes.find((item) => item.id === nodeId);
    return node?.projects ?? [];
  };

  return (
    <div className="relative">
      <div className="hidden md:block">
        <div className="relative rounded-[32px] border border-slate-800/80 bg-slate-950/60 p-6 md:p-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40"></div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_55%)]"></div>

          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
            <g className="stroke-slate-700/60">
              {links.map((link) => {
                const source = nodes.find((node) => node.id === link.source);
                const target = nodes.find((node) => node.id === link.target);
                if (!source || !target) return null;
                const isActive = connectedSet.has(link.id);
                return (
                  <line
                    key={link.id}
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    className={`transition-all duration-300 ${isActive ? 'stroke-indigo-400/80' : 'stroke-slate-700/60'}`}
                    strokeWidth={isActive ? 0.5 : 0.25}
                  />
                );
              })}
            </g>
          </svg>

          <div className="relative h-[420px] w-full">
            {nodes.map((node) => {
              const isActive = hovered === node.id;
              const projectList = getNodeProjects(node.id);
              return (
                <div
                  key={node.id}
                  className="absolute"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                    className={`group flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 text-center text-xs uppercase tracking-[0.16em] text-slate-200 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 ${isActive ? 'border-indigo-400/70 shadow-[0_0_30px_-12px_rgba(99,102,241,0.9)]' : 'hover:border-indigo-400/60 hover:shadow-[0_0_25px_-14px_rgba(99,102,241,0.8)]'}`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/60 text-lg text-slate-100 ring-1 ring-slate-700/70 group-hover:ring-indigo-500/50">
                      <i className={node.icon}></i>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-100">{node.label}</span>
                  </button>

                  {isActive && projectList.length > 0 && (
                    <div className="absolute left-1/2 top-[calc(100%+10px)] z-20 w-56 -translate-x-1/2 rounded-xl border border-slate-800 bg-slate-900/95 p-3 text-left text-xs text-slate-200 shadow-xl">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Usado em
                      </p>
                      <p className="mt-1 text-sm text-slate-100">
                        {projectList.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="md:hidden">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-5">
          {Object.entries(nodesByGroup).map(([group, groupNodes]) => (
            <div key={group} className="mb-6 last:mb-0">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-3">
                {groupLabels[group] || group}
              </p>
              <div className="flex flex-wrap gap-2">
                {groupNodes.map((node) => (
                  <span
                    key={node.id}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-200"
                  >
                    <i className={`${node.icon} text-[12px] text-slate-300`}></i>
                    {node.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechConstellation;
