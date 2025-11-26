import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TechniqueDeck from './views/TechniqueDeck';
import TechniqueDetail from './views/TechniqueDetail';
import RefereeMode from './views/RefereeMode';
import AdminEditor from './views/AdminEditor';
import AdminLogin from './views/AdminLogin';
import { useAuth } from './hooks/useAuth';

const ProtectedAdminRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-stone-400 text-sm uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen font-sans text-sumi flex flex-col washi-texture">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<TechniqueDeck />} />
            <Route path="/technique/:id" element={<TechniqueDetail />} />
            <Route path="/referee" element={<RefereeMode />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <AdminEditor />
                </ProtectedAdminRoute>
              } 
            />
          </Routes>
        </main>
        <footer className="border-t border-stone-200 py-8 text-center">
          <p className="text-stone-400 text-xs font-serif italic">
            WAZA - The Sumo Mechanics Index. <br/>Concept Design. No official affiliation with Nihon Sumo Kyokai.
          </p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;