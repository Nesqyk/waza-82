import React, { useState, useEffect } from 'react';
import { TECHNIQUES } from '../constants';
import TechniqueCard from '../components/TechniqueCard';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, AlignLeft, Trophy, Star, Zap, Shield, ChevronLeft, ChevronRight } from 'lucide-react';
import { Rarity } from '../types';

type SortOption = 'name_asc' | 'name_desc' | 'rarity_asc' | 'rarity_desc';

const ITEMS_PER_PAGE = 12;

const TechniqueDeck: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('name_asc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeRarity, setActiveRarity] = useState<Rarity | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, activeRarity, sortOption]);

  const rarityOrder = {
    [Rarity.COMMON]: 1,
    [Rarity.UNCOMMON]: 2,
    [Rarity.RARE]: 3,
    [Rarity.LEGENDARY]: 4
  };

  const filteredTechniques = TECHNIQUES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(filter.toLowerCase()) ||
                          t.translation.toLowerCase().includes(filter.toLowerCase());
    const matchesRarity = activeRarity === 'ALL' || t.rarity === activeRarity;
    return matchesSearch && matchesRarity;
  });

  const sortedTechniques = [...filteredTechniques].sort((a, b) => {
    switch (sortOption) {
      case 'name_asc': return a.name.localeCompare(b.name);
      case 'name_desc': return b.name.localeCompare(a.name);
      case 'rarity_asc': return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      case 'rarity_desc': return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      default: return 0;
    }
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedTechniques.length / ITEMS_PER_PAGE);
  const paginatedTechniques = sortedTechniques.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getSortLabel = (opt: SortOption) => {
    switch(opt) {
      case 'name_asc': return 'Alphabetical (A-Z)';
      case 'name_desc': return 'Alphabetical (Z-A)';
      case 'rarity_asc': return 'Rarity (Ascending)';
      case 'rarity_desc': return 'Rarity (Descending)';
    }
  };

  const counts = {
    ALL: TECHNIQUES.length,
    [Rarity.COMMON]: TECHNIQUES.filter(t => t.rarity === Rarity.COMMON).length,
    [Rarity.UNCOMMON]: TECHNIQUES.filter(t => t.rarity === Rarity.UNCOMMON).length,
    [Rarity.RARE]: TECHNIQUES.filter(t => t.rarity === Rarity.RARE).length,
    [Rarity.LEGENDARY]: TECHNIQUES.filter(t => t.rarity === Rarity.LEGENDARY).length,
  };

  const TabButton = ({ type, icon: Icon, label, count }: any) => (
    <button
      onClick={() => setActiveRarity(type)}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap
        ${activeRarity === type 
            ? 'bg-sumi text-white border-sumi shadow-lg' 
            : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:bg-stone-50'}
      `}
    >
       {Icon && <Icon className={`w-3 h-3 ${activeRarity === type ? 'text-vermillion' : 'text-stone-400'}`} />}
       <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
       <span className={`ml-1 text-[10px] font-mono ${activeRarity === type ? 'text-stone-400' : 'text-stone-300'}`}>{count}</span>
    </button>
  );

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 min-h-screen">
      
      {/* Hero Section */}
      <div className="relative mb-16 pt-8">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-32 h-1 bg-vermillion"></div>
         <h1 className="text-6xl md:text-8xl font-serif font-black text-sumi tracking-tighter mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-sumi to-stone-600">82</span> <br className="hidden md:block"/> Kimarite
         </h1>
         <div className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between border-b border-stone-200 pb-12">
             <p className="text-stone-500 text-lg md:text-xl max-w-2xl font-serif leading-relaxed">
                The official winning techniques of Grand Sumo, codified by the Japan Sumo Association. 
                Explore the physics, leverage, and mechanics behind every throw, push, and trip.
             </p>
             
             {/* Search Input */}
             <div className="w-full md:w-auto min-w-[300px] relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-indigo transition-colors w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search techniques..." 
                    className="w-full pl-12 pr-4 py-4 bg-white border-b-2 border-stone-200 focus:border-indigo focus:outline-none text-lg font-serif transition-colors placeholder-stone-300 text-sumi"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
             </div>
         </div>
      </div>

      {/* Controls & Filters */}
      <div className="sticky top-20 z-40 bg-washi/95 backdrop-blur-md py-4 mb-8 -mx-6 px-6 border-b border-stone-200/50 transition-all">
         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Rarity Tabs - Scrollable on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
                <TabButton type="ALL" icon={AlignLeft} label="All Moves" count={counts.ALL} />
                <div className="w-px h-6 bg-stone-300 mx-2 hidden lg:block"></div>
                <TabButton type={Rarity.COMMON} icon={Shield} label="Common" count={counts[Rarity.COMMON]} />
                <TabButton type={Rarity.UNCOMMON} icon={Zap} label="Uncommon" count={counts[Rarity.UNCOMMON]} />
                <TabButton type={Rarity.RARE} icon={Star} label="Rare" count={counts[Rarity.RARE]} />
                <TabButton type={Rarity.LEGENDARY} icon={Trophy} label="Legendary" count={counts[Rarity.LEGENDARY]} />
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-shrink-0 self-end lg:self-auto">
                <button 
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-sumi transition-colors"
                >
                   <span className="text-stone-300">Sort by:</span> {getSortLabel(sortOption)} <ChevronDown className="w-3 h-3" />
                </button>
                
                {showSortMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-stone-200 shadow-xl rounded-sm z-50 py-1">
                    {(['name_asc', 'name_desc', 'rarity_asc', 'rarity_desc'] as SortOption[]).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSortOption(opt);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-stone-50 transition-colors ${sortOption === opt ? 'text-indigo bg-indigo/5' : 'text-stone-600'}`}
                      >
                        {getSortLabel(opt)}
                      </button>
                    ))}
                  </div>
                )}
            </div>
         </div>
      </div>

      {/* Results Grid */}
      <div className="min-h-[50vh]">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-8 gap-y-12">
            {paginatedTechniques.map((tech) => (
            <div key={tech.id}>
                <TechniqueCard 
                    technique={tech} 
                    onClick={() => navigate(`/technique/${tech.id}`)} 
                />
            </div>
            ))}
         </div>

         {sortedTechniques.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-stone-200 rounded-lg bg-stone-50/50">
               <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-stone-300" />
               </div>
               <h3 className="text-xl font-serif font-bold text-stone-400">No techniques found</h3>
               <p className="text-stone-400 mt-2">Try adjusting your filters or search query.</p>
               <button 
                  onClick={() => { setFilter(''); setActiveRarity('ALL'); }}
                  className="mt-6 px-6 py-2 bg-white border border-stone-200 text-xs font-bold uppercase tracking-widest text-sumi hover:border-sumi transition-colors shadow-sm"
               >
                  Clear Filters
               </button>
            </div>
         )}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
         <div className="mt-16 pt-10 border-t border-stone-200 flex items-center justify-between">
            <p className="text-stone-400 text-xs font-mono uppercase tracking-widest hidden sm:block">
               Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedTechniques.length)} of {sortedTechniques.length}
            </p>
            
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
               <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full border border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-sumi disabled:opacity-30 disabled:cursor-not-allowed transition-all"
               >
                  <ChevronLeft className="w-4 h-4" />
               </button>
               
               <div className="flex items-center px-4 gap-2">
                  <span className="text-sm font-bold text-sumi">{currentPage}</span>
                  <span className="text-xs text-stone-400 uppercase">of</span>
                  <span className="text-sm font-bold text-stone-500">{totalPages}</span>
               </div>

               <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-full border border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-sumi disabled:opacity-30 disabled:cursor-not-allowed transition-all"
               >
                  <ChevronRight className="w-4 h-4" />
               </button>
            </div>
         </div>
      )}

      {/* Bottom Stat (Mobile only if paginated, standard if not) */}
      <div className="mt-8 text-center sm:hidden">
         <p className="text-stone-400 text-xs font-mono uppercase tracking-widest">
            {sortedTechniques.length} Total Techniques
         </p>
      </div>
    </div>
  );
};

export default TechniqueDeck;