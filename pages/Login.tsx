import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import Layout from '../components/Layout';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authService.signIn(email, password);
      navigate('/admin');
    } catch (err: any) {
      console.error(err);
      setError(err.message === 'Invalid login credentials' 
        ? 'Credenciais inválidas. Verifique seu email e senha.' 
        : 'Ocorreu um erro ao tentar entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
        {/* Background Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-10 backdrop-blur-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-400 text-2xl shadow-lg shadow-indigo-500/10">
                <i className="fa-solid fa-lock"></i>
              </div>
              <h1 className="text-2xl font-bold text-white">Acesso Administrativo</h1>
              <p className="text-slate-400 mt-2 text-sm">Entre com suas credenciais para gerenciar o portfólio.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="admin@exemplo.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                    <i className="fa-solid fa-key"></i>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-slate-700 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-right-to-bracket"></i>}
                {loading ? 'Autenticando...' : 'Entrar no Sistema'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;