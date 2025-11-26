import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTechniques } from '../hooks/useTechniques';
import PhysicsVisualizer from '../components/PhysicsVisualizer';
import { ArrowLeft, Play, Pause, Layers, Share2, Check, Split, X, Search, Info, Quote, Loader2 } from 'lucide-react';
import { Rarity } from '../types';

const TechniqueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { techniques: TECHNIQUES, loading } = useTechniques();
  const technique = TECHNIQUES.find(t => t.id === id);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [showPhysics, setShowPhysics] = useState(true);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // Comparison State
  const [compareId, setCompareId] = useState<string | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareSearch, setCompareSearch] = useState('');

  const compareTechnique = compareId ? TECHNIQUES.find(t => t.id === compareId) : null;

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
    setFrameIndex(0);
    setIsPlaying(true);
    setCompareId(null);
  }, [id]);

  // Smooth Animation loop using RequestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    let lastTime: number | null = null;

    const animate = (time: number) => {
      if (!isPlaying || !technique) {
        lastTime = null; 
        return;
      }

      if (lastTime === null) {
        lastTime = time;
      }
      
      const delta = (time - lastTime) / 1000; // Time in seconds
      lastTime = time;

      // Speed: 1 keyframe every 0.8 seconds (1.25 frames per second)
      const speed = 1.25; 
      
      setFrameIndex((prev) => prev + delta * speed);
      
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, technique]);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFrameIndex(parseFloat(e.target.value));
    setIsPlaying(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const getRarityColor = (r: Rarity) => {
     switch(r) {
        case Rarity.COMMON: return 'bg-stone-200 text-stone-600';
        case Rarity.UNCOMMON: return 'bg-indigo-100 text-indigo-800';
        case Rarity.RARE: return 'bg-vermillion text-white';
        case Rarity.LEGENDARY: return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
        default: return 'bg-stone-200 text-stone-600';
     }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (!technique) {
    return <div className="p-12 text-center font-serif text-stone-400 italic">Technique not found within the archives.</div>;
  }

  // Filter techniques for comparison modal
  const comparisonOptions = TECHNIQUES.filter(t => 
    t.id !== technique.id && 
    (t.name.toLowerCase().includes(compareSearch.toLowerCase()) || t.translation.toLowerCase().includes(compareSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
      {/* Desktop Layout: Split View */}
      <div className="flex flex-col lg:flex-row h-full">
        
        {/* Left Pane: Visualizer */}
        <div className="lg:w-1/2 h-[50vh] lg:h-full relative bg-stone-100 border-r border-stone-200 flex flex-col transition-all duration-500 group">
           {/* Back Button Overlay */}
           <button 
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 z-20 bg-white/90 hover:bg-white text-stone-500 hover:text-sumi px-4 py-2 rounded-full shadow-sm backdrop-blur-sm transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-stone-200"
           >
             <ArrowLeft className="w-4 h-4" /> Index
           </button>

           {/* Main Canvas Area */}
           <div className="flex-grow relative flex overflow-hidden bg-stone-100/50">
              {compareTechnique ? (
                 // Split Screen Mode
                 <div className="w-full h-full grid grid-cols-2 divide-x divide-stone-200">
                    <div className="relative w-full h-full">
                        <PhysicsVisualizer 
                            frames={technique.animationFrames} 
                            frameIndex={frameIndex}
                            showPhysics={showPhysics}
                            label={technique.name}
                            rarity={technique.rarity}
                        />
                    </div>
                    <div className="relative w-full h-full bg-stone-50">
                        <PhysicsVisualizer 
                            frames={compareTechnique.animationFrames} 
                            frameIndex={frameIndex}
                            showPhysics={showPhysics}
                            label={compareTechnique.name}
                            rarity={compareTechnique.rarity}
                        />
                        <button 
                            onClick={() => setCompareId(null)}
                            className="absolute top-20 right-6 z-30 p-2 bg-white/90 hover:bg-red-50 text-stone-400 hover:text-vermillion rounded-full shadow-sm transition-colors border border-stone-200"
                            title="Close Comparison"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                 </div>
              ) : (
                 // Single Mode
                 <PhysicsVisualizer 
                    frames={technique.animationFrames} 
                    frameIndex={frameIndex}
                    showPhysics={showPhysics}
                    label={technique.name}
                    rarity={technique.rarity}
                 />
              )}
           </div>

           {/* Controls Bar */}
           <div className="bg-white border-t border-stone-200 p-4 flex flex-col gap-4 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
              {/* Scrubber */}
              <div className="w-full flex items-center gap-3">
                 <span className="text-[10px] font-mono text-stone-400 w-8 text-right">0%</span>
                 <input 
                    type="range" 
                    min="0" 
                    max={technique.animationFrames.length} 
                    step="0.01"
                    value={frameIndex % technique.animationFrames.length} 
                    onChange={handleScrub}
                    className="flex-grow h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-vermillion hover:accent-indigo transition-colors"
                  />
                 <span className="text-[10px] font-mono text-stone-400 w-8">100%</span>
              </div>

              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="flex items-center gap-2 px-4 py-2 bg-sumi hover:bg-indigo text-white rounded-sm transition-colors text-xs font-bold uppercase tracking-widest"
                    >
                      {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </button>

                    <div className="h-6 w-px bg-stone-200 mx-2"></div>

                    <button 
                      onClick={() => setShowPhysics(!showPhysics)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-sm transition-colors text-xs font-bold uppercase tracking-widest border ${showPhysics ? 'bg-indigo/5 border-indigo text-indigo' : 'border-transparent text-stone-400 hover:text-sumi hover:bg-stone-50'}`}
                    >
                      <Layers className="w-4 h-4" />
                      <span className="hidden sm:inline">Vectors</span>
                    </button>

                    <button 
                      onClick={() => setShowCompareModal(true)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-sm transition-colors text-xs font-bold uppercase tracking-widest border ${compareId ? 'bg-vermillion/5 border-vermillion text-vermillion' : 'border-transparent text-stone-400 hover:text-sumi hover:bg-stone-50'}`}
                    >
                      <Split className="w-4 h-4" />
                      <span className="hidden sm:inline">{compareId ? 'Synced' : 'Compare'}</span>
                    </button>
                 </div>

                 <div className="text-[10px] font-mono text-stone-300 hidden sm:block">
                     PLAYBACK SPEED 1.0X
                 </div>
              </div>
           </div>
        </div>

        {/* Right Pane: Narrative Info */}
        <div className="lg:w-1/2 h-auto lg:h-full overflow-y-auto bg-washi relative custom-scrollbar">
          {/* Background Kanji Watermark */}
          <div className="absolute top-0 right-0 text-[18rem] font-serif font-black text-sumi opacity-[0.03] leading-none pointer-events-none select-none overflow-hidden z-0 origin-top-right transform translate-x-10 -translate-y-10">
            {technique.kanji}
          </div>

          <div className="relative z-10 p-8 lg:p-16 max-w-2xl mx-auto">
            
            {/* Header Info */}
            <div className="mb-12 border-b border-stone-200 pb-8">
              <div className="flex items-center justify-between mb-6">
                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${getRarityColor(technique.rarity)}`}>
                  {technique.rarity}
                </span>
                <span className="text-stone-400 text-xs font-serif italic">No. {TECHNIQUES.indexOf(technique) + 1} / 82</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-serif font-black text-sumi mb-2 tracking-tighter leading-none">
                {technique.name}
              </h1>
              
              <div className="flex items-baseline gap-4 mt-4">
                  <h2 className="text-xl font-sans text-stone-500 font-medium uppercase tracking-wide">
                    {technique.translation}
                  </h2>
                  <span className="text-4xl font-serif text-stone-300 font-bold">{technique.kanji}</span>
              </div>
            </div>

            {/* Narrative */}
            <div className="mb-12">
               <div className="flex gap-4">
                  <Quote className="w-8 h-8 text-stone-200 flex-shrink-0 fill-stone-200" />
                  <p className="font-serif text-lg text-stone-700 leading-relaxed text-justify">
                    {technique.description}
                  </p>
               </div>
            </div>

            {/* Mechanics Data Sheet */}
            <div className="mb-12">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">
                    <Info className="w-4 h-4" /> Anatomy of the Win
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                    {/* Principle Card */}
                    <div className="bg-white border border-stone-200 p-6 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)]">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-indigo mb-2 flex items-center gap-2">
                           <div className="w-2 h-2 bg-indigo rounded-full"></div> Physics Principle
                        </div>
                        <p className="text-2xl font-serif font-bold text-sumi">
                           {technique.mechanics.principle}
                        </p>
                    </div>

                    {/* Vectors Card */}
                    <div className="bg-white border border-stone-200 p-6 shadow-[4px_4px_0px_0px_rgba(231,229,228,1)]">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-vermillion mb-4 flex items-center gap-2">
                           <div className="w-2 h-2 bg-vermillion rounded-full"></div> Key Vectors
                        </div>
                        <ul className="space-y-3">
                           {technique.mechanics.keyPoints.map((point, i) => (
                              <li key={i} className="flex items-start gap-3 text-stone-600 text-sm font-medium">
                                 <span className="font-mono text-stone-300 text-xs pt-0.5">0{i+1}</span>
                                 {point}
                              </li>
                           ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Practitioners */}
            <div className="mb-12">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6 border-b border-stone-200 pb-2">Legendary Masters</h4>
              <div className="flex gap-3 flex-wrap">
                {technique.practitioners.map(p => (
                  <span 
                    key={p} 
                    className="px-4 py-2 bg-white border border-stone-200 text-sumi font-serif text-sm font-medium shadow-sm hover:border-sumi hover:shadow-md transition-all cursor-default"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-16 pt-8 border-t border-stone-200">
               <button 
                 onClick={handleShare}
                 className={`flex-1 flex items-center justify-center gap-2 py-4 border text-xs font-bold uppercase tracking-widest transition-all duration-300
                   ${isCopied 
                     ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                     : 'bg-white border-stone-200 text-stone-500 hover:border-sumi hover:text-sumi hover:bg-stone-50'
                   }`}
               >
                  {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {isCopied ? 'Copied to Clipboard' : 'Share Technique'}
               </button>
            </div>

          </div>
        </div>
      </div>

      {/* Comparison Selection Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sumi/60 backdrop-blur-sm p-4 sm:p-6">
          <div className="bg-washi w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in duration-200 border border-stone-200">
             <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-xl font-serif font-bold text-sumi">Compare Technique</h3>
                  <p className="text-stone-500 text-xs mt-1 uppercase tracking-wide">Select a second move to analyze side-by-side</p>
                </div>
                <button onClick={() => setShowCompareModal(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                   <X className="w-5 h-5 text-stone-400 hover:text-vermillion" />
                </button>
             </div>
             
             <div className="p-4 bg-stone-50 border-b border-stone-200">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                    <input 
                      autoFocus
                      type="text" 
                      placeholder="Search by name or mechanic..." 
                      value={compareSearch}
                      onChange={(e) => setCompareSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-sm focus:outline-none focus:border-indigo focus:ring-1 focus:ring-indigo/20 text-sm font-medium"
                    />
                </div>
             </div>

             <div className="overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-stone-50/50">
                {comparisonOptions.map(t => (
                  <button 
                    key={t.id}
                    onClick={() => {
                      setCompareId(t.id);
                      setShowCompareModal(false);
                    }}
                    className="flex items-center gap-4 p-4 bg-white border border-stone-200 hover:border-indigo hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all text-left group rounded-sm"
                  >
                    <div className="w-12 h-12 bg-stone-50 border border-stone-100 flex items-center justify-center font-serif font-bold text-xl text-stone-300 group-hover:text-indigo group-hover:bg-indigo/5 group-hover:border-indigo/20 rounded-full transition-colors">
                       {t.kanji.charAt(0)}
                    </div>
                    <div>
                       <div className="font-bold text-sumi group-hover:text-indigo transition-colors">{t.name}</div>
                       <div className="text-xs text-stone-500 uppercase tracking-wider">{t.translation}</div>
                    </div>
                  </button>
                ))}
                {comparisonOptions.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-stone-400 text-sm italic bg-stone-50 border border-dashed border-stone-200 rounded-sm">
                    No matching techniques found in the archives.
                  </div>
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniqueDetail;