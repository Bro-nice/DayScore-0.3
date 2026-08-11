export type AvatarCategory = 'Aliens & Spirits' | 'Monsters & Beasts' | 'Robots & Mechs' | 'Cute & Fuzzy' | 'Elementals & Golems';

export interface CharacterAvatar {
  id: number;
  name: string;
  category: AvatarCategory;
  url: string;
}

export function getFallbackAvatarSvg(name: string = 'User'): string {
  const cleanName = name.trim() || 'Student';
  const initial = cleanName.charAt(0).toUpperCase();
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradients = [
    ['#7c3aed', '#db2777'],
    ['#2563eb', '#06b6d4'],
    ['#059669', '#10b981'],
    ['#d97706', '#f59e0b'],
    ['#9333ea', '#4f46e5'],
    ['#e11d48', '#f43f5e'],
    ['#0891b2', '#0284c7']
  ];
  const pair = gradients[Math.abs(hash) % gradients.length];
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${pair[0]}" />
        <stop offset="100%" stop-color="${pair[1]}" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="50" fill="url(#bgGrad)" />
    <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2" />
    <text x="50" y="58" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="42" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initial}</text>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CHARACTER_AVATARS: CharacterAvatar[] = [
  { id: 1, name: 'Zylo', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Zylo&backgroundColor=0f172a,312e81&backgroundType=gradientLinear' },
  { id: 2, name: 'Blimxor', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Blimxor&backgroundColor=4c1d95,7e22ce&backgroundType=gradientLinear' },
  { id: 3, name: 'Nuvix', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Nuvix&backgroundColor=0284c7,38bdf8&backgroundType=gradientLinear' },
  { id: 4, name: 'Qorvin', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Qorvin&backgroundColor=1e293b,0f172a&backgroundType=gradientLinear' },
  { id: 5, name: 'Flibbit', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Flibbit&backgroundColor=065f46,10b981&backgroundType=gradientLinear' },
  { id: 6, name: 'Rindle', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Rindle&backgroundColor=1e40af,3b82f6&backgroundType=gradientLinear' },
  { id: 7, name: 'Gloopi', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Gloopi&backgroundColor=701a75,c026d3&backgroundType=gradientLinear' },
  { id: 8, name: 'Varnok', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Varnok&backgroundColor=831843,e11d48&backgroundType=gradientLinear' },
  { id: 9, name: 'Puffinax', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Puffinax&backgroundColor=312e81,6366f1&backgroundType=gradientLinear' },
  { id: 10, name: 'Skrimble', category: 'Elementals & Golems', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Skrimble&backgroundColor=854d0e,eab308&backgroundType=gradientLinear' },

  { id: 11, name: 'Daxel', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Daxel&backgroundColor=1e1b4b,4c1d95&backgroundType=gradientLinear' },
  { id: 12, name: 'Marnix', category: 'Elementals & Golems', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Marnix&backgroundColor=78350f,d97706&backgroundType=gradientLinear' },
  { id: 13, name: 'Yorbi', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Yorbi&backgroundColor=0f172a,334155&backgroundType=gradientLinear' },
  { id: 14, name: 'Twiblo', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Twiblo&backgroundColor=831843,f43f5e&backgroundType=gradientLinear' },
  { id: 15, name: 'Gorvix', category: 'Elementals & Golems', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Gorvix&backgroundColor=14532d,22c55e&backgroundType=gradientLinear' },
  { id: 16, name: 'Plonka', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Plonka&backgroundColor=c2410c,f97316&backgroundType=gradientLinear' },
  { id: 17, name: 'Wizpry', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Wizpry&backgroundColor=4c1d95,a855f7&backgroundType=gradientLinear' },
  { id: 18, name: 'Snorki', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Snorki&backgroundColor=0369a1,38bdf8&backgroundType=gradientLinear' },
  { id: 19, name: 'Krummo', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Krummo&backgroundColor=581c87,9333ea&backgroundType=gradientLinear' },
  { id: 20, name: 'Lazzi', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Lazzi&backgroundColor=0e7490,06b6d4&backgroundType=gradientLinear' },

  { id: 21, name: 'Boink', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Boink&backgroundColor=be185d,f43f5e&backgroundType=gradientLinear' },
  { id: 22, name: 'Rivva', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Rivva&backgroundColor=1e3a8a,3b82f6&backgroundType=gradientLinear' },
  { id: 23, name: 'Zorlen', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Zorlen&backgroundColor=0f172a,475569&backgroundType=gradientLinear' },
  { id: 24, name: 'Tikbox', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Tikbox&backgroundColor=854d0e,f59e0b&backgroundType=gradientLinear' },
  { id: 25, name: 'Noktu', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Noktu&backgroundColor=0284c7,06b6d4&backgroundType=gradientLinear' },
  { id: 26, name: 'Pebloo', category: 'Elementals & Golems', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Pebloo&backgroundColor=334155,64748b&backgroundType=gradientLinear' },
  { id: 27, name: 'Jibber', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Jibber&backgroundColor=a16207,facc15&backgroundType=gradientLinear' },
  { id: 28, name: 'Muxi', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Muxi&backgroundColor=0f766e,2dd4bf&backgroundType=gradientLinear' },
  { id: 29, name: 'Gaxxo', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Gaxxo&backgroundColor=991b1b,ef4444&backgroundType=gradientLinear' },
  { id: 30, name: 'Sprigi', category: 'Elementals & Golems', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Sprigi&backgroundColor=15803d,22c55e&backgroundType=gradientLinear' },

  { id: 31, name: 'Veloop', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Veloop&backgroundColor=b45309,f59e0b&backgroundType=gradientLinear' },
  { id: 32, name: 'Bunshi', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Bunshi&backgroundColor=1e1b4b,4338ca&backgroundType=gradientLinear' },
  { id: 33, name: 'Quibz', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Quibz&backgroundColor=6b21a8,a855f7&backgroundType=gradientLinear' },
  { id: 34, name: 'Xuni', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Xuni&backgroundColor=0f766e,14b8a6&backgroundType=gradientLinear' },
  { id: 35, name: 'Dremlok', category: 'Elementals & Golems', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Dremlok&backgroundColor=14532d,16a34a&backgroundType=gradientLinear' },
  { id: 36, name: 'Oogla', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Oogla&backgroundColor=581c87,a855f7&backgroundType=gradientLinear' },
  { id: 37, name: 'Mezzlo', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Mezzlo&backgroundColor=78350f,f59e0b&backgroundType=gradientLinear' },
  { id: 38, name: 'Nimby', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Nimby&backgroundColor=15803d,4ade80&backgroundType=gradientLinear' },
  { id: 39, name: 'Orbix', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Orbix&backgroundColor=1e293b,475569&backgroundType=gradientLinear' },
  { id: 40, name: 'Floopz', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Floopz&backgroundColor=9d174d,d946ef&backgroundType=gradientLinear' },

  { id: 41, name: 'Crindle', category: 'Elementals & Golems', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Crindle&backgroundColor=334155,64748b&backgroundType=gradientLinear' },
  { id: 42, name: 'Bozzik', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Bozzik&backgroundColor=991b1b,ef4444&backgroundType=gradientLinear' },
  { id: 43, name: 'Shlomo', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Shlomo&backgroundColor=047857,34d399&backgroundType=gradientLinear' },
  { id: 44, name: 'Zappy', category: 'Elementals & Golems', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Zappy&backgroundColor=a16207,facc15&backgroundType=gradientLinear' },
  { id: 45, name: 'Vixlet', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Vixlet&backgroundColor=6b21a8,c084fc&backgroundType=gradientLinear' },
  { id: 46, name: 'Klinko', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Klinko&backgroundColor=0369a1,38bdf8&backgroundType=gradientLinear' },
  { id: 47, name: 'Doodix', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Doodix&backgroundColor=090d16,3b82f6&backgroundType=gradientLinear' },
  { id: 48, name: 'Yomp', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Yomp&backgroundColor=1d4ed8,60a5fa&backgroundType=gradientLinear' },
  { id: 49, name: 'Trellix', category: 'Elementals & Golems', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Trellix&backgroundColor=14532d,22c55e&backgroundType=gradientLinear' },
  { id: 50, name: 'Grovia', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Grovia&backgroundColor=15803d,6366f1&backgroundType=gradientLinear' },

  { id: 51, name: 'Jorple', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Jorple&backgroundColor=ca8a04,fbbf24&backgroundType=gradientLinear' },
  { id: 52, name: 'Huxley', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Huxley&backgroundColor=854d0e,f59e0b&backgroundType=gradientLinear' },
  { id: 53, name: 'Blornt', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Blornt&backgroundColor=581c87,c084fc&backgroundType=gradientLinear' },
  { id: 54, name: 'Kivvi', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Kivvi&backgroundColor=0f766e,2dd4bf&backgroundType=gradientLinear' },
  { id: 55, name: 'Snubble', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Snubble&backgroundColor=be185d,f43f5e&backgroundType=gradientLinear' },
  { id: 56, name: 'Zintar', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Zintar&backgroundColor=0f172a,6366f1&backgroundType=gradientLinear' },
  { id: 57, name: 'Whimzo', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Whimzo&backgroundColor=1e3a8a,60a5fa&backgroundType=gradientLinear' },
  { id: 58, name: 'Larviq', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Larviq&backgroundColor=c2410c,fb923c&backgroundType=gradientLinear' },
  { id: 59, name: 'Moklu', category: 'Elementals & Golems', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Moklu&backgroundColor=3f6212,84cc16&backgroundType=gradientLinear' },
  { id: 60, name: 'Pibitz', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Pibitz&backgroundColor=9d174d,fb7185&backgroundType=gradientLinear' },

  { id: 61, name: 'Zeekos', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Zeekos&backgroundColor=0e7490,22d3ee&backgroundType=gradientLinear' },
  { id: 62, name: 'Yubbo', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Yubbo&backgroundColor=1e293b,38bdf8&backgroundType=gradientLinear' },
  { id: 63, name: 'Griblo', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Griblo&backgroundColor=15803d,4ade80&backgroundType=gradientLinear' },
  { id: 64, name: 'Ovren', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Ovren&backgroundColor=1e1b4b,a855f7&backgroundType=gradientLinear' },
  { id: 65, name: 'Brezzy', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Brezzy&backgroundColor=0284c7,38bdf8&backgroundType=gradientLinear' },
  { id: 66, name: 'Nuxel', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Nuxel&backgroundColor=c2410c,f97316&backgroundType=gradientLinear' },
  { id: 67, name: 'Kabloo', category: 'Monsters & Beasts', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Kabloo&backgroundColor=701a75,d946ef&backgroundType=gradientLinear' },
  { id: 68, name: 'Dwigg', category: 'Cute & Fuzzy', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Dwigg&backgroundColor=78350f,f59e0b&backgroundType=gradientLinear' },
  { id: 69, name: 'Frumzi', category: 'Aliens & Spirits', url: 'https://api.dicebear.com/9.x/3d/svg?seed=Frumzi&backgroundColor=047857,34d399&backgroundType=gradientLinear' },
  { id: 70, name: 'Lurkko', category: 'Robots & Mechs', url: 'https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Lurkko&backgroundColor=090d16,6366f1&backgroundType=gradientLinear' }
];
