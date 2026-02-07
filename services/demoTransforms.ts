import { ProjectWithSkills, SkillWithProjects, TechnicalSkill } from '../types';
import { DemoProject } from '../contexts/DemoSessionContext';

const sortByDisplayOrder = <T extends { display_order?: number }>(a: T, b: T) =>
  (a.display_order || 0) - (b.display_order || 0);

const isSkillActive = (skill: TechnicalSkill) => skill.is_active !== false;
const isProjectPublished = (project: DemoProject) => project.status !== 'draft';

export const buildDemoProjectsWithSkills = (
  projects: DemoProject[],
  techSkills: TechnicalSkill[]
): ProjectWithSkills[] => {
  const activeSkillsById = new Map(
    techSkills.filter(isSkillActive).map((skill) => [skill.id, skill] as const)
  );

  return [...projects]
    .filter(isProjectPublished)
    .sort(sortByDisplayOrder)
    .map((project) => {
      const skillIds = project.skill_ids || [];
      const skills = skillIds
        .map((id) => activeSkillsById.get(id))
        .filter(Boolean)
        .map((skill) => ({
          id: skill!.id,
          slug: skill!.slug || skill!.id,
          name: skill!.name,
          category: skill!.category || 'other',
          icon_key: skill!.icon_key || skill!.icon || null,
          name_pt: (skill as any).name_pt,
          name_en: (skill as any).name_en,
          name_fr: (skill as any).name_fr,
        }));

      return {
        ...project,
        skills,
      } as ProjectWithSkills;
    });
};

export const buildDemoSkillsWithProjects = (
  projects: DemoProject[],
  techSkills: TechnicalSkill[]
): SkillWithProjects[] => {
  const publishedProjects = [...projects].filter(isProjectPublished).sort(sortByDisplayOrder);
  const skills = [...techSkills].filter(isSkillActive).sort(sortByDisplayOrder);

  const rows = skills.map((skill) => {
    const related = publishedProjects
      .filter((project) => (project.skill_ids || []).includes(skill.id))
      .map((project) => ({
        id: project.id,
        slug: project.slug || project.id,
        title: project.title,
        role: project.role,
        image_url: project.image_url,
        display_order: project.display_order,
        title_pt: (project as any).title_pt,
        title_en: (project as any).title_en,
        title_fr: (project as any).title_fr,
        role_pt: (project as any).role_pt,
        role_en: (project as any).role_en,
        role_fr: (project as any).role_fr,
      }))
      .sort(sortByDisplayOrder);

    return {
      ...skill,
      projects_count: related.length,
      projects: related,
    } as SkillWithProjects;
  });

  return rows.filter((skill) => skill.projects_count > 0);
};

