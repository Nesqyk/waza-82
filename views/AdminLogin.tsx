import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, loading, signIn } = useAuth();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email, password);
      // onAuthStateChanged will update user/isAdmin; redirect handled by useEffect
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-washi washi-texture">
      <div className="w-full max-w-md p-8 bg-white border border-stone-200 shadow-xl rounded-sm">
        <div className="flex justify-center mb-6">
           <div className="w-16 h-16 bg-sumi text-white flex items-center justify-center rounded-full">
              <Lock className="w-8 h-8" />
           </div>
        </div>
        <h2 className="text-2xl font-serif font-bold text-center text-sumi mb-2">Dojo Access</h2>
        <p className="text-center text-stone-500 mb-8 text-sm">Sign in with your admin credentials.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
             <input 
               type="email" 
               placeholder="Email"
               value={email}
               onChange={(e) => { setEmail(e.target.value); setError(null); }}
               className={`w-full p-3 border rounded-sm focus:outline-none focus:ring-2 transition-all ${error ? 'border-vermillion focus:ring-vermillion/20' : 'border-stone-200 focus:ring-indigo/20 focus:border-indigo'}`}
             />
          </div>
          <div>
             <input 
               type="password" 
               placeholder="Password"
               value={password}
               onChange={(e) => { setPassword(e.target.value); setError(null); }}
               className={`w-full p-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-mono ${error ? 'border-vermillion focus:ring-vermillion/20' : 'border-stone-200 focus:ring-indigo/20 focus:border-indigo'}`}
             />
             {error && <p className="text-xs text-vermillion mt-2 font-bold">{error}</p>}
          </div>
          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-sumi text-white font-bold uppercase tracking-widest hover:bg-vermillion transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
             {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
             {submitting ? 'Signing in...' : 'Enter Dojo'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;