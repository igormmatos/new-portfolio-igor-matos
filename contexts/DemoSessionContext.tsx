import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import snapshot from '../data/admin-demo-snapshot.json';
import { Competency, JourneyItem, ProfileInfo, Project, TechnicalSkill } from '../types';

export type DemoProject = Project & { skill_ids?: string[] };

type DemoSessionState = {
  profile: ProfileInfo | null;
  projects: DemoProject[];
  journey: JourneyItem[];
  competencies: Competency[];
  techSkills: TechnicalSkill[];
};

type DemoSessionContextValue = DemoSessionState & {
  resetDemoSession: () => void;
  setDemoProfile: (profile: ProfileInfo | null) => void;
  setDemoProjects: (updater: React.SetStateAction<DemoProject[]>) => void;
  upsertDemoProject: (project: DemoProject) => void;
  deleteDemoProject: (id: string) => void;
  reorderDemoProjects: (items: DemoProject[]) => void;
  setDemoJourney: (updater: React.SetStateAction<JourneyItem[]>) => void;
  upsertDemoJourney: (item: JourneyItem) => void;
  deleteDemoJourney: (id: string) => void;
  reorderDemoJourney: (items: JourneyItem[]) => void;
  setDemoCompetencies: (updater: React.SetStateAction<Competency[]>) => void;
  upsertDemoCompetency: (item: Competency) => void;
  deleteDemoCompetency: (id: string) => void;
  reorderDemoCompetencies: (items: Competency[]) => void;
  setDemoTechSkills: (updater: React.SetStateAction<TechnicalSkill[]>) => void;
  upsertDemoTechSkill: (item: TechnicalSkill) => void;
  deleteDemoTechSkill: (id: string) => void;
  reorderDemoTechSkills: (items: TechnicalSkill[]) => void;
  timeoutNotice: string | null;
  clearTimeoutNotice: () => void;
};

const DemoSessionContext = createContext<DemoSessionContextValue | undefined>(undefined);

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;

const sortByDisplayOrder = <T extends { display_order?: number }>(a: T, b: T) =>
  (a.display_order || 0) - (b.display_order || 0);

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const createInitialState = (): DemoSessionState => {
  const raw = clone(snapshot || {}) as Partial<DemoSessionState>;
  return {
    profile: raw.profile || null,
    projects: [...(raw.projects || [])].sort(sortByDisplayOrder),
    journey: [...(raw.journey || [])].sort(sortByDisplayOrder),
    competencies: [...(raw.competencies || [])].sort(sortByDisplayOrder),
    techSkills: [...(raw.techSkills || [])].sort(sortByDisplayOrder),
  };
};

const resolveUpdater = <T,>(updater: React.SetStateAction<T>, current: T): T =>
  typeof updater === 'function' ? (updater as (prev: T) => T)(current) : updater;

export const DemoSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DemoSessionState>(() => createInitialState());
  const [timeoutNotice, setTimeoutNotice] = useState<string | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const hideNoticeRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();

  const resetDemoSession = () => {
    setState(createInitialState());
  };

  const setDemoProfile = (profile: ProfileInfo | null) => {
    setState((prev) => ({ ...prev, profile }));
  };

  const setDemoProjects = (updater: React.SetStateAction<DemoProject[]>) => {
    setState((prev) => {
      const next = resolveUpdater(updater, prev.projects);
      return { ...prev, projects: [...next].sort(sortByDisplayOrder) };
    });
  };

  const upsertDemoProject = (project: DemoProject) => {
    setState((prev) => {
      const exists = prev.projects.some((item) => item.id === project.id);
      const next = exists
        ? prev.projects.map((item) => (item.id === project.id ? project : item))
        : [...prev.projects, project];
      return { ...prev, projects: [...next].sort(sortByDisplayOrder) };
    });
  };

  const deleteDemoProject = (id: string) => {
    setState((prev) => ({ ...prev, projects: prev.projects.filter((item) => item.id !== id) }));
  };

  const reorderDemoProjects = (items: DemoProject[]) => {
    setState((prev) => ({ ...prev, projects: items }));
  };

  const setDemoJourney = (updater: React.SetStateAction<JourneyItem[]>) => {
    setState((prev) => {
      const next = resolveUpdater(updater, prev.journey);
      return { ...prev, journey: [...next].sort(sortByDisplayOrder) };
    });
  };

  const upsertDemoJourney = (item: JourneyItem) => {
    setState((prev) => {
      const exists = prev.journey.some((row) => row.id === item.id);
      const next = exists
        ? prev.journey.map((row) => (row.id === item.id ? item : row))
        : [...prev.journey, item];
      return { ...prev, journey: [...next].sort(sortByDisplayOrder) };
    });
  };

  const deleteDemoJourney = (id: string) => {
    setState((prev) => ({ ...prev, journey: prev.journey.filter((row) => row.id !== id) }));
  };

  const reorderDemoJourney = (items: JourneyItem[]) => {
    setState((prev) => ({ ...prev, journey: items }));
  };

  const setDemoCompetencies = (updater: React.SetStateAction<Competency[]>) => {
    setState((prev) => {
      const next = resolveUpdater(updater, prev.competencies);
      return { ...prev, competencies: [...next].sort(sortByDisplayOrder) };
    });
  };

  const upsertDemoCompetency = (item: Competency) => {
    setState((prev) => {
      const exists = prev.competencies.some((row) => row.id === item.id);
      const next = exists
        ? prev.competencies.map((row) => (row.id === item.id ? item : row))
        : [...prev.competencies, item];
      return { ...prev, competencies: [...next].sort(sortByDisplayOrder) };
    });
  };

  const deleteDemoCompetency = (id: string) => {
    setState((prev) => ({ ...prev, competencies: prev.competencies.filter((row) => row.id !== id) }));
  };

  const reorderDemoCompetencies = (items: Competency[]) => {
    setState((prev) => ({ ...prev, competencies: items }));
  };

  const setDemoTechSkills = (updater: React.SetStateAction<TechnicalSkill[]>) => {
    setState((prev) => {
      const next = resolveUpdater(updater, prev.techSkills);
      return { ...prev, techSkills: [...next].sort(sortByDisplayOrder) };
    });
  };

  const upsertDemoTechSkill = (item: TechnicalSkill) => {
    setState((prev) => {
      const exists = prev.techSkills.some((row) => row.id === item.id);
      const next = exists
        ? prev.techSkills.map((row) => (row.id === item.id ? item : row))
        : [...prev.techSkills, item];
      return { ...prev, techSkills: [...next].sort(sortByDisplayOrder) };
    });
  };

  const deleteDemoTechSkill = (id: string) => {
    setState((prev) => ({ ...prev, techSkills: prev.techSkills.filter((row) => row.id !== id) }));
  };

  const reorderDemoTechSkills = (items: TechnicalSkill[]) => {
    setState((prev) => ({ ...prev, techSkills: items }));
  };

  useEffect(() => {
    const isDemoRoute = location.pathname === '/demo' || location.pathname === '/admin-demo';
    if (!isDemoRoute) return;

    const resetTimer = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        resetDemoSession();
        setTimeoutNotice(t('demo.session_timeout'));
        navigate('/');
      }, INACTIVITY_TIMEOUT_MS);
    };

    const events: Array<keyof WindowEventMap> = ['click', 'keydown', 'mousemove', 'touchstart', 'scroll'];
    events.forEach((eventName) => window.addEventListener(eventName, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      events.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
    };
  }, [location.pathname, navigate, t]);

  useEffect(() => {
    if (!timeoutNotice) return;
    if (hideNoticeRef.current) window.clearTimeout(hideNoticeRef.current);
    hideNoticeRef.current = window.setTimeout(() => setTimeoutNotice(null), 4000);
    return () => {
      if (hideNoticeRef.current) window.clearTimeout(hideNoticeRef.current);
    };
  }, [timeoutNotice]);

  const clearTimeoutNotice = () => setTimeoutNotice(null);

  const value = useMemo<DemoSessionContextValue>(
    () => ({
      ...state,
      resetDemoSession,
      setDemoProfile,
      setDemoProjects,
      upsertDemoProject,
      deleteDemoProject,
      reorderDemoProjects,
      setDemoJourney,
      upsertDemoJourney,
      deleteDemoJourney,
      reorderDemoJourney,
      setDemoCompetencies,
      upsertDemoCompetency,
      deleteDemoCompetency,
      reorderDemoCompetencies,
      setDemoTechSkills,
      upsertDemoTechSkill,
      deleteDemoTechSkill,
      reorderDemoTechSkills,
      timeoutNotice,
      clearTimeoutNotice,
    }),
    [state, timeoutNotice]
  );

  return (
    <DemoSessionContext.Provider value={value}>
      {children}
      {timeoutNotice && (
        <div className="fixed bottom-6 right-6 z-[90] px-5 py-3 rounded-xl bg-red-500 text-white font-semibold shadow-2xl">
          {timeoutNotice}
        </div>
      )}
    </DemoSessionContext.Provider>
  );
};

export const useDemoSession = () => {
  const ctx = useContext(DemoSessionContext);
  if (!ctx) throw new Error('useDemoSession must be used within DemoSessionProvider');
  return ctx;
};

