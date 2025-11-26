import React from 'react';
import { Technique, Rarity } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface Props {
  technique: Technique;
  onClick: () => void;
}

const TechniqueCard: React.FC<Props> = ({ technique, onClick }) => {
  const getRarityColor = (r: Rarity) => {
     switch(r) {
        case Rarity.COMMON: return 'text-stone-500 border-stone-200 bg-stone-100';
        case Rarity.UNCOMMON: return 'text-indigo-600 border-indigo-200 bg-indigo-50';
        case Rarity.RARE: return 'text-vermillion border-red-200 bg-red-50';
        case Rarity.LEGENDARY: return 'text-yellow-600 border-yellow-200 bg-yellow-50';
        default: return 'text-stone-500 border-stone-200';
     }
  };

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white border border-stone-200 aspect-[4/5] cursor-pointer overflow-hidden flex flex-col transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Background Watermark */}
      <div className="absolute -right-8 -top-8 text-[10rem] leading-none font-serif font-black text-stone-900 opacity-[0.02] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-700 pointer-events-none select-none z-0 rotate-12">
        {technique.kanji}
      </div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start p-6">
         <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${getRarityColor(technique.rarity)}`}>
            {technique.rarity}
         </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-4 pb-2">
         {/* Circle Graphic */}
         <div className="w-24 h-24 mb-6 rounded-full border-2 border-stone-100 flex items-center justify-center bg-stone-50 group-hover:bg-white group-hover:border-indigo-100 group-hover:shadow-lg transition-all duration-500 relative overflow-hidden">
            <span className="text-5xl font-serif font-bold text-stone-800 group-hover:text-indigo-900 transition-colors relative z-10">
               {technique.kanji.charAt(0)}
            </span>
         </div>

         <h3 className="text-2xl font-serif font-bold text-sumi tracking-tight group-hover:text-vermillion transition-colors duration-300 mb-1">
            {technique.name}
         </h3>
         <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-wider">
            {technique.translation}
         </p>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 p-5 border-t border-stone-100 bg-stone-50/30 group-hover:bg-white transition-colors flex justify-between items-center">
         <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">Principle</span>
            <span className="text-xs font-serif font-bold text-stone-700">{technique.mechanics.principle}</span>
         </div>

         <div className="w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 text-stone-400 group-hover:bg-sumi group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
            <ArrowUpRight className="w-4 h-4" />
         </div>
      </div>
      
      {/* Decorative bottom border line that animates */}
      <div className="absolute bottom-0 left-0 h-1 bg-indigo-600 w-0 group-hover:w-full transition-all duration-500 ease-out z-20" />
    </div>
  );
};

export default TechniqueCard;