import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { I18nProvider } from './i18n';
import { supabase } from './supabaseClient';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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
        <div className="min-h-screen bg-slate-900 text-slate-400">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Rota de Login: Redireciona para Admin se já estiver logado */}
            <Route 
              path="/login" 
              element={session ? <Navigate to="/admin" replace /> : <Login />} 
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