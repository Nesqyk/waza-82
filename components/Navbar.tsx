import React, { useState } from 'react';
import { Menu, Shield, BookOpen, Move, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, icon: Icon, label, onClick }: any) => (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-2 text-sm font-medium transition-colors py-2 px-4 rounded-md ${isActive(to) ? 'text-sumi bg-stone-100' : 'text-stone-500 hover:text-sumi hover:bg-stone-50'}`}
    >
      <Icon className={`w-4 h-4 ${isActive(to) ? 'text-vermillion' : ''}`} />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 bg-washi/90 backdrop-blur-md border-b border-stone-200 h-16 px-6 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-4 z-50">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-8 h-8 bg-sumi text-washi flex items-center justify-center font-serif font-bold text-lg rounded-sm group-hover:bg-vermillion transition-colors">
            W
          </div>
          <span className="font-serif font-bold tracking-tighter text-xl">
            WAZA <span className="font-sans font-normal text-xs text-stone-500 ml-1 tracking-wide opacity-60 hidden sm:inline">SUMO MECHANICS</span>
          </span>
        </Link>
      </div>

      {/* Desktop Menu - Hidden on Mobile, Visible on MD+ */}
      <div className="hidden md:flex items-center gap-4">
        <Link 
          to="/" 
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/') ? 'text-indigo' : 'text-stone-500 hover:text-sumi'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Index</span>
        </Link>
        <Link 
          to="/referee" 
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/referee') ? 'text-vermillion' : 'text-stone-500 hover:text-sumi'}`}
        >
          <Shield className="w-4 h-4" />
          <span>Gyoji Mode</span>
        </Link>
        <Link 
          to="/admin" 
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive('/admin') ? 'text-sumi' : 'text-stone-500 hover:text-sumi'}`}
        >
          <Move className="w-4 h-4" />
          <span>Dojo</span>
        </Link>
      </div>

      {/* Mobile Menu Toggle - Visible on Mobile, Hidden on MD+ */}
      <button 
        className="md:hidden p-2 hover:bg-stone-200 rounded-full transition-colors z-50 relative"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
          {isMobileMenuOpen ? <X className="w-5 h-5 text-sumi" /> : <Menu className="w-5 h-5 text-sumi" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-washi/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center md:hidden animate-in fade-in slide-in-from-top-5 duration-200">
           <div className="flex flex-col gap-4 w-full max-w-xs">
              <NavLink to="/" icon={BookOpen} label="Technique Index" onClick={() => setIsMobileMenuOpen(false)} />
              <NavLink to="/referee" icon={Shield} label="Gyoji Mode" onClick={() => setIsMobileMenuOpen(false)} />
              <NavLink to="/admin" icon={Move} label="Dojo Editor" onClick={() => setIsMobileMenuOpen(false)} />
              
              <div className="h-px bg-stone-200 my-2 w-full"></div>
              
              <p className="text-center text-stone-400 text-xs font-serif italic px-4">
                The Sumo Mechanics Index
              </p>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;