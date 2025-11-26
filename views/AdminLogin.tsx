import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side auth for demonstration
    if (password === 'waza2024') { 
      sessionStorage.setItem('waza_admin', 'true');
      navigate('/admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-washi washi-texture">
      <div className="w-full max-w-md p-8 bg-white border border-stone-200 shadow-xl rounded-sm">
        <div className="flex justify-center mb-6">
           <div className="w-16 h-16 bg-sumi text-white flex items-center justify-center rounded-full">
              <Lock className="w-8 h-8" />
           </div>
        </div>
        <h2 className="text-2xl font-serif font-bold text-center text-sumi mb-2">Dojo Access</h2>
        <p className="text-center text-stone-500 mb-8 text-sm">Enter the master key to enter the editor.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
             <input 
               type="password" 
               placeholder="Enter Password"
               value={password}
               onChange={(e) => { setPassword(e.target.value); setError(false); }}
               className={`w-full p-3 border rounded-sm focus:outline-none focus:ring-2 transition-all font-mono ${error ? 'border-vermillion focus:ring-vermillion/20' : 'border-stone-200 focus:ring-indigo/20 focus:border-indigo'}`}
             />
             {error && <p className="text-xs text-vermillion mt-2 font-bold">Incorrect password.</p>}
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-sumi text-white font-bold uppercase tracking-widest hover:bg-vermillion transition-colors flex items-center justify-center gap-2"
          >
             Enter Dojo <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <div className="mt-6 text-center">
           <p className="text-[10px] text-stone-400 uppercase tracking-widest">Hint: waza2024</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;