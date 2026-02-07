import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { I18nProvider, useI18n } from './i18n';
import { supabase } from './supabaseClient';
import { initAnalytics, setAnalyticsContext, trackEvent, trackPageView } from './services/analytics';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const SeoAnalytics = () => {
  const location = useLocation();
  const { language } = useI18n();
  const lastViewRef = useRef<{ path: string; lang: string } | null>(null);
  const lastLangRef = useRef<string | null>(null);

  const seoConfig = useMemo(() => {
    const isAdmin = location.pathname === '/admin' || location.pathname.startsWith('/admin/');
    const isAdminDemo = location.pathname.startsWith('/admin-demo');
    const isLogin = location.pathname.startsWith('/login');

    const base = {
      title: {
        'pt-BR': 'Igor Matos | Portfólio Pessoal',
        'en': 'Igor Matos | Developer Portfolio',
        'fr': 'Igor Matos | Portfolio Personnel'
      },
      description: {
        'pt-BR': 'Portfólio profissional de Igor Matos com projetos, jornada, competências e contato.',
        'en': 'Professional portfolio of Igor Matos with projects, journey, skills, and contact.',
        'fr': 'Portfolio professionnel d\'Igor Matos avec projets, parcours, compétences et contact.'
      }
    } as const;

    if (isAdmin) {
      return {
        title: {
          'pt-BR': 'Admin | Igor Matos',
          'en': 'Admin | Igor Matos',
          'fr': 'Admin | Igor Matos'
        },
        description: {
          'pt-BR': 'Painel administrativo do portfólio.',
          'en': 'Portfolio admin panel.',
          'fr': 'Panneau d\'administration du portfolio.'
        },
        robots: 'noindex,nofollow'
      };
    }

    if (isAdminDemo) {
      return {
        title: {
          'pt-BR': 'Admin Demo | Igor Matos',
          'en': 'Admin Demo | Igor Matos',
          'fr': 'Admin Demo | Igor Matos'
        },
        description: {
          'pt-BR': 'Visualizacao demonstrativa do painel administrativo.',
          'en': 'Demonstration view of the admin panel.',
          'fr': 'Vue de demonstration du panneau d administration.'
        },
        robots: 'noindex,nofollow'
      };
    }

    if (isLogin) {
      return {
        title: {
          'pt-BR': 'Login | Igor Matos',
          'en': 'Login | Igor Matos',
          'fr': 'Login | Igor Matos'
        },
        description: {
          'pt-BR': 'Acesso ao painel administrativo.',
          'en': 'Access to the admin panel.',
          'fr': 'Accès au panneau d\'administration.'
        },
        robots: 'noindex,nofollow'
      };
    }

    return { ...base, robots: 'index,follow' };
  }, [location.pathname]);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', language);

    const title = seoConfig.title[language];
    const description = seoConfig.description[language];
    document.title = title;

    const upsertMeta = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        Object.keys(attrs).forEach((k) => el!.setAttribute(k, attrs[k]));
        document.head.appendChild(el);
      }
      if ('content' in attrs) el.setAttribute('content', attrs.content);
    };

    const upsertLink = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        Object.keys(attrs).forEach((k) => el!.setAttribute(k, attrs[k]));
        document.head.appendChild(el);
      }
      Object.keys(attrs).forEach((k) => el!.setAttribute(k, attrs[k]));
    };

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: seoConfig.robots });

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: 'https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/image/matos_view.png'
    });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: window.location.href });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: 'https://iquantqgsrgwbqfwbhfq.supabase.co/storage/v1/object/public/media/image/matos_view.png'
    });

    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: window.location.origin + '/' });

    const hreflangs = ['pt-BR', 'en', 'fr'];
    hreflangs.forEach((hl) => {
      upsertLink(`link[rel="alternate"][hreflang="${hl}"]`, {
        rel: 'alternate',
        hreflang: hl,
        href: window.location.origin + '/'
      });
    });
    setAnalyticsContext({
      language,
      page_path: location.pathname || '/',
      page_title: title
    });
  }, [language, location.pathname, seoConfig]);

  useEffect(() => {
    const path = location.pathname || '/';
    const last = lastViewRef.current;
    if (!last || last.path !== path || last.lang !== language) {
      trackPageView(path, language);
      lastViewRef.current = { path, lang: language };
    }
  }, [location.pathname, language]);

  useEffect(() => {
    if (lastLangRef.current && lastLangRef.current !== language) {
      trackEvent({ name: 'language_change', props: { language } });
    }
    lastLangRef.current = language;
  }, [language]);

  return null;
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Checagem Inicial de Sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listener em Tempo Real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <i className="fa-solid fa-circle-notch fa-spin text-indigo-500 text-4xl"></i>
      </div>
    );
  }

  return (
    <I18nProvider>
      <Router>
        <ScrollToTop />
        <SeoAnalytics />
        <div className="min-h-screen bg-slate-900 text-slate-400">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Rota de Login: Redireciona para Admin se já estiver logado */}
            <Route 
              path="/login" 
              element={session ? <Navigate to="/admin" replace /> : <Login />} 
            />

            <Route
              path="/admin-demo"
              element={<Admin mode="demo-local" />}
            />
            
            {/* Rota Protegida de Admin: Redireciona para Login se não estiver logado */}
            <Route 
              path="/admin" 
              element={session ? <Admin /> : <Navigate to="/login" replace />} 
            />
          </Routes>
        </div>
      </Router>
    </I18nProvider>
  );
};

export default App;
