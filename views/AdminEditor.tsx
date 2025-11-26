import React, { useState, useRef, useEffect } from 'react';
import { SkeletonFrame, Vector2, Technique, Rarity } from '../types';
import { useTechniques } from '../hooks/useTechniques';
import { Copy, Move, Plus, Trash2, Play, Pause, Layers, ArrowUpRight, Settings2, FilePlus, Edit2, Search, Filter, Monitor, PenTool, ChevronDown, ChevronRight, Loader2, Save } from 'lucide-react';

// Default starting pose
const INITIAL_FRAME: SkeletonFrame = {
  attacker: { head: {x: 40, y: 30}, center: {x: 40, y: 50}, hands: {x: 50, y: 40}, feet: {x: 35, y: 80} },
  defender: { head: {x: 60, y: 30}, center: {x: 60, y: 50}, hands: {x: 50, y: 45}, feet: {x: 65, y: 80} },
  forces: []
};

const INITIAL_METADATA: Partial<Technique> = {
  id: '',
  name: '',
  kanji: '',
  translation: '',
  rarity: Rarity.COMMON,
  description: '',
  mechanics: {
    principle: '',
    keyPoints: []
  },
  practitioners: []
};

type DragTarget = 
  | { type: 'joint', wrestler: 'attacker' | 'defender', joint: keyof SkeletonFrame['attacker'] }
  | { type: 'force-origin', index: number }
  | { type: 'force-tip', index: number };

const AdminEditor: React.FC = () => {
  const { techniques: TECHNIQUES, loading, saveTechnique, removeTechnique } = useTechniques();

  // Animation State
  const [frames, setFrames] = useState<SkeletonFrame[]>([INITIAL_FRAME]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [onionSkin, setOnionSkin] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [activeSnapPoint, setActiveSnapPoint] = useState<Vector2 | null>(null);

  // Metadata State
  const [metadata, setMetadata] = useState(INITIAL_METADATA);
  const [practitionersString, setPractitionersString] = useState('');
  const [keyPointsString, setKeyPointsString] = useState('');

  // Interaction State
  const [dragTarget, setDragTarget] = useState<DragTarget | null>(null);
  const [selectedForce, setSelectedForce] = useState<number | null>(null);
  const [forceDetailsOpen, setForceDetailsOpen] = useState(true);
  const svgRef = useRef<SVGSVGElement>(null);
  const [jsonOutput, setJsonOutput] = useState('');
  const [showJson, setShowJson] = useState(false);
  
  // Management State
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState<Rarity | 'ALL'>('ALL');
  const [saving, setSaving] = useState(false);

  // Layout State
  const [mobileTab, setMobileTab] = useState<'canvas' | 'studio'>('canvas');

  // --- PLAYBACK LOGIC ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrameIndex(prev => (prev + 1) % frames.length);
      }, 500); // 2 FPS for previewing poses
    }
    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  // --- JSON GENERATION ---
  useEffect(() => {
    const fullTechnique = {
      ...metadata,
      mechanics: {
        ...metadata.mechanics,
        keyPoints: keyPointsString.split(',').map(s => s.trim()).filter(s => s.length > 0)
      },
      practitioners: practitionersString.split(',').map(s => s.trim()).filter(s => s.length > 0),
      animationFrames: frames
    };
    setJsonOutput(JSON.stringify(fullTechnique, null, 2));
  }, [frames, metadata, practitionersString, keyPointsString]);

  // --- TECHNIQUE MANAGEMENT ---
  const loadTechnique = (id: string) => {
    const tech = TECHNIQUES.find(t => t.id === id);
    if (tech) {
      setMetadata({
        id: tech.id,
        name: tech.name,
        kanji: tech.kanji,
        translation: tech.translation,
        rarity: tech.rarity,
        description: tech.description,
        mechanics: tech.mechanics,
        practitioners: tech.practitioners
      });
      setPractitionersString(tech.practitioners.join(', '));
      setKeyPointsString(tech.mechanics.keyPoints.join(', '));
      setFrames(JSON.parse(JSON.stringify(tech.animationFrames))); // Deep copy
      setCurrentFrameIndex(0);
      setLoadedId(id);
      setIsPlaying(false);
      // Auto switch to studio on mobile to show loaded details? Or stay on canvas?
      // Staying on canvas/list allows editing.
    }
  };

  const handleNewTechnique = () => {
    if (frames.length > 1 && !window.confirm("Start new technique? Any unsaved changes will be lost.")) {
      return;
    }
    setMetadata(INITIAL_METADATA);
    setPractitionersString('');
    setKeyPointsString('');
    setFrames([JSON.parse(JSON.stringify(INITIAL_FRAME))]);
    setCurrentFrameIndex(0);
    setLoadedId(null);
    setIsPlaying(false);
  };

  const handleDeleteTechnique = async (id: string) => {
     if (window.confirm(`Are you sure you want to delete ${id}? This will remove it from Firestore.`)) {
         try {
           await removeTechnique(id);
           if (loadedId === id) {
               handleNewTechnique();
           }
         } catch (err) {
           console.error('Delete failed:', err);
           alert('Failed to delete technique.');
         }
     }
  };

  const handleSaveToFirestore = async () => {
    if (!metadata.id) {
      alert('Please provide a technique ID.');
      return;
    }
    setSaving(true);
    try {
      const fullTechnique: Technique = {
        id: metadata.id!,
        name: metadata.name || '',
        kanji: metadata.kanji || '',
        translation: metadata.translation || '',
        rarity: metadata.rarity || Rarity.COMMON,
        description: metadata.description || '',
        mechanics: {
          principle: metadata.mechanics?.principle || '',
          keyPoints: keyPointsString.split(',').map(s => s.trim()).filter(s => s.length > 0)
        },
        practitioners: practitionersString.split(',').map(s => s.trim()).filter(s => s.length > 0),
        animationFrames: frames
      };
      await saveTechnique(fullTechnique);
      setLoadedId(fullTechnique.id);
      alert('Technique saved to Firestore!');
    } catch (err) {
      console.error('Save failed:', err);
      alert('Failed to save technique.');
    } finally {
      setSaving(false);
    }
  };

  // --- INTERACTION HANDLERS ---
  const getCoordinates = (e: React.MouseEvent | MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const CTM = svgRef.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    const x = (e.clientX - CTM.e) / CTM.a;
    const y = (e.clientY - CTM.f) / CTM.d;
    return { x: Math.round(x / 2), y: Math.round(y / 2) };
  };

  // Helper to find nearest snap point (joints)
  const findSnapPoint = (coords: Vector2, currentFrame: SkeletonFrame): Vector2 | null => {
    if (!snapEnabled) return null;
    
    const threshold = 5; // Snap distance
    const points: Vector2[] = [
      ...Object.values(currentFrame.attacker),
      ...Object.values(currentFrame.defender)
    ];

    let nearest: Vector2 | null = null;
    let minDist = Infinity;

    for (const p of points) {
      const dist = Math.sqrt(Math.pow(p.x - coords.x, 2) + Math.pow(p.y - coords.y, 2));
      if (dist < threshold && dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    }
    return nearest;
  };

  const handleMouseDown = (target: DragTarget) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setDragTarget(target);
    if (target.type.startsWith('force')) {
      // @ts-ignore
      setSelectedForce(target.index);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setSelectedForce(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragTarget || isPlaying) return;
    
    let coords = getCoordinates(e);
    const newFrames = [...frames];
    const currentFrame = newFrames[currentFrameIndex];

    // Snapping Logic for Forces
    setActiveSnapPoint(null);
    if (dragTarget.type === 'force-origin' || dragTarget.type === 'force-tip') {
       const snap = findSnapPoint(coords, currentFrame);
       if (snap) {
         coords = snap;
         setActiveSnapPoint(snap);
       }
    }

    if (dragTarget.type === 'joint') {
      currentFrame[dragTarget.wrestler][dragTarget.joint] = coords;
    } else if (dragTarget.type === 'force-origin') {
      if (currentFrame.forces && currentFrame.forces[dragTarget.index]) {
        currentFrame.forces[dragTarget.index].origin = coords;
      }
    } else if (dragTarget.type === 'force-tip') {
      if (currentFrame.forces && currentFrame.forces[dragTarget.index]) {
        const origin = currentFrame.forces[dragTarget.index].origin;
        currentFrame.forces[dragTarget.index].direction = {
          x: coords.x - origin.x,
          y: coords.y - origin.y
        };
      }
    }
    setFrames(newFrames);
  };

  const handleMouseUp = () => {
    setDragTarget(null);
    setActiveSnapPoint(null);
  };

  // --- TIMELINE ACTIONS ---
  const addFrame = () => {
    const currentFrame = frames[currentFrameIndex];
    const newFrame = JSON.parse(JSON.stringify(currentFrame));
    const newFrames = [...frames];
    newFrames.splice(currentFrameIndex + 1, 0, newFrame);
    setFrames(newFrames);
    setCurrentFrameIndex(currentFrameIndex + 1);
  };

  const deleteFrame = () => {
    if (frames.length <= 1) return;
    const newFrames = frames.filter((_, i) => i !== currentFrameIndex);
    setFrames(newFrames);
    setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1));
  };

  // --- FORCE ACTIONS ---
  const addForce = () => {
    const newFrames = [...frames];
    const current = newFrames[currentFrameIndex];
    if (!current.forces) current.forces = [];
    current.forces.push({
      origin: { x: 50, y: 50 },
      direction: { x: 20, y: -20 },
      magnitude: 1,
      type: 'push'
    });
    setFrames(newFrames);
    setSelectedForce(current.forces.length - 1);
  };

  const updateForce = (key: string, value: any) => {
    if (selectedForce === null) return;
    const newFrames = [...frames];
    const current = newFrames[currentFrameIndex];
    if (current.forces && current.forces[selectedForce]) {
      // @ts-ignore
      current.forces[selectedForce][key] = value;
      setFrames(newFrames);
    }
  };

  const updateForceVector = (prop: 'origin' | 'direction', axis: 'x' | 'y', val: number) => {
    if (selectedForce === null) return;
    const newFrames = [...frames];
    const current = newFrames[currentFrameIndex];
    if (current.forces && current.forces[selectedForce]) {
        current.forces[selectedForce][prop][axis] = val;
        setFrames(newFrames);
    }
  };

  const deleteForce = () => {
    if (selectedForce === null) return;
    const newFrames = [...frames];
    const current = newFrames[currentFrameIndex];
    if (current.forces) {
      current.forces = current.forces.filter((_, i) => i !== selectedForce);
      setFrames(newFrames);
      setSelectedForce(null);
    }
  };

  // --- RENDER HELPERS ---
  const s = (val: number) => val * 2; 

  const renderSkeleton = (data: any, color: string, role: 'attacker' | 'defender', isGhost = false) => (
    <g opacity={isGhost ? 0.2 : 1} style={{ pointerEvents: isGhost ? 'none' : 'auto' }}>
       <g stroke={color} strokeWidth={isGhost ? "2" : "4"} strokeLinecap="round" fill="none">
          <line x1={s(data.head.x)} y1={s(data.head.y)} x2={s(data.center.x)} y2={s(data.center.y)} />
          <line x1={s(data.center.x)} y1={s(data.center.y)} x2={s(data.feet.x)} y2={s(data.feet.y)} />
          <line x1={s(data.head.x)} y1={s(data.head.y) + 15} x2={s(data.hands.x)} y2={s(data.hands.y)} />
       </g>
       {!isGhost && !isPlaying && (
         <>
           {renderHandle({ type: 'joint', wrestler: role, joint: 'head' }, data.head, color)}
           {renderHandle({ type: 'joint', wrestler: role, joint: 'center' }, data.center, color)}
           {renderHandle({ type: 'joint', wrestler: role, joint: 'hands' }, data.hands, color)}
           {renderHandle({ type: 'joint', wrestler: role, joint: 'feet' }, data.feet, color)}
         </>
       )}
    </g>
  );

  const renderHandle = (target: DragTarget, pos: Vector2, color: string, isSpecial = false) => {
    // Determine if active
    let isActive = false;
    if (dragTarget) {
        if (dragTarget.type === 'joint' && target.type === 'joint') {
            isActive = dragTarget.wrestler === target.wrestler && dragTarget.joint === target.joint;
        } else if (dragTarget.type === 'force-origin' && target.type === 'force-origin') {
            isActive = dragTarget.index === target.index;
        } else if (dragTarget.type === 'force-tip' && target.type === 'force-tip') {
            isActive = dragTarget.index === target.index;
        }
    }
    
    return (
      <circle
        cx={s(pos.x)}
        cy={s(pos.y)}
        r={isActive ? 12 : (isSpecial ? 6 : 8)}
        fill={color}
        fillOpacity={isActive ? 0.8 : 0.4}
        stroke="white"
        strokeWidth="2"
        className={`cursor-grab active:cursor-grabbing hover:fill-opacity-100 transition-all ${isSpecial ? 'hover:r-8' : ''}`}
        onMouseDown={handleMouseDown(target)}
      />
    );
  };

  const renderForce = (force: any, index: number, isGhost = false) => {
    const start = force.origin;
    const end = { x: start.x + force.direction.x, y: start.y + force.direction.y };
    const isSelected = selectedForce === index && !isGhost;
    const color = force.type === 'pull' ? '#3B82F6' : '#E34234'; // Blue for pull, Red for push

    return (
      <g key={`force-${index}`} opacity={isGhost ? 0.2 : 1} className={isGhost ? 'pointer-events-none' : ''}>
         <line 
            x1={s(start.x)} y1={s(start.y)} 
            x2={s(end.x)} y2={s(end.y)} 
            stroke={color} 
            strokeWidth={s(force.magnitude || 1)}
            markerEnd={isGhost ? undefined : `url(#arrow-${index})`}
         />
         {!isGhost && (
             <defs>
                <marker id={`arrow-${index}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L9,3 z" fill={color} />
                </marker>
             </defs>
         )}
         {!isGhost && !isPlaying && (
            <>
               {/* Dashed line for easier grabbing of thin vectors */}
               {isSelected && <line x1={s(start.x)} y1={s(start.y)} x2={s(end.x)} y2={s(end.y)} stroke="transparent" strokeWidth="20" className="cursor-move" onMouseDown={() => setSelectedForce(index)} />}
               
               {renderHandle({ type: 'force-origin', index }, start, color, true)}
               {renderHandle({ type: 'force-tip', index }, end, color, true)}
            </>
         )}
      </g>
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonOutput);
    alert('Full Technique JSON copied!');
  };

  const filteredTechniques = TECHNIQUES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = rarityFilter === 'ALL' || t.rarity === rarityFilter;
    return matchesSearch && matchesRarity;
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden" onMouseUp={handleMouseUp}>
      
      {/* LEFT: CANVAS & TIMELINE (Hidden on mobile if tab is 'studio') */}
      <div className={`flex-grow bg-stone-100 flex flex-col relative border-r border-stone-200 ${mobileTab === 'studio' ? 'hidden lg:flex' : 'flex'}`}>
        
        {/* Toolbar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-4">
            <h1 className="text-2xl font-serif font-bold text-sumi flex items-center gap-2">
              <Move className="w-6 h-6" /> <span className="hidden sm:inline">Dojo Editor</span>
            </h1>
            <button 
                onClick={addForce}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-vermillion hover:text-white text-vermillion border border-vermillion/20 rounded shadow-sm text-xs font-bold uppercase tracking-wide transition-all"
            >
                <ArrowUpRight className="w-4 h-4" /> Add Vector
            </button>
          </div>
          <div className="flex gap-2 pointer-events-auto">
             <button 
               onClick={() => setOnionSkin(!onionSkin)}
               className={`p-2 rounded-md shadow-sm border transition-colors ${onionSkin ? 'bg-indigo text-white border-indigo' : 'bg-white text-stone-400 border-stone-200'}`}
               title="Toggle Onion Skin"
             >
               <Layers className="w-5 h-5" />
             </button>
             <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className={`flex items-center gap-2 px-4 py-2 rounded-md font-bold shadow-sm border transition-colors ${isPlaying ? 'bg-vermillion text-white border-vermillion' : 'bg-white text-sumi border-stone-200'}`}
             >
               {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
               <span className="hidden sm:inline">{isPlaying ? 'STOP' : 'PLAY'}</span>
             </button>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-grow flex items-center justify-center bg-washi overflow-hidden relative washi-texture cursor-crosshair" onMouseMove={handleMouseMove} onMouseDown={handleCanvasMouseDown}>
           <div className="absolute bottom-[10%] w-[60%] h-[20%] border-2 border-stone-200 rounded-[100%] opacity-50 pointer-events-none"></div>
           
           <svg 
            ref={svgRef}
            viewBox="0 0 200 200" 
            className="w-full h-full max-w-xl max-h-xl select-none"
           >
              <path d="M100 0 V200 M0 100 H200" stroke="#000" strokeOpacity="0.05" />
              
              {/* Ghost / Onion Skin (Previous Frame) */}
              {onionSkin && !isPlaying && currentFrameIndex > 0 && (
                <>
                  {renderSkeleton(frames[currentFrameIndex - 1].defender, "#E34234", 'defender', true)}
                  {renderSkeleton(frames[currentFrameIndex - 1].attacker, "#183059", 'attacker', true)}
                  {frames[currentFrameIndex - 1].forces?.map((f, i) => renderForce(f, i, true))}
                </>
              )}

              {/* Active Frame */}
              {renderSkeleton(frames[currentFrameIndex].defender, "#E34234", 'defender')}
              {renderSkeleton(frames[currentFrameIndex].attacker, "#183059", 'attacker')}
              {frames[currentFrameIndex].forces?.map((f, i) => renderForce(f, i))}

              {/* Active Snap Point Indicator */}
              {activeSnapPoint && (
                  <circle cx={s(activeSnapPoint.x)} cy={s(activeSnapPoint.y)} r="15" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 2" />
              )}
           </svg>

           {/* Force Properties Floating Panel */}
           {selectedForce !== null && frames[currentFrameIndex].forces && frames[currentFrameIndex].forces[selectedForce] && !isPlaying && (
               <div className="absolute bottom-4 left-4 bg-white border border-stone-200 shadow-xl p-4 rounded-sm w-64 animate-in slide-in-from-bottom-4 fade-in duration-200 z-20 max-h-[60vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-indigo flex items-center gap-2">
                          <Settings2 className="w-3 h-3" /> Vector Settings
                      </h4>
                      <button onClick={deleteForce} className="text-stone-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="space-y-3">
                      <div>
                          <label className="text-[10px] font-bold text-stone-400 block mb-1">TYPE</label>
                          <div className="flex gap-2">
                              {['push', 'pull', 'friction'].map(t => (
                                  <button 
                                    key={t}
                                    onClick={() => updateForce('type', t)}
                                    className={`flex-1 py-1 text-[10px] font-bold uppercase border rounded-sm transition-colors
                                        ${frames[currentFrameIndex].forces![selectedForce!].type === t 
                                            ? (t === 'pull' ? 'bg-blue-50 border-blue-500 text-blue-700' : t === 'push' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-stone-100 border-stone-400 text-stone-700')
                                            : 'bg-white border-stone-200 text-stone-400 hover:border-stone-300'}
                                    `}
                                  >
                                      {t}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Collapsible Transform Section */}
                      <div className="border border-stone-200 rounded-sm overflow-hidden">
                        <button 
                            onClick={() => setForceDetailsOpen(!forceDetailsOpen)}
                            className="w-full flex items-center justify-between bg-stone-50 p-2 text-[10px] font-bold text-stone-500 hover:text-sumi transition-colors"
                        >
                            <span>TRANSFORM</span>
                            {forceDetailsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </button>
                        
                        {forceDetailsOpen && (
                            <div className="p-2 space-y-3 bg-white border-t border-stone-100">
                                {/* Magnitude */}
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <label className="text-[10px] font-bold text-stone-400 block">MAGNITUDE</label>
                                        <span className="text-[10px] font-mono text-sumi">{frames[currentFrameIndex].forces![selectedForce!].magnitude?.toFixed(1)}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0.2" max="3" step="0.1"
                                        value={frames[currentFrameIndex].forces![selectedForce!].magnitude || 1}
                                        onChange={(e) => updateForce('magnitude', parseFloat(e.target.value))}
                                        className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-indigo"
                                    />
                                </div>

                                {/* Origin Inputs */}
                                <div>
                                    <label className="text-[10px] font-bold text-stone-400 block mb-1">ORIGIN (X, Y)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input 
                                            type="number"
                                            value={Math.round(frames[currentFrameIndex].forces![selectedForce!].origin.x)}
                                            onChange={(e) => updateForceVector('origin', 'x', parseInt(e.target.value))}
                                            className="w-full p-1 text-[10px] border border-stone-200 rounded focus:border-indigo focus:outline-none font-mono"
                                        />
                                        <input 
                                            type="number"
                                            value={Math.round(frames[currentFrameIndex].forces![selectedForce!].origin.y)}
                                            onChange={(e) => updateForceVector('origin', 'y', parseInt(e.target.value))}
                                            className="w-full p-1 text-[10px] border border-stone-200 rounded focus:border-indigo focus:outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Direction Inputs */}
                                <div>
                                    <label className="text-[10px] font-bold text-stone-400 block mb-1">DIRECTION (X, Y)</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input 
                                            type="number"
                                            value={Math.round(frames[currentFrameIndex].forces![selectedForce!].direction.x)}
                                            onChange={(e) => updateForceVector('direction', 'x', parseInt(e.target.value))}
                                            className="w-full p-1 text-[10px] border border-stone-200 rounded focus:border-indigo focus:outline-none font-mono"
                                        />
                                        <input 
                                            type="number"
                                            value={Math.round(frames[currentFrameIndex].forces![selectedForce!].direction.y)}
                                            onChange={(e) => updateForceVector('direction', 'y', parseInt(e.target.value))}
                                            className="w-full p-1 text-[10px] border border-stone-200 rounded focus:border-indigo focus:outline-none font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                      </div>
                  </div>
               </div>
           )}
        </div>

        {/* Timeline Strip */}
        <div className="h-32 bg-white border-t border-stone-200 flex flex-col mb-12 lg:mb-0">
           <div className="px-4 py-2 border-b border-stone-100 flex justify-between items-center">
              <span className="text-xs font-bold text-stone-400 uppercase">Animation Timeline ({frames.length} frames)</span>
              <div className="flex gap-2">
                 <button onClick={deleteFrame} className="p-1 text-stone-400 hover:text-vermillion" title="Delete Frame"><Trash2 className="w-4 h-4" /></button>
                 <button onClick={addFrame} className="flex items-center gap-1 px-2 py-1 bg-stone-100 hover:bg-indigo hover:text-white rounded text-xs font-bold transition-colors">
                    <Plus className="w-3 h-3" /> ADD FRAME
                 </button>
              </div>
           </div>
           <div className="flex-grow overflow-x-auto p-4 flex gap-3 items-center">
              {frames.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentFrameIndex(idx)}
                  className={`
                    relative w-16 h-16 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                    ${currentFrameIndex === idx ? 'border-indigo bg-indigo/5 ring-2 ring-indigo/20' : 'border-stone-200 hover:border-stone-300 bg-stone-50'}
                  `}
                >
                  <span className={`text-xs font-bold ${currentFrameIndex === idx ? 'text-indigo' : 'text-stone-400'}`}>{idx + 1}</span>
                  {frames[idx].forces && frames[idx].forces.length > 0 && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-vermillion rounded-full"></div>
                  )}
                </button>
              ))}
              <button onClick={addFrame} className="w-16 h-16 rounded-md border-2 border-dashed border-stone-200 flex items-center justify-center hover:bg-stone-50 hover:border-stone-300 transition-colors flex-shrink-0">
                 <Plus className="w-6 h-6 text-stone-300" />
              </button>
           </div>
        </div>
      </div>

      {/* RIGHT: METADATA FORM & MANAGER (Hidden on mobile if tab is 'canvas') */}
      <div className={`w-full lg:w-96 bg-stone-50 flex flex-col h-full lg:h-auto overflow-hidden border-l border-stone-200 ${mobileTab === 'canvas' ? 'hidden lg:flex' : 'flex'}`}>
         
         {/* Technique Manager Panel */}
         <div className="p-4 border-b border-stone-200 bg-white flex flex-col gap-4">
            <button 
               onClick={handleNewTechnique}
               className="w-full py-3 bg-sumi text-white font-bold uppercase tracking-widest hover:bg-indigo transition-colors flex items-center justify-center gap-2 rounded-sm shadow-sm"
            >
                <FilePlus className="w-4 h-4" /> Add New Technique
            </button>

            <div className="space-y-2">
               <div className="flex gap-2">
                   <div className="relative flex-grow">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-stone-400" />
                     <input 
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs border border-stone-200 bg-stone-50 rounded-sm focus:outline-none focus:border-indigo"
                     />
                   </div>
                   <div className="relative w-1/3">
                      <Filter className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-stone-400 pointer-events-none" />
                      <select 
                        value={rarityFilter}
                        onChange={(e) => setRarityFilter(e.target.value as Rarity | 'ALL')}
                        className="w-full pl-7 pr-2 py-2 text-xs border border-stone-200 bg-stone-50 rounded-sm focus:outline-none focus:border-indigo appearance-none cursor-pointer"
                      >
                         <option value="ALL">All</option>
                         {Object.values(Rarity).map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                   </div>
               </div>

               <div className="h-48 lg:h-32 overflow-y-auto border border-stone-200 rounded-sm bg-stone-50">
                   {filteredTechniques.map(t => (
                      <div key={t.id} className="flex items-center justify-between p-2 hover:bg-white border-b border-stone-100 last:border-0 group">
                         <div className="flex items-center gap-2 truncate overflow-hidden">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.rarity === Rarity.COMMON ? 'bg-stone-300' : t.rarity === Rarity.LEGENDARY ? 'bg-yellow-500' : 'bg-indigo'}`} />
                            <span className={`text-xs font-medium truncate ${loadedId === t.id ? 'text-indigo font-bold' : 'text-stone-600'}`}>{t.name}</span>
                         </div>
                         <div className="flex gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => loadTechnique(t.id)} className="p-1 hover:bg-indigo/10 text-stone-400 hover:text-indigo rounded"><Edit2 className="w-3 h-3" /></button>
                            <button onClick={() => handleDeleteTechnique(t.id)} className="p-1 hover:bg-vermillion/10 text-stone-400 hover:text-vermillion rounded"><Trash2 className="w-3 h-3" /></button>
                         </div>
                      </div>
                   ))}
               </div>
            </div>
         </div>

         {/* Toggle Header */}
         <div className="flex border-b border-stone-200">
            <button 
              onClick={() => setShowJson(false)}
              className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest ${!showJson ? 'bg-white text-indigo border-b-2 border-indigo' : 'text-stone-400 hover:text-sumi'}`}
            >
              Metadata
            </button>
            <button 
               onClick={() => setShowJson(true)}
               className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest ${showJson ? 'bg-white text-indigo border-b-2 border-indigo' : 'text-stone-400 hover:text-sumi'}`}
            >
               Export JSON
            </button>
         </div>

         {/* Content Area */}
         <div className="flex-grow overflow-y-auto mb-12 lg:mb-0">
            {!showJson ? (
              <div className="p-6 space-y-6">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500">ID (e.g. 'yorikiri')</label>
                    <input 
                      value={metadata.id} 
                      onChange={e => setMetadata({...metadata, id: e.target.value})}
                      className="w-full p-2 border border-stone-300 rounded-sm focus:outline-none focus:border-indigo font-mono text-sm" 
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500">Name (Romaji)</label>
                      <input 
                        value={metadata.name}
                        onChange={e => setMetadata({...metadata, name: e.target.value})}
                        className="w-full p-2 border border-stone-300 rounded-sm focus:outline-none focus:border-indigo" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-500">Kanji</label>
                      <input 
                        value={metadata.kanji}
                        onChange={e => setMetadata({...metadata, kanji: e.target.value})}
                        className="w-full p-2 border border-stone-300 rounded-sm focus:outline-none focus:border-indigo" 
                      />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500">Translation</label>
                    <input 
                      value={metadata.translation}
                      onChange={e => setMetadata({...metadata, translation: e.target.value})}
                      className="w-full p-2 border border-stone-300 rounded-sm focus:outline-none focus:border-indigo" 
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500">Rarity</label>
                    <select 
                      value={metadata.rarity}
                      onChange={e => setMetadata({...metadata, rarity: e.target.value as Rarity})}
                      className="w-full p-2 border border-stone-300 rounded-sm focus:outline-none focus:border-indigo bg-white" 
                    >
                       {Object.values(Rarity).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500">Description</label>
                    <textarea 
                      value={metadata.description}
                      onChange={e => setMetadata({...metadata, description: e.target.value})}
                      rows={3}
                      className="w-full p-2 border border-stone-300 rounded-sm focus:outline-none focus:border-indigo text-sm" 
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500">Physics Principle</label>
                    <input 
                      value={metadata.mechanics?.principle}
                      onChange={e => setMetadata({...metadata, mechanics: { ...metadata.mechanics!, principle: e.target.value }})}
                      className="w-full p-2 border border-stone-300 rounded-sm focus:outline-none focus:border-indigo" 
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500">Key Points (comma separated)</label>
                    <textarea 
                      value={keyPointsString}
                      onChange={e => setKeyPointsString(e.target.value)}
                      rows={2}
                      placeholder="Low center of gravity, Inside grip..."
                      className="w-full p-2 border border-stone-300 rounded-sm focus:outline-none focus:border-indigo text-sm" 
                    />
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-500">Practitioners (comma separated)</label>
                    <input 
                      value={practitionersString}
                      onChange={e => setPractitionersString(e.target.value)}
                      placeholder="Hakuho, ..."
                      className="w-full p-2 border border-stone-300 rounded-sm focus:outline-none focus:border-indigo" 
                    />
                 </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                 <div className="flex-grow p-4 bg-stone-800 text-stone-100 font-mono text-xs overflow-auto">
                    <pre>{jsonOutput}</pre>
                 </div>
                 <div className="p-4 bg-white border-t border-stone-200 space-y-3">
                    <button 
                      onClick={handleSaveToFirestore}
                      disabled={saving}
                      className="w-full py-3 bg-vermillion text-white font-bold uppercase tracking-widest hover:bg-indigo transition-colors flex items-center justify-center gap-2 rounded-sm disabled:opacity-50"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving...' : 'Save to Firestore'}
                    </button>
                    <button 
                      onClick={copyToClipboard}
                      className="w-full py-3 bg-sumi text-white font-bold uppercase tracking-widest hover:bg-indigo transition-colors flex items-center justify-center gap-2 rounded-sm"
                    >
                      <Copy className="w-4 h-4" /> Copy Code
                    </button>
                    <p className="text-xs text-stone-400 mt-2 text-center">
                      Save directly to Firestore or copy JSON for manual insertion.
                    </p>
                 </div>
              </div>
            )}
         </div>
      </div>

      {/* Mobile Navigation Tab Bar (Visible only on small screens) */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-white border-t border-stone-200 flex lg:hidden z-50">
         <button 
            onClick={() => setMobileTab('canvas')}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider ${mobileTab === 'canvas' ? 'text-sumi bg-stone-50' : 'text-stone-400'}`}
         >
             <Monitor className="w-4 h-4" /> Editor
         </button>
         <div className="w-px bg-stone-200 h-full"></div>
         <button 
            onClick={() => setMobileTab('studio')}
            className={`flex-1 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider ${mobileTab === 'studio' ? 'text-sumi bg-stone-50' : 'text-stone-400'}`}
         >
             <PenTool className="w-4 h-4" /> Studio
         </button>
      </div>
    </div>
  );
};

export default AdminEditor;