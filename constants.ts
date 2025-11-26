
import { Technique, Rarity, SkeletonFrame } from './types';

// Shared placeholder for techniques pending custom animation (Standard Tachi-ai/Face-off pose)
const PENDING_ANIMATION: SkeletonFrame[] = [
  {
    attacker: { head: {x: 42, y: 35}, center: {x: 42, y: 55}, hands: {x: 52, y: 45}, feet: {x: 38, y: 85} },
    defender: { head: {x: 58, y: 35}, center: {x: 58, y: 55}, hands: {x: 48, y: 45}, feet: {x: 62, y: 85} },
    forces: []
  },
  {
    attacker: { head: {x: 45, y: 38}, center: {x: 45, y: 55}, hands: {x: 55, y: 45}, feet: {x: 40, y: 85} },
    defender: { head: {x: 55, y: 38}, center: {x: 55, y: 55}, hands: {x: 45, y: 45}, feet: {x: 60, y: 85} },
    forces: [{ origin: {x: 50, y: 45}, direction: {x: 0, y: 0}, magnitude: 0.5, type: 'push' }]
  }
];

export const TECHNIQUES: Technique[] = [
  // --- KIHON-WAZA (Basic Techniques) ---
  {
    id: 'yorikiri',
    name: 'Yorikiri',
    kanji: '寄り切り',
    translation: 'Frontal Force Out',
    rarity: Rarity.COMMON,
    description: 'The most common winning technique. The attacker grabs the opponent\'s mawashi (belt) and forces them backward out of the ring using leg strength and forward momentum.',
    mechanics: {
      principle: 'Leverage & Forward Momentum',
      keyPoints: ['Low center of gravity', 'Double inside grip on mawashi', 'Continuous leg drive']
    },
    practitioners: ['Hakuho', 'Terunofuji', 'Kisenosato'],
    animationFrames: [
      {
        attacker: { head: {x: 45, y: 30}, center: {x: 45, y: 50}, hands: {x: 55, y: 45}, feet: {x: 40, y: 80} },
        defender: { head: {x: 55, y: 28}, center: {x: 55, y: 48}, hands: {x: 45, y: 45}, feet: {x: 60, y: 80} },
        forces: []
      },
      {
        attacker: { head: {x: 48, y: 30}, center: {x: 48, y: 50}, hands: {x: 58, y: 45}, feet: {x: 45, y: 80} },
        defender: { head: {x: 58, y: 27}, center: {x: 58, y: 47}, hands: {x: 48, y: 45}, feet: {x: 63, y: 78} },
        forces: [{ origin: {x: 48, y: 50}, direction: {x: 10, y: -2}, magnitude: 0.8, type: 'push' as const }]
      },
      {
        attacker: { head: {x: 55, y: 30}, center: {x: 55, y: 50}, hands: {x: 65, y: 45}, feet: {x: 50, y: 80} },
        defender: { head: {x: 65, y: 25}, center: {x: 65, y: 45}, hands: {x: 55, y: 45}, feet: {x: 70, y: 75} },
        forces: [{ origin: {x: 55, y: 50}, direction: {x: 15, y: -5}, magnitude: 1.0, type: 'push' as const }]
      }
    ]
  },
  {
    id: 'oshidashi',
    name: 'Oshidashi',
    kanji: '押し出し',
    translation: 'Frontal Push Out',
    rarity: Rarity.COMMON,
    description: 'Pushing the opponent out of the ring without holding the belt. The attacker keeps their arms tucked and pushes against the opponent\'s chest or armpits.',
    mechanics: {
      principle: 'Percussive Force',
      keyPoints: ['Elbows tucked in', 'Upward trajectory of push', 'Synchronized hand and foot movement']
    },
    practitioners: ['Takakeisho', 'Chiyotaikai', 'Akebono'],
    animationFrames: [
      {
        attacker: { head: {x: 40, y: 30}, center: {x: 40, y: 50}, hands: {x: 50, y: 40}, feet: {x: 35, y: 80} },
        defender: { head: {x: 60, y: 30}, center: {x: 60, y: 50}, hands: {x: 50, y: 45}, feet: {x: 65, y: 80} },
        forces: []
      },
      {
        attacker: { head: {x: 45, y: 30}, center: {x: 45, y: 50}, hands: {x: 58, y: 35}, feet: {x: 40, y: 80} },
        defender: { head: {x: 62, y: 28}, center: {x: 62, y: 48}, hands: {x: 52, y: 45}, feet: {x: 68, y: 78} },
        forces: [{ origin: {x: 50, y: 40}, direction: {x: 10, y: -5}, magnitude: 0.9, type: 'push' as const }]
      },
      {
        attacker: { head: {x: 50, y: 30}, center: {x: 50, y: 50}, hands: {x: 62, y: 30}, feet: {x: 45, y: 80} },
        defender: { head: {x: 68, y: 25}, center: {x: 68, y: 45}, hands: {x: 55, y: 45}, feet: {x: 75, y: 75} },
        forces: [{ origin: {x: 58, y: 35}, direction: {x: 15, y: -10}, magnitude: 1.0, type: 'push' as const }]
      }
    ]
  },
  {
    id: 'oshitaoshi',
    name: 'Oshitaoshi',
    kanji: '押し倒し',
    translation: 'Frontal Push Down',
    rarity: Rarity.COMMON,
    description: 'Pushing the opponent down to the surface of the ring. Similar to Oshidashi, but the force is directed more downwards or the opponent collapses.',
    mechanics: { principle: 'Downward Force', keyPoints: ['High push angle', 'Collapse of opponent structure'] },
    practitioners: ['Takakeisho', 'Onosato'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tsukidashi',
    name: 'Tsukidashi',
    kanji: '突き出し',
    translation: 'Frontal Thrust Out',
    rarity: Rarity.COMMON,
    description: 'Thrusting the opponent out of the ring with a series of hand strikes (Tsuppari) rather than a continuous push.',
    mechanics: { principle: 'Repeated Impact', keyPoints: ['Rapid fire thrusts', 'Maintaining distance'] },
    practitioners: ['Akebono', 'Abi'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tsukitaoshi',
    name: 'Tsukitaoshi',
    kanji: '突き倒し',
    translation: 'Frontal Thrust Down',
    rarity: Rarity.UNCOMMON,
    description: 'Thrusting the opponent down to the clay. The final thrust is powerful enough to knock the opponent off balance and onto their back.',
    mechanics: { principle: 'Impact & Balance Break', keyPoints: ['Explosive final thrust', 'Opponent retreating'] },
    practitioners: ['Chiyotaikai'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'yoritaoshi',
    name: 'Yoritaoshi',
    kanji: '寄り倒し',
    translation: 'Frontal Force Down',
    rarity: Rarity.COMMON,
    description: 'Forcing the opponent backward and crushing them down to the clay, often with the attacker falling on top.',
    mechanics: { principle: 'Overwhelming Mass', keyPoints: ['Deep grip', 'Collapsing forward'] },
    practitioners: ['Terunofuji', 'Konishiki'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'abisetaoshi',
    name: 'Abisetaoshi',
    kanji: '浴びせ倒し',
    translation: 'Backward Force Down',
    rarity: Rarity.UNCOMMON,
    description: 'Collapsing on top of the opponent while holding them, forcing them to fall backwards due to the attacker\'s weight.',
    mechanics: { principle: 'Gravitational Domination', keyPoints: ['Locking opponent body', 'Surrendering balance forward'] },
    practitioners: ['Akebono'],
    animationFrames: PENDING_ANIMATION
  },

  // --- NAGE-WAZA (Throwing Techniques) ---
  {
    id: 'uwatenage',
    name: 'Uwatenage',
    kanji: '上手投げ',
    translation: 'Overarm Throw',
    rarity: Rarity.UNCOMMON,
    description: 'The attacker extends their arm over the opponent\'s shoulder to grab the belt, then twists their body to throw the opponent down.',
    mechanics: {
      principle: 'Rotational Torque',
      keyPoints: ['Outside grip (overarm)', 'Pulling opponent close to hip', 'Pivot on outer leg']
    },
    practitioners: ['Chiyonofuji', 'Kaio', 'Wakanohana'],
    animationFrames: [
      {
        attacker: { head: {x: 45, y: 30}, center: {x: 45, y: 50}, hands: {x: 55, y: 40}, feet: {x: 45, y: 80} },
        defender: { head: {x: 55, y: 30}, center: {x: 55, y: 50}, hands: {x: 45, y: 40}, feet: {x: 55, y: 80} },
        forces: []
      },
      {
        attacker: { head: {x: 45, y: 32}, center: {x: 45, y: 50}, hands: {x: 55, y: 50}, feet: {x: 45, y: 80} },
        defender: { head: {x: 55, y: 35}, center: {x: 55, y: 45}, hands: {x: 45, y: 40}, feet: {x: 55, y: 70} },
        forces: [{ origin: {x: 55, y: 40}, direction: {x: 0, y: 15}, magnitude: 0.7, type: 'pull' as const }]
      },
      {
        attacker: { head: {x: 45, y: 35}, center: {x: 45, y: 50}, hands: {x: 45, y: 60}, feet: {x: 45, y: 80} },
        defender: { head: {x: 65, y: 60}, center: {x: 60, y: 60}, hands: {x: 50, y: 40}, feet: {x: 60, y: 50} },
        forces: [{ origin: {x: 55, y: 50}, direction: {x: 10, y: 10}, magnitude: 1.0, type: 'pull' as const }]
      }
    ]
  },
  {
    id: 'shitatenage',
    name: 'Shitatenage',
    kanji: '下手投げ',
    translation: 'Underarm Throw',
    rarity: Rarity.UNCOMMON,
    description: 'Throwing the opponent by pulling an inside (underarm) belt grip forward and down while pivoting.',
    mechanics: { principle: 'Inner Pivot', keyPoints: ['Deep inside grip', 'Wall-like body position', 'Pulling down'] },
    practitioners: ['Hakuho', 'Harumafuji'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kotenage',
    name: 'Kotenage',
    kanji: '小手投げ',
    translation: 'Armlock Throw',
    rarity: Rarity.UNCOMMON,
    description: 'Locking the opponent\'s arm under the attacker\'s armpit and throwing them down without touching the belt.',
    mechanics: { principle: 'Joint Lock (Shoulder/Elbow)', keyPoints: ['Clamp on arm', 'Rotational drop'] },
    practitioners: ['Kaio', 'Kisenosato'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'sukuinage',
    name: 'Sukuinage',
    kanji: '掬い投げ',
    translation: 'Scooping Throw',
    rarity: Rarity.UNCOMMON,
    description: 'Throwing the opponent by scooping their side or back with the arm (no belt grip) and twisting.',
    mechanics: { principle: 'Fulcrum Lift', keyPoints: ['Arm across back', 'Hip loading'] },
    practitioners: ['Hoshoryu', 'Kotoshogiku'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'uwatedashinage',
    name: 'Uwatedashinage',
    kanji: '上手出し投げ',
    translation: 'Pulling Overarm Throw',
    rarity: Rarity.RARE,
    description: 'Pulling the opponent forward and down with an outside grip while moving backwards/sideways.',
    mechanics: { principle: 'Off-balancing', keyPoints: ['Outside grip', 'Opening the body'] },
    practitioners: ['Asashoryu'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'shitatedashinage',
    name: 'Shitatedashinage',
    kanji: '下手出し投げ',
    translation: 'Pulling Underarm Throw',
    rarity: Rarity.RARE,
    description: 'Pulling the opponent forward and down with an inside grip while moving backwards/sideways.',
    mechanics: { principle: 'Drag & Drop', keyPoints: ['Inside grip drag', 'Stepping back'] },
    practitioners: ['Tochinoshin'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'koshinage',
    name: 'Koshinage',
    kanji: '腰投げ',
    translation: 'Hip Throw',
    rarity: Rarity.RARE,
    description: 'Loading the opponent onto the hips and throwing them over. Similar to Judo\'s O-goshi.',
    mechanics: { principle: 'Hip Fulcrum', keyPoints: ['Lower hips below opponent', 'Load weight', 'Spring up'] },
    practitioners: ['Ura', 'Tochinoshin'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kubinage',
    name: 'Kubinage',
    kanji: '首投げ',
    translation: 'Neck Throw',
    rarity: Rarity.UNCOMMON,
    description: 'Throwing the opponent by wrapping an arm around their neck.',
    mechanics: { principle: 'Head Control', keyPoints: ['Headlock', 'Rotation'] },
    practitioners: ['Daieisho'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'ipponzeoi',
    name: 'Ipponzeoi',
    kanji: '一本背負い',
    translation: 'One-armed Shoulder Throw',
    rarity: Rarity.LEGENDARY,
    description: 'Throwing the opponent over the shoulder using a single arm grip. Very rare in Sumo.',
    mechanics: { principle: 'Shoulder Fulcrum', keyPoints: ['Clamp arm', 'Back rotation'] },
    practitioners: ['Koga'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kakenage',
    name: 'Kakenage',
    kanji: '掛け投げ',
    translation: 'Hooking Throw',
    rarity: Rarity.RARE,
    description: 'Lifting the opponent\'s leg with one leg while throwing them with the upper body.',
    mechanics: { principle: 'Simultaneous Lift & Throw', keyPoints: ['Inner thigh hook', 'Upper body twist'] },
    practitioners: ['Hakuho'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tsukaminage',
    name: 'Tsukaminage',
    kanji: 'つかみ投げ',
    translation: 'Lifting Throw',
    rarity: Rarity.LEGENDARY,
    description: 'Grabbing the opponent\'s mawashi and lifting them bodily into the air to throw them. Requires immense strength.',
    mechanics: { principle: 'Pure Lift', keyPoints: ['Deadlift strength', 'High grip'] },
    practitioners: ['Tochinoshin'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'yaguranage',
    name: 'Yaguranage',
    kanji: '櫓投げ',
    translation: 'Inner Thigh Throw',
    rarity: Rarity.LEGENDARY,
    description: 'Throwing the opponent by lifting their inner thigh with your own leg, creating a "turret" (yagura) shape.',
    mechanics: { principle: 'Leg Fulcrum', keyPoints: ['Knee under thigh', 'Leverage lift'] },
    practitioners: ['Asashoryu'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'nichonage',
    name: 'Nichonage',
    kanji: '二丁投げ',
    translation: 'Body Drop Throw',
    rarity: Rarity.RARE,
    description: 'Sweeping the outside of the opponent\'s leg with the same-side leg while throwing.',
    mechanics: { principle: 'Leg Obstruction', keyPoints: ['Leg block', 'Upper body throw'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },

  // --- KAKE-WAZA (Leg Tripping Techniques) ---
  {
    id: 'uchigake',
    name: 'Uchigake',
    kanji: '内掛け',
    translation: 'Inside Leg Trip',
    rarity: Rarity.RARE,
    description: 'Hooking the opponent\'s leg from the inside with your own leg and forcing them down.',
    mechanics: { principle: 'Base Destabilization', keyPoints: ['Inside calf hook', 'Forward pressure'] },
    practitioners: ['Kisenosato'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'sotogake',
    name: 'Sotogake',
    kanji: '外掛け',
    translation: 'Outside Leg Trip',
    rarity: Rarity.RARE,
    description: 'Hooking the opponent\'s leg from the outside and driving them backward.',
    mechanics: { principle: 'Base Removal', keyPoints: ['Outside calf hook', 'Driving forward'] },
    practitioners: ['Kirishima'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'chongake',
    name: 'Chongake',
    kanji: 'ちょん掛け',
    translation: 'Pulling Heel Hook',
    rarity: Rarity.RARE,
    description: 'Hooking the opponent\'s heel with your own heel and pulling.',
    mechanics: { principle: 'Ankle Manipulation', keyPoints: ['Heel hook', 'Pulling back'] },
    practitioners: ['Asashoryu'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kirikaeshi',
    name: 'Kirikaeshi',
    kanji: '切り返し',
    translation: 'Twisting Backward Leg Trip',
    rarity: Rarity.RARE,
    description: 'Placing the knee behind the opponent\'s knee and twisting them over it.',
    mechanics: { principle: 'Knee Fulcrum', keyPoints: ['Knee block', 'Rotation'] },
    practitioners: ['Kirishima'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kawazugake',
    name: 'Kawazugake',
    kanji: '河津掛け',
    translation: 'Counter Hook',
    rarity: Rarity.RARE,
    description: 'Wrapping the leg around the opponent\'s leg from the inside and falling backward to throw them.',
    mechanics: { principle: 'Leg Entanglement', keyPoints: ['Grapevine leg', 'Backward sacrifice'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kekaeshi',
    name: 'Kekaeshi',
    kanji: '蹴返し',
    translation: 'Minor Inner Foot Sweep',
    rarity: Rarity.RARE,
    description: 'Kicking the inside of the opponent\'s foot to sweep it out while pulling them down.',
    mechanics: { principle: 'Foot Sweep', keyPoints: ['Timing', 'Inside kick'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'ketaguri',
    name: 'Ketaguri',
    kanji: '蹴手繰り',
    translation: 'Pulling Ankle Sweep',
    rarity: Rarity.UNCOMMON,
    description: 'Kicking the opponent\'s leg out from the inside right at the tachiai (initial charge).',
    mechanics: { principle: 'Surprise Sweep', keyPoints: ['Tachiai timing', 'Leg sweep'] },
    practitioners: ['Kyokoshuzan'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'mitokorozeme',
    name: 'Mitokorozeme',
    kanji: '三所攻め',
    translation: 'Triple Attack Force Out',
    rarity: Rarity.LEGENDARY,
    description: 'Attacking three points simultaneously: inside leg trip, head push, and gripping the other leg.',
    mechanics: { principle: 'Total Overload', keyPoints: ['Inside trip', 'Leg grab', 'Chest push'] },
    practitioners: ['Mainoumi'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'nimaigeri',
    name: 'Nimaigeri',
    kanji: '二枚蹴り',
    translation: 'Ankle Kicking Twist Down',
    rarity: Rarity.LEGENDARY,
    description: 'Kicking the outside of the opponent\'s pivoting foot while twisting them down.',
    mechanics: { principle: 'Pivot Destruction', keyPoints: ['Outside kick', 'Twist'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'komatasukui',
    name: 'Komatasukui',
    kanji: '小股掬い',
    translation: 'Over Thigh Scoop',
    rarity: Rarity.RARE,
    description: 'Scooping the opponent\'s thigh from the outside when they attempt a throw.',
    mechanics: { principle: 'Counter Balance', keyPoints: ['Thigh scoop', 'Forward drive'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'ozumatori',
    name: 'Ozumatori',
    kanji: '大妻取り',
    translation: 'Big Toe Pick',
    rarity: Rarity.LEGENDARY,
    description: 'Picking up the opponent\'s leg by the crotch/thigh area from the outside.',
    mechanics: { principle: 'Lift & Topple', keyPoints: ['Deep scoop', 'Lift'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kozumatori',
    name: 'Kozumatori',
    kanji: '小妻取り',
    translation: 'Ankle Pick',
    rarity: Rarity.RARE,
    description: 'Grabbing the opponent\'s ankle from the front and lifting it to topple them.',
    mechanics: { principle: 'Base Removal', keyPoints: ['Ankle grab', 'Pull'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'ashitori',
    name: 'Ashitori',
    kanji: '足取り',
    translation: 'Leg Pick',
    rarity: Rarity.UNCOMMON,
    description: 'Grabbing the opponent\'s leg and lifting it high to throw them off balance.',
    mechanics: { principle: 'Single Leg Takedown', keyPoints: ['Leg catch', 'High lift'] },
    practitioners: ['Ura', 'Asashoryu'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'totsukigake',
    name: 'Totsukigake',
    kanji: '外掛け', // Note: Duplicate kanji in some sources, technically specific variation
    translation: 'Thrusting Leg Trip',
    rarity: Rarity.LEGENDARY,
    description: 'Using a leg trip while thrusting the opponent backward.',
    mechanics: { principle: 'Trip & Push', keyPoints: ['Trip', 'Push'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'watashikomi',
    name: 'Watashikomi',
    kanji: '渡し込み',
    translation: 'Thigh Grabbing Push Down',
    rarity: Rarity.RARE,
    description: 'Grabbing the back of the opponent\'s thigh and pushing them down while driving forward.',
    mechanics: { principle: 'Leg Control', keyPoints: ['Behind knee grip', 'Forward drive'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'susoharai',
    name: 'Susoharai',
    kanji: '裾払い',
    translation: 'Rear Foot Sweep',
    rarity: Rarity.RARE,
    description: 'Sweeping the opponent\'s back foot from the inside while twisting them.',
    mechanics: { principle: 'Back Sweep', keyPoints: ['Rear foot timing', 'Twist'] },
    practitioners: ['Harumafuji'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'susotori',
    name: 'Susotori',
    kanji: '裾取り',
    translation: 'Ankle Pick',
    rarity: Rarity.RARE,
    description: 'Grabbing the opponent\'s ankle following a failed throw attempt.',
    mechanics: { principle: 'Recovery Attack', keyPoints: ['Ankle grab', 'Pull'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tsumatori',
    name: 'Tsumatori',
    kanji: '褄取り',
    translation: 'Toe Pick',
    rarity: Rarity.LEGENDARY,
    description: 'Grabbing the toes or side of the foot to pull the opponent off balance.',
    mechanics: { principle: 'Foot Manipulation', keyPoints: ['Toe grab', 'Pull'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },

  // --- HINERI-WAZA (Twisting Techniques) ---
  {
    id: 'tsukiotoshi',
    name: 'Tsukiotoshi',
    kanji: '突き落とし',
    translation: 'Thrust Down',
    rarity: Rarity.COMMON,
    description: 'Twisting the upper body to avoid a push and thrusting the opponent down onto their side.',
    mechanics: { principle: 'Void Creation', keyPoints: ['Side step', 'Downward thrust on shoulder'] },
    practitioners: ['Hakuho', 'Kotoshogiku'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'makiotoshi',
    name: 'Makiotoshi',
    kanji: '巻き落とし',
    translation: 'Twisting Throw',
    rarity: Rarity.RARE,
    description: 'Twisting the opponent\'s body without a belt grip, often acting on the arm or torso.',
    mechanics: { principle: 'Torque', keyPoints: ['No grip', 'Sudden twist'] },
    practitioners: ['Terutsuyoshi'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tottari',
    name: 'Tottari',
    kanji: 'とったり',
    translation: 'Arm Bar Throw',
    rarity: Rarity.UNCOMMON,
    description: 'Pulling the opponent\'s arm with both hands to swing them forward and out.',
    mechanics: { principle: 'Arm Drag', keyPoints: ['Two-on-one grip', 'Swing'] },
    practitioners: ['Ichinojo'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'sakatottari',
    name: 'Sakatottari',
    kanji: '逆とったり',
    translation: 'Reverse Arm Bar Throw',
    rarity: Rarity.RARE,
    description: 'Similar to Tottari but applied to the opposite arm relative to the stance.',
    mechanics: { principle: 'Cross Arm Drag', keyPoints: ['Cross grip', 'Swing'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kainanahineri',
    name: 'Kainanahineri',
    kanji: '腕捻り',
    translation: 'Two-handed Arm Twist',
    rarity: Rarity.RARE,
    description: 'Grabbing the opponent\'s arm with both hands and twisting it to force them down.',
    mechanics: { principle: 'Arm Torque', keyPoints: ['Double wrist grip', 'Twist'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'katasukashi',
    name: 'Katasukashi',
    kanji: '肩透かし',
    translation: 'Under-Shoulder Swing Down',
    rarity: Rarity.UNCOMMON,
    description: 'Placing a hand on the opponent\'s shoulder and the other under their armpit to twist them down.',
    mechanics: { principle: 'Shoulder Rotation', keyPoints: ['Hand on neck/shoulder', 'Pulling through'] },
    practitioners: ['Hakuho'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kubihineri',
    name: 'Kubihineri',
    kanji: '首捻り',
    translation: 'Neck Twist',
    rarity: Rarity.RARE,
    description: 'Twisting the opponent\'s neck to throw them down.',
    mechanics: { principle: 'Cervical Torque', keyPoints: ['Neck crank', 'Rotation'] },
    practitioners: ['Hakuho'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'osakate',
    name: 'Osakate',
    kanji: '大逆手',
    translation: 'Backward Twisting Overarm Throw',
    rarity: Rarity.LEGENDARY,
    description: 'An overarm throw where the attacker twists the opponent backward over the hip.',
    mechanics: { principle: 'Reverse Torque', keyPoints: ['Overarm grip', 'Backwards twist'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'sabaori',
    name: 'Sabaori',
    kanji: '鯖折り',
    translation: 'Forward Force Down',
    rarity: Rarity.RARE,
    description: 'Grabbing the belt and pulling down and forward, forcing the opponent\'s knees to buckle.',
    mechanics: { principle: 'Structure Collapse', keyPoints: ['Heavy pull', 'Knee buckle'] },
    practitioners: ['Inoue'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kotehineri',
    name: 'Kotehineri',
    kanji: '小手捻り',
    translation: 'Armlock Twist',
    rarity: Rarity.UNCOMMON,
    description: 'Twisting the opponent down using an armlock grip.',
    mechanics: { principle: 'Joint Manipulation', keyPoints: ['Armlock', 'Twist'] },
    practitioners: ['Kaio'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'gasshohineri',
    name: 'Gasshohineri',
    kanji: '合掌捻り',
    translation: 'Clasped Hand Twist',
    rarity: Rarity.LEGENDARY,
    description: 'Clasping hands around the opponent\'s back or neck and twisting them down.',
    mechanics: { principle: 'Bear Hug Twist', keyPoints: ['Clasped hands', 'Torque'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'harimanage',
    name: 'Harimanage',
    kanji: '波離間投げ',
    translation: 'Backward Belt Throw',
    rarity: Rarity.LEGENDARY,
    description: 'Throwing the opponent backward over the head by grabbing the belt from behind.',
    mechanics: { principle: 'Rear Projection', keyPoints: ['Rear grip', 'Overhead throw'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tokkurinage',
    name: 'Tokkurinage',
    kanji: '徳利投げ',
    translation: 'Two-handed Head Twist',
    rarity: Rarity.LEGENDARY,
    description: 'Grabbing the opponent\'s head or neck with both hands and twisting them down.',
    mechanics: { principle: 'Head Control', keyPoints: ['Double neck grip', 'Twist'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'sotomuso',
    name: 'Sotomuso',
    kanji: '外無双',
    translation: 'Outer Thigh Propping Twist',
    rarity: Rarity.RARE,
    description: 'Blocking the opponent\'s outer thigh with the hand while twisting them down.',
    mechanics: { principle: 'Hand Block', keyPoints: ['Outer thigh block', 'Twist'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'uchimuso',
    name: 'Uchimuso',
    kanji: '内無双',
    translation: 'Inner Thigh Propping Twist',
    rarity: Rarity.RARE,
    description: 'The attacker uses their hand to scoop the opponent\'s inner thigh high into the air while twisting their body to throw them.',
    mechanics: {
      principle: 'Fulcrum & Lift',
      keyPoints: ['Hand deep in inner thigh', 'Lift creates instability', 'Upper body rotation completes throw']
    },
    practitioners: ['Kyokushuzan', 'Mainoumi'],
    animationFrames: [
      {
        attacker: { head: {x: 45, y: 30}, center: {x: 45, y: 50}, hands: {x: 55, y: 50}, feet: {x: 45, y: 80} },
        defender: { head: {x: 55, y: 30}, center: {x: 55, y: 50}, hands: {x: 45, y: 50}, feet: {x: 55, y: 80} },
        forces: []
      },
      {
        attacker: { head: {x: 45, y: 35}, center: {x: 45, y: 55}, hands: {x: 55, y: 65}, feet: {x: 45, y: 80} },
        defender: { head: {x: 55, y: 35}, center: {x: 55, y: 50}, hands: {x: 45, y: 50}, feet: {x: 55, y: 70} },
        forces: [{ origin: {x: 55, y: 65}, direction: {x: 0, y: -10}, magnitude: 0.8, type: 'push' as const }]
      },
      {
        attacker: { head: {x: 45, y: 40}, center: {x: 45, y: 50}, hands: {x: 55, y: 30}, feet: {x: 45, y: 80} },
        defender: { head: {x: 65, y: 50}, center: {x: 60, y: 40}, hands: {x: 50, y: 40}, feet: {x: 60, y: 20} },
        forces: [{ origin: {x: 55, y: 65}, direction: {x: 10, y: -20}, magnitude: 1.0, type: 'push' as const }]
      }
    ]
  },
  {
    id: 'zubuneri',
    name: 'Zubuneri',
    kanji: 'ずぶねり',
    translation: 'Head Pivot Throw',
    rarity: Rarity.LEGENDARY,
    description: 'Using the opponent\'s shoulder or head as a pivot point to throw them across the body.',
    mechanics: { principle: 'Head Pivot', keyPoints: ['Head/Neck pivot', 'Rotation'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'uwatehineri',
    name: 'Uwatehineri',
    kanji: '上手捻り',
    translation: 'Overarm Twist',
    rarity: Rarity.UNCOMMON,
    description: 'Twisting the opponent down using an overarm grip.',
    mechanics: { principle: 'Torque', keyPoints: ['Outside grip', 'Twist'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'shitatehineri',
    name: 'Shitatehineri',
    kanji: '下手捻り',
    translation: 'Underarm Twist',
    rarity: Rarity.UNCOMMON,
    description: 'Twisting the opponent down using an underarm grip.',
    mechanics: { principle: 'Torque', keyPoints: ['Inside grip', 'Twist'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'amiuchi',
    name: 'Amiuchi',
    kanji: '網打ち',
    translation: 'Fisherman\'s Throw',
    rarity: Rarity.RARE,
    description: 'Throwing the opponent backward by pulling their arm with both hands, resembling casting a net.',
    mechanics: { principle: 'Arm Drag', keyPoints: ['Two-on-one grip', 'Net casting motion'] },
    practitioners: ['Wakanohana'],
    animationFrames: PENDING_ANIMATION
  },

  // --- SORI-WAZA (Backwards Bending Techniques) ---
  {
    id: 'izori',
    name: 'Izori',
    kanji: '居反り',
    translation: 'Backward Body Drop',
    rarity: Rarity.LEGENDARY,
    description: 'Diving low under the opponent and arching backwards to throw them over.',
    mechanics: { principle: 'Bridge', keyPoints: ['Very low dive', 'Back arch'] },
    practitioners: ['Ura', 'Isegahama'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kakahizori',
    name: 'Kakahizori',
    kanji: '撞木反り', // Note: Kanji might vary slightly in usage, standardizing.
    translation: 'Heel Drop',
    rarity: Rarity.LEGENDARY,
    description: 'Throwing the opponent by diving under their armpit and arching back.',
    mechanics: { principle: 'Back Arch', keyPoints: ['Under armpit', 'Arch'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'shumokuzori',
    name: 'Shumokuzori',
    kanji: '撞木反り',
    translation: 'Bell Hammer Drop',
    rarity: Rarity.LEGENDARY,
    description: 'Similar to Tasukizori but the opponent is carried across the shoulders.',
    mechanics: { principle: 'Fireman Carry Arch', keyPoints: ['Shoulder carry', 'Drop'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tasukizori',
    name: 'Tasukizori',
    kanji: '襷反り',
    translation: 'Kimono String Drop',
    rarity: Rarity.LEGENDARY,
    description: 'Reversing a throw by grabbing the inner arm and arching backward.',
    mechanics: { principle: 'Arm Reversal', keyPoints: ['Inner arm grip', 'Arch'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'sotokomata',
    name: 'Sotokomata',
    kanji: '外小股',
    translation: 'Over Thigh Scoop Throw',
    rarity: Rarity.LEGENDARY,
    description: 'Scooping the opponent\'s thigh from the outside and lifting while arching.',
    mechanics: { principle: 'Thigh Lift', keyPoints: ['Thigh scoop', 'Arch'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tsutaezori',
    name: 'Tsutaezori',
    kanji: '伝え反り',
    translation: 'Underarm Forward Body Drop',
    rarity: Rarity.LEGENDARY,
    description: 'Shifting the opponent\'s weight over the back while arching.',
    mechanics: { principle: 'Weight Shift', keyPoints: ['Underarm pass', 'Arch'] },
    practitioners: ['Ura'],
    animationFrames: PENDING_ANIMATION
  },

  // --- TOKUSHU-WAZA (Special Techniques) ---
  {
    id: 'hatakikomi',
    name: 'Hatakikomi',
    kanji: '叩き込み',
    translation: 'Slap Down',
    rarity: Rarity.UNCOMMON,
    description: 'A reactive move. When the opponent rushes forward, the wrestler steps to the side or back and slaps the opponent\'s shoulder or back downwards.',
    mechanics: {
      principle: 'Deflection & Gravity',
      keyPoints: ['Timing matches opponent surge', 'Downward vector applied to shoulder', 'Rapid disengagement']
    },
    practitioners: ['Terutsuyoshi', 'Aminishiki'],
    animationFrames: [
      {
        attacker: { head: {x: 40, y: 30}, center: {x: 40, y: 50}, hands: {x: 50, y: 35}, feet: {x: 40, y: 80} },
        defender: { head: {x: 60, y: 35}, center: {x: 60, y: 50}, hands: {x: 50, y: 50}, feet: {x: 65, y: 80} },
        forces: []
      },
      {
        attacker: { head: {x: 35, y: 30}, center: {x: 35, y: 50}, hands: {x: 55, y: 35}, feet: {x: 35, y: 80} },
        defender: { head: {x: 50, y: 45}, center: {x: 55, y: 50}, hands: {x: 45, y: 55}, feet: {x: 60, y: 80} },
        forces: [{ origin: {x: 55, y: 35}, direction: {x: 0, y: 20}, magnitude: 0.8, type: 'push' as const }]
      },
      {
        attacker: { head: {x: 30, y: 30}, center: {x: 30, y: 50}, hands: {x: 50, y: 45}, feet: {x: 30, y: 80} },
        defender: { head: {x: 45, y: 70}, center: {x: 50, y: 60}, hands: {x: 40, y: 65}, feet: {x: 55, y: 80} },
        forces: [{ origin: {x: 55, y: 35}, direction: {x: 0, y: 25}, magnitude: 1.0, type: 'push' as const }]
      }
    ]
  },
  {
    id: 'hikiotoshi',
    name: 'Hikiotoshi',
    kanji: '引き落とし',
    translation: 'Hand Pull Down',
    rarity: Rarity.UNCOMMON,
    description: 'Pulling the opponent down by the shoulder or arm as they push forward.',
    mechanics: { principle: 'Vacuum Effect', keyPoints: ['Pulling', 'Stepping back'] },
    practitioners: ['Ichinojo'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'hikkake',
    name: 'Hikkake',
    kanji: '引っ掛け',
    translation: 'Arm Grabbing Force Out',
    rarity: Rarity.UNCOMMON,
    description: 'Grabbing the opponent\'s arm and pulling them forward and out of the ring.',
    mechanics: { principle: 'Arm Drag', keyPoints: ['Arm grip', 'Side step'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'okuridashi',
    name: 'Okuridashi',
    kanji: '送り出し',
    translation: 'Rear Push Out',
    rarity: Rarity.COMMON,
    description: 'Pushing the opponent out of the ring from behind.',
    mechanics: { principle: 'Rear Force', keyPoints: ['Back control', 'Push'] },
    practitioners: ['Hakuho'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'okuritaoshi',
    name: 'Okuritaoshi',
    kanji: '送り倒し',
    translation: 'Rear Push Down',
    rarity: Rarity.UNCOMMON,
    description: 'Pushing the opponent down from behind.',
    mechanics: { principle: 'Rear Force', keyPoints: ['Back control', 'Push down'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'okurinage',
    name: 'Okurinage',
    kanji: '送り投げ',
    translation: 'Rear Throw',
    rarity: Rarity.RARE,
    description: 'Throwing the opponent from behind.',
    mechanics: { principle: 'Rear Throw', keyPoints: ['Back control', 'Throw'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'okurigake',
    name: 'Okurigake',
    kanji: '送り掛け',
    translation: 'Rear Leg Trip',
    rarity: Rarity.RARE,
    description: 'Tripping the opponent from behind.',
    mechanics: { principle: 'Rear Trip', keyPoints: ['Back control', 'Leg trip'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'okurihikiotoshi',
    name: 'Okurihikiotoshi',
    kanji: '送り引き落とし',
    translation: 'Rear Pull Down',
    rarity: Rarity.RARE,
    description: 'Pulling the opponent down backward from behind.',
    mechanics: { principle: 'Rear Pull', keyPoints: ['Back control', 'Pull back'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tsuridashi',
    name: 'Tsuridashi',
    kanji: '吊り出し',
    translation: 'Lift Out',
    rarity: Rarity.UNCOMMON,
    description: 'Lifting the opponent vertically by the mawashi and carrying them out.',
    mechanics: { principle: 'Vertical Lift', keyPoints: ['Vertical lift', 'Carry'] },
    practitioners: ['Tochinoshin'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tsuriotoshi',
    name: 'Tsuriotoshi',
    kanji: '吊り落とし',
    translation: 'Lifting Body Slam',
    rarity: Rarity.RARE,
    description: 'Lifting the opponent and slamming them down into the clay.',
    mechanics: { principle: 'Lift & Slam', keyPoints: ['High lift', 'Slam'] },
    practitioners: ['Tochinoshin'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'sokubiotoshi',
    name: 'Sokubiotoshi',
    kanji: '素首落とし',
    translation: 'Head Push Down',
    rarity: Rarity.RARE,
    description: 'Pushing the back of the opponent\'s neck down.',
    mechanics: { principle: 'Neck Pressure', keyPoints: ['Hand on neck', 'Push down'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'utchari',
    name: 'Utchari',
    kanji: 'うっちゃり',
    translation: 'Backward Pivot Throw',
    rarity: Rarity.RARE,
    description: 'A last-ditch move at the edge of the ring, twisting the opponent out while leaning back.',
    mechanics: { principle: 'Edge Reversal', keyPoints: ['Heels on straw', 'Twist'] },
    practitioners: ['Asanoyama'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kimedashi',
    name: 'Kimedashi',
    kanji: '極め出し',
    translation: 'Arm Barring Force Out',
    rarity: Rarity.UNCOMMON,
    description: 'Clamping the opponent\'s arms and forcing them out.',
    mechanics: { principle: 'Double Arm Lock', keyPoints: ['Double overhook', 'Forward drive'] },
    practitioners: ['Terunofuji'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'kimetaoshi',
    name: 'Kimetaoshi',
    kanji: '極め倒し',
    translation: 'Arm Barring Force Down',
    rarity: Rarity.UNCOMMON,
    description: 'Clamping the opponent\'s arms and forcing them down.',
    mechanics: { principle: 'Double Arm Lock', keyPoints: ['Double overhook', 'Crush down'] },
    practitioners: ['Terunofuji'],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'ushiro-motare',
    name: 'Ushiro-motare',
    kanji: '後ろもたれ',
    translation: 'Backward Lean',
    rarity: Rarity.RARE,
    description: 'Winning by leaning back against the opponent as they try to get behind you.',
    mechanics: { principle: 'Passive Weight', keyPoints: ['Lean back', 'Opponent steps out'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'waridashi',
    name: 'Waridashi',
    kanji: '割り出し',
    translation: 'Upper-Arm Force Out',
    rarity: Rarity.RARE,
    description: 'Forcing the opponent out by pushing their upper arm while holding the belt.',
    mechanics: { principle: 'Arm Block', keyPoints: ['Belt grip', 'Arm push'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'yobimodoshi',
    name: 'Yobimodoshi',
    kanji: '呼び戻し',
    translation: 'Pulling Body Slam',
    rarity: Rarity.LEGENDARY,
    description: 'Pulling the opponent forward then suddenly reversing momentum to slam them down.',
    mechanics: { principle: 'Reaction', keyPoints: ['Pull', 'Push reaction'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'koshikudake',
    name: 'Koshikudake',
    kanji: '腰砕け',
    translation: 'Inadvertent Collapse',
    rarity: Rarity.UNCOMMON,
    description: 'The opponent falls backwards on their own due to loss of balance.',
    mechanics: { principle: 'Balance Failure', keyPoints: ['Opponent error'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  
  // --- HI-WAZA (Non-Techniques) ---
  {
    id: 'isamiashi',
    name: 'Isamiashi',
    kanji: '勇み足',
    translation: 'Inadvertent Step Out',
    rarity: Rarity.COMMON,
    description: 'The opponent steps out of the ring on their own while attacking.',
    mechanics: { principle: 'Momentum Error', keyPoints: ['Forward momentum', 'Step out'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'fumidashi',
    name: 'Fumidashi',
    kanji: '踏み出し',
    translation: 'Rear Step Out',
    rarity: Rarity.UNCOMMON,
    description: 'The opponent steps out of the ring backward on their own.',
    mechanics: { principle: 'Awareness Error', keyPoints: ['Backward step', 'Ring edge'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tsukite',
    name: 'Tsukite',
    kanji: 'つき手',
    translation: 'Hand Touch',
    rarity: Rarity.UNCOMMON,
    description: 'The opponent touches the clay with their hand on their own.',
    mechanics: { principle: 'Balance Loss', keyPoints: ['Hand touch'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'tsukihiza',
    name: 'Tsukihiza',
    kanji: 'つき膝',
    translation: 'Knee Touch',
    rarity: Rarity.UNCOMMON,
    description: 'The opponent touches the clay with their knee on their own.',
    mechanics: { principle: 'Balance Loss', keyPoints: ['Knee touch'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  },
  {
    id: 'koshikudake-hi',
    name: 'Koshikudake (Hi-Waza)',
    kanji: '腰砕け',
    translation: 'Collapse',
    rarity: Rarity.UNCOMMON,
    description: 'Opponent collapses without significant contact.',
    mechanics: { principle: 'Collapse', keyPoints: ['Collapse'] },
    practitioners: [],
    animationFrames: PENDING_ANIMATION
  }
];
