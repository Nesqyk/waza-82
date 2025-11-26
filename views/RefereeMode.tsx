import React, { useState, useEffect, useRef } from 'react';
import { TECHNIQUES } from '../constants';
import PhysicsVisualizer from '../components/PhysicsVisualizer';
import { Technique } from '../types';
import { Shield, RefreshCw, CheckCircle2, XCircle, Heart, Trophy, Play, Timer } from 'lucide-react';

const RefereeMode: React.FC = () => {
  // Game State
  const [gamePhase, setGamePhase] = useState<'start' | 'playing' | 'gameover'>('start');
  const [currentTechnique, setCurrentTechnique] = useState<Technique | null>(null);
  const [options, setOptions] = useState<Technique[]>([]);
  const [roundState, setRoundState] = useState<'guessing' | 'correct' | 'wrong'>('guessing');
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per round
  const [frameIndex, setFrameIndex] = useState(0);

  const timerRef = useRef<number | null>(null);

  // --- Game Loop Logic ---

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGamePhase('playing');
    setupRound();
  };

  const setupRound = () => {
    const randomTech = TECHNIQUES[Math.floor(Math.random() * TECHNIQUES.length)];
    setCurrentTechnique(randomTech);
    
    // Distractors
    const distractors = TECHNIQUES.filter(t => t.id !== randomTech.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    setOptions([randomTech, ...distractors].sort(() => 0.5 - Math.random()));
    
    setRoundState('guessing');
    setFrameIndex(0);
    setTimeLeft(15);
  };

  // Timer Logic
  useEffect(() => {
    if (gamePhase === 'playing' && roundState === 'guessing') {
      // @ts-ignore
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            handleTimeOut();
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gamePhase, roundState]);

  const handleTimeOut = () => {
    setRoundState('wrong');
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) setTimeout(() => setGamePhase('gameover'), 2000);
      else setTimeout(setupRound, 2000);
      return newLives;
    });
  };

  // Animation Loop
  useEffect(() => {
    if (!currentTechnique) return;
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (startTime === null) startTime = time;
      const elapsed = (time - startTime) / 1000;
      setFrameIndex(elapsed * 1.5); // Speed
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [currentTechnique]);

  const handleGuess = (techId: string) => {
    if (roundState !== 'guessing') return;

    if (techId === currentTechnique?.id) {
      setRoundState('correct');
      setScore(s => s + 1);
      setTimeout(setupRound, 1500);
    } else {
      setRoundState('wrong');
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) setTimeout(() => setGamePhase('gameover'), 2000);
        else setTimeout(setupRound, 2000);
        return newLives;
      });
    }
  };

  // --- Renders ---

  if (gamePhase === 'start') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-sumi text-washi rounded-full flex items-center justify-center mb-6 shadow-xl">
          <Shield className="w-12 h-12" />
        </div>
        <h1 className="text-5xl font-serif font-black text-sumi mb-4">Gyōji Mode</h1>
        <p className="text-stone-500 max-w-md mb-8 font-serif italic text-lg">
          "The eyes of the referee must be sharp as a hawk." <br/>
          Identify the technique before time runs out. Three strikes and you are out.
        </p>
        <button 
          onClick={startGame}
          className="px-8 py-4 bg-vermillion text-white text-lg font-bold uppercase tracking-widest hover:bg-indigo transition-colors shadow-lg rounded-sm flex items-center gap-3"
        >
          <Play className="w-6 h-6 fill-current" /> Begin Bout
        </button>
      </div>
    );
  }

  if (gamePhase === 'gameover') {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
        <Trophy className="w-20 h-20 text-yellow-500 mb-6 drop-shadow-md" />
        <h2 className="text-4xl font-serif font-black text-sumi mb-2">Tournament Ends</h2>
        <p className="text-stone-400 uppercase tracking-widest text-sm mb-8">Final Score</p>
        <div className="text-8xl font-serif font-black text-indigo mb-12">{score}</div>
        
        <button 
          onClick={startGame}
          className="px-8 py-3 border-2 border-sumi text-sumi font-bold uppercase tracking-widest hover:bg-sumi hover:text-white transition-colors"
        >
          Enter Next Tournament
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
      {/* HUD */}
      <div className="w-full flex items-center justify-between mb-6 bg-white p-4 rounded-sm border border-stone-200 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="text-center">
              <div className="text-[10px] font-bold text-stone-400 uppercase">Score</div>
              <div className="text-2xl font-black text-indigo font-serif leading-none">{score}</div>
           </div>
           <div className="h-8 w-px bg-stone-200"></div>
           <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`w-5 h-5 ${i < lives ? 'fill-vermillion text-vermillion' : 'fill-stone-200 text-stone-200'}`} />
              ))}
           </div>
        </div>
        
        <div className="flex items-center gap-3 flex-grow justify-end">
           <Timer className={`w-5 h-5 ${timeLeft < 5 ? 'text-vermillion animate-pulse' : 'text-stone-400'}`} />
           <div className="w-32 h-3 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-100 ease-linear ${timeLeft < 5 ? 'bg-vermillion' : 'bg-indigo'}`} 
                style={{ width: `${(timeLeft / 15) * 100}%` }}
              ></div>
           </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="w-full aspect-square md:aspect-[16/9] bg-white border border-stone-200 shadow-xl mb-6 relative overflow-hidden rounded-sm">
        {currentTechnique && (
          <div className="absolute inset-0">
            <PhysicsVisualizer 
              frames={currentTechnique.animationFrames} 
              frameIndex={frameIndex}
              showPhysics={true}
              label="???" // Hide name
              rarity="Guess the Move"
            />
          </div>
        )}

        {/* Feedback Overlays */}
        {roundState !== 'guessing' && (
          <div className={`absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in duration-200 ${roundState === 'correct' ? 'bg-emerald-500/10' : 'bg-vermillion/10'}`}>
             {roundState === 'correct' ? (
               <div className="transform scale-125 bg-white p-6 rounded-full shadow-2xl text-center">
                 <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-2" />
                 <div className="font-bold text-sumi font-serif text-xl">Correct!</div>
                 <div className="text-xs text-stone-500 uppercase">{currentTechnique?.name}</div>
               </div>
             ) : (
               <div className="transform scale-125 bg-white p-6 rounded-full shadow-2xl text-center">
                 <XCircle className="w-16 h-16 text-vermillion mx-auto mb-2" />
                 <div className="font-bold text-sumi font-serif text-xl">Missed!</div>
                 <div className="text-xs text-stone-500 uppercase">It was {currentTechnique?.name}</div>
               </div>
             )}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleGuess(option.id)}
            disabled={roundState !== 'guessing'}
            className={`
              p-4 text-left transition-all duration-200 border-2 relative overflow-hidden group
              ${roundState === 'guessing' 
                ? 'bg-white border-stone-200 hover:border-indigo hover:shadow-md' 
                : option.id === currentTechnique?.id 
                  ? 'bg-emerald-50 border-emerald-500' 
                  : 'bg-stone-50 border-stone-100 opacity-50'
              }
            `}
          >
            <div className="relative z-10">
              <span className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-0.5">
                {option.translation}
              </span>
              <span className="block text-lg font-serif font-bold text-sumi group-hover:text-indigo transition-colors">
                {option.name}
              </span>
            </div>
            {/* Decorative hover line */}
            <div className="absolute left-0 bottom-0 h-1 bg-indigo-500 w-0 group-hover:w-full transition-all duration-300" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RefereeMode;