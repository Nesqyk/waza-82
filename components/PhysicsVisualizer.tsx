import React from 'react';
import { SkeletonFrame, Vector2 } from '../types';

interface Props {
  frames: SkeletonFrame[];
  showPhysics: boolean;
  frameIndex: number;
  label?: string;
  rarity?: string;
}

// Basic Linear Interpolation Helper
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

const lerpVector = (a: Vector2, b: Vector2, t: number) => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
});

const PhysicsVisualizer: React.FC<Props> = ({ frames, showPhysics, frameIndex, label, rarity }) => {
  if (!frames || frames.length === 0) return null;
  
  // Calculate interpolation indices
  const count = frames.length;
  const safeIndex = ((frameIndex % count) + count) % count; // Ensure positive
  const indexA = Math.floor(safeIndex);
  const indexB = (indexA + 1) % count; // Loop back to start
  const t = safeIndex - indexA; // Progress between A and B (0.0 to 1.0)

  const frameA = frames[indexA];
  const frameB = frames[indexB];

  // Interpolate skeletons
  const interpolateSkeleton = (skelA: SkeletonFrame['attacker'], skelB: SkeletonFrame['attacker']) => ({
    head: lerpVector(skelA.head, skelB.head, t),
    center: lerpVector(skelA.center, skelB.center, t),
    hands: lerpVector(skelA.hands, skelB.hands, t),
    feet: lerpVector(skelA.feet, skelB.feet, t),
  });

  const currentAttacker = interpolateSkeleton(frameA.attacker, frameB.attacker);
  const currentDefender = interpolateSkeleton(frameA.defender, frameB.defender);
  
  // Interpolate forces
  const interpolateForces = (forcesA: SkeletonFrame['forces'] = [], forcesB: SkeletonFrame['forces'] = []) => {
    const maxLen = Math.max(forcesA.length, forcesB.length);
    const result = [];
    
    for (let i = 0; i < maxLen; i++) {
      const fA = forcesA[i];
      const fB = forcesB[i];
      
      if (fA && fB) {
        // Interpolate between two existing forces
        result.push({
          origin: lerpVector(fA.origin, fB.origin, t),
          direction: lerpVector(fA.direction, fB.direction, t),
          magnitude: lerp(fA.magnitude, fB.magnitude, t),
          type: fA.type // Prioritize start frame type
        });
      } else if (fA) {
        // Fade out
        result.push({
          origin: fA.origin,
          direction: fA.direction,
          magnitude: lerp(fA.magnitude, 0, t),
          type: fA.type
        });
      } else if (fB) {
        // Fade in
        result.push({
          origin: fB.origin,
          direction: fB.direction,
          magnitude: lerp(0, fB.magnitude, t),
          type: fB.type
        });
      }
    }
    return result;
  };

  const currentForces = interpolateForces(frameA.forces, frameB.forces);

  // Helper to scale 0-100 coordinates to SVG viewbox 0-200
  const s = (val: number) => val * 2; 

  const renderSkeleton = (data: { head: Vector2, center: Vector2, hands: Vector2, feet: Vector2 }, color: string) => {
    return (
      <g stroke={color} strokeWidth="4" strokeLinecap="round" fill="none">
        {/* Head */}
        <circle cx={s(data.head.x)} cy={s(data.head.y)} r="12" fill="white" strokeWidth="3" />
        {/* Spine (Head to Center) */}
        <line x1={s(data.head.x)} y1={s(data.head.y) + 12} x2={s(data.center.x)} y2={s(data.center.y)} />
        {/* Hips (Center to Feet - simplified triangle) */}
        <line x1={s(data.center.x)} y1={s(data.center.y)} x2={s(data.feet.x)} y2={s(data.feet.y)} />
        {/* Arms (Shoulder approx to Hands) */}
        <line x1={s(data.head.x)} y1={s(data.head.y) + 15} x2={s(data.hands.x)} y2={s(data.hands.y)} />
        
        {/* Center of Mass Indicator (Physics Mode) */}
        {showPhysics && (
          <circle cx={s(data.center.x)} cy={s(data.center.y)} r="4" fill="#3B82F6" stroke="none" className="animate-pulse" />
        )}
      </g>
    );
  };

  const renderForces = (forces: SkeletonFrame['forces']) => {
    if (!showPhysics) return null;
    return forces.map((force, i) => (
      <g key={i} className="opacity-80">
        <defs>
          <marker id={`arrow-${i}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill={force.type === 'pull' ? '#3B82F6' : '#E34234'} />
          </marker>
        </defs>
        <line 
          x1={s(force.origin.x)} 
          y1={s(force.origin.y)} 
          x2={s(force.origin.x + force.direction.x)} 
          y2={s(force.origin.y + force.direction.y)} 
          stroke={force.type === 'pull' ? '#3B82F6' : '#E34234'} 
          strokeWidth={s(force.magnitude) * 0.8} 
          markerEnd={`url(#arrow-${i})`}
        />
      </g>
    ));
  };

  return (
    <div className="w-full h-full bg-washi flex items-center justify-center relative overflow-hidden border-b border-stone-200 washi-texture">
      {/* Dohyo Ring (Abstract) */}
      <div className="absolute bottom-[-10%] w-[120%] h-[40%] border-t-4 border-indigo rounded-[100%] opacity-10"></div>

      {/* Embedded Label (Watermark style for sharing/visuals) */}
      {label && (
        <div className="absolute top-6 right-6 text-right z-10 pointer-events-none select-none">
            {rarity && (
                <span className={`inline-block px-2 py-0.5 mb-2 text-[10px] font-bold uppercase tracking-widest border rounded-full bg-white/80 backdrop-blur-sm ${
                    rarity === 'Common' ? 'text-stone-500 border-stone-200' :
                    rarity === 'Uncommon' ? 'text-indigo border-indigo/20' :
                    rarity === 'Rare' ? 'text-vermillion border-vermillion/20' : 'text-yellow-600 border-yellow-500/20'
                }`}>
                    {rarity}
                </span>
            )}
            <h2 className="text-4xl font-serif font-black text-sumi/10 uppercase tracking-tighter leading-none mix-blend-multiply">
                {label}
            </h2>
        </div>
      )}

      <svg viewBox="0 0 200 200" className="w-full h-full max-w-md">
        {renderSkeleton(currentDefender, "#E34234")}
        {renderSkeleton(currentAttacker, "#183059")}
        {renderForces(currentForces)}
      </svg>
      
      <div className="absolute bottom-4 right-4 text-xs text-stone-400 font-mono">
        FRAME {indexA + 1}/{frames.length}
      </div>
    </div>
  );
};

export default PhysicsVisualizer;