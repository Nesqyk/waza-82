export enum Rarity {
  COMMON = "Common",
  UNCOMMON = "Uncommon",
  RARE = "Rare",
  LEGENDARY = "Legendary"
}

export enum WrestlerColor {
  EAST = "#183059", // Indigo - Attacker usually
  WEST = "#E34234", // Vermillion - Defender/Receiver
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface SkeletonFrame {
  // Simplified skeleton: Head, CenterMass, LeftHand, RightHand, LeftFoot, RightFoot
  attacker: {
    head: Vector2;
    center: Vector2;
    hands: Vector2;
    feet: Vector2;
  };
  defender: {
    head: Vector2;
    center: Vector2;
    hands: Vector2;
    feet: Vector2;
  };
  forces: {
    origin: Vector2;
    direction: Vector2; // Relative vector
    magnitude: number; // 0-1 scale for opacity/thickness
    type: 'push' | 'pull' | 'friction';
  }[];
}

export interface Technique {
  id: string;
  name: string;
  kanji: string;
  translation: string;
  rarity: Rarity;
  description: string;
  mechanics: {
    principle: string;
    keyPoints: string[];
  };
  practitioners: string[];
  animationFrames: SkeletonFrame[];
}
