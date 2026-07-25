export interface CharacterAvatar {
  id: number;
  name: string;
  category: 'Aliens & Spirits' | 'Monsters & Beasts' | 'Robots & Mechs' | 'Cute & Fuzzy' | 'Elementals & Golems';
  url: string;
}

export const CHARACTER_AVATARS: CharacterAvatar[] = [
  {
    id: 1,
    name: 'Zylo',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zylo&backgroundColor=0f172a,1e1b4b&backgroundType=gradientLinear'
  },
  {
    id: 2,
    name: 'Blimxor',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Blimxor&backgroundColor=4c1d95,581c87&backgroundType=gradientLinear'
  },
  {
    id: 3,
    name: 'Nuvix',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Nuvix&backgroundColor=0284c7,0369a1&backgroundType=gradientLinear'
  },
  {
    id: 4,
    name: 'Qorvin',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Qorvin&backgroundColor=1e293b,0f172a&backgroundType=gradientLinear'
  },
  {
    id: 5,
    name: 'Flibbit',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Flibbit&backgroundColor=065f46,047857&backgroundType=gradientLinear'
  },
  {
    id: 6,
    name: 'Rindle',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rindle&backgroundColor=1e40af,1d4ed8&backgroundType=gradientLinear'
  },
  {
    id: 7,
    name: 'Gloopi',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Gloopi&backgroundColor=701a75,86198f&backgroundType=gradientLinear'
  },
  {
    id: 8,
    name: 'Varnok',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Varnok&backgroundColor=831843,9f1239&backgroundType=gradientLinear'
  },
  {
    id: 9,
    name: 'Puffinax',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Puffinax&backgroundColor=312e81,3730a3&backgroundType=gradientLinear'
  },
  {
    id: 10,
    name: 'Skrimble',
    category: 'Elementals & Golems',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Skrimble&backgroundColor=854d0e,a16207&backgroundType=gradientLinear'
  },
  {
    id: 11,
    name: 'Daxel',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Daxel&backgroundColor=1e1b4b,311042&backgroundType=gradientLinear'
  },
  {
    id: 12,
    name: 'Marnix',
    category: 'Elementals & Golems',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marnix&backgroundColor=78350f,92400e&backgroundType=gradientLinear'
  },
  {
    id: 13,
    name: 'Yorbi',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Yorbi&backgroundColor=0f172a,1e293b&backgroundType=gradientLinear'
  },
  {
    id: 14,
    name: 'Twiblo',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Twiblo&backgroundColor=831843,9d174d&backgroundType=gradientLinear'
  },
  {
    id: 15,
    name: 'Gorvix',
    category: 'Elementals & Golems',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gorvix&backgroundColor=3f6212,4d7c0f&backgroundType=gradientLinear'
  },
  {
    id: 16,
    name: 'Plonka',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Plonka&backgroundColor=c2410c,ea580c&backgroundType=gradientLinear'
  },
  {
    id: 17,
    name: 'Wizpry',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Wizpry&backgroundColor=1e1b4b,2e1065&backgroundType=gradientLinear'
  },
  {
    id: 18,
    name: 'Snorki',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Snorki&backgroundColor=0369a1,0284c7&backgroundType=gradientLinear'
  },
  {
    id: 19,
    name: 'Krummo',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Krummo&backgroundColor=581c87,6b21a8&backgroundType=gradientLinear'
  },
  {
    id: 20,
    name: 'Lazzi',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Lazzi&backgroundColor=a16207,ca8a04&backgroundType=gradientLinear'
  },
  {
    id: 21,
    name: 'Boink',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Boink&backgroundColor=be185d,db2777&backgroundType=gradientLinear'
  },
  {
    id: 22,
    name: 'Rivva',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Rivva&backgroundColor=0284c7,38bdf8&backgroundType=gradientLinear'
  },
  {
    id: 23,
    name: 'Zorlen',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zorlen&backgroundColor=0f172a,334155&backgroundType=gradientLinear'
  },
  {
    id: 24,
    name: 'Tikbox',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Tikbox&backgroundColor=854d0e,b45309&backgroundType=gradientLinear'
  },
  {
    id: 25,
    name: 'Noktu',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Noktu&backgroundColor=090d16,111827&backgroundType=gradientLinear'
  },
  {
    id: 26,
    name: 'Pebloo',
    category: 'Elementals & Golems',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Pebloo&backgroundColor=334155,475569&backgroundType=gradientLinear'
  },
  {
    id: 27,
    name: 'Jibber',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Jibber&backgroundColor=ca8a04,eab308&backgroundType=gradientLinear'
  },
  {
    id: 28,
    name: 'Muxi',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Muxi&backgroundColor=0f172a,1e293b&backgroundType=gradientLinear'
  },
  {
    id: 29,
    name: 'Gaxxo',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Gaxxo&backgroundColor=991b1b,dc2626&backgroundType=gradientLinear'
  },
  {
    id: 30,
    name: 'Sprigi',
    category: 'Elementals & Golems',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sprigi&backgroundColor=15803d,16a34a&backgroundType=gradientLinear'
  },
  {
    id: 31,
    name: 'Veloop',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Veloop&backgroundColor=b45309,d97706&backgroundType=gradientLinear'
  },
  {
    id: 32,
    name: 'Bunshi',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bunshi&backgroundColor=1e1b4b,312e81&backgroundType=gradientLinear'
  },
  {
    id: 33,
    name: 'Quibz',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Quibz&backgroundColor=6b21a8,7e22ce&backgroundType=gradientLinear'
  },
  {
    id: 34,
    name: 'Xuni',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Xuni&backgroundColor=0f766e,0d9488&backgroundType=gradientLinear'
  },
  {
    id: 35,
    name: 'Dremlok',
    category: 'Elementals & Golems',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dremlok&backgroundColor=14532d,15803d&backgroundType=gradientLinear'
  },
  {
    id: 36,
    name: 'Oogla',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Oogla&backgroundColor=581c87,7e22ce&backgroundType=gradientLinear'
  },
  {
    id: 37,
    name: 'Mezzlo',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mezzlo&backgroundColor=78350f,b45309&backgroundType=gradientLinear'
  },
  {
    id: 38,
    name: 'Nimby',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Nimby&backgroundColor=15803d,22c55e&backgroundType=gradientLinear'
  },
  {
    id: 39,
    name: 'Orbix',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Orbix&backgroundColor=1e293b,334155&backgroundType=gradientLinear'
  },
  {
    id: 40,
    name: 'Floopz',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Floopz&backgroundColor=9d174d,c026d3&backgroundType=gradientLinear'
  },
  {
    id: 41,
    name: 'Crindle',
    category: 'Elementals & Golems',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Crindle&backgroundColor=334155,475569&backgroundType=gradientLinear'
  },
  {
    id: 42,
    name: 'Bozzik',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Bozzik&backgroundColor=991b1b,b91c1c&backgroundType=gradientLinear'
  },
  {
    id: 43,
    name: 'Shlomo',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Shlomo&backgroundColor=047857,10b981&backgroundType=gradientLinear'
  },
  {
    id: 44,
    name: 'Zappy',
    category: 'Elementals & Golems',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Zappy&backgroundColor=a16207,eab308&backgroundType=gradientLinear'
  },
  {
    id: 45,
    name: 'Vixlet',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Vixlet&backgroundColor=6b21a8,9333ea&backgroundType=gradientLinear'
  },
  {
    id: 46,
    name: 'Klinko',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Klinko&backgroundColor=0369a1,0284c7&backgroundType=gradientLinear'
  },
  {
    id: 47,
    name: 'Doodix',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Doodix&backgroundColor=090d16,111827&backgroundType=gradientLinear'
  },
  {
    id: 48,
    name: 'Yomp',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Yomp&backgroundColor=1d4ed8,2563eb&backgroundType=gradientLinear'
  },
  {
    id: 49,
    name: 'Trellix',
    category: 'Elementals & Golems',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Trellix&backgroundColor=14532d,166534&backgroundType=gradientLinear'
  },
  {
    id: 50,
    name: 'Grovia',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Grovia&backgroundColor=15803d,4338ca&backgroundType=gradientLinear'
  },
  {
    id: 51,
    name: 'Jorple',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Jorple&backgroundColor=ca8a04,f59e0b&backgroundType=gradientLinear'
  },
  {
    id: 52,
    name: 'Huxley',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Huxley&backgroundColor=854d0e,d97706&backgroundType=gradientLinear'
  },
  {
    id: 53,
    name: 'Blornt',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Blornt&backgroundColor=581c87,7e22ce&backgroundType=gradientLinear'
  },
  {
    id: 54,
    name: 'Kivvi',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Kivvi&backgroundColor=0f766e,14b8a6&backgroundType=gradientLinear'
  },
  {
    id: 55,
    name: 'Snubble',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Snubble&backgroundColor=be185d,e11d48&backgroundType=gradientLinear'
  },
  {
    id: 56,
    name: 'Zintar',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zintar&backgroundColor=0f172a,1e1b4b&backgroundType=gradientLinear'
  },
  {
    id: 57,
    name: 'Whimzo',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Whimzo&backgroundColor=1e3a8a,3b82f6&backgroundType=gradientLinear'
  },
  {
    id: 58,
    name: 'Larviq',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Larviq&backgroundColor=c2410c,f97316&backgroundType=gradientLinear'
  },
  {
    id: 59,
    name: 'Moklu',
    category: 'Elementals & Golems',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Moklu&backgroundColor=3f6212,65a30d&backgroundType=gradientLinear'
  },
  {
    id: 60,
    name: 'Pibitz',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Pibitz&backgroundColor=9d174d,f43f5e&backgroundType=gradientLinear'
  },
  {
    id: 61,
    name: 'Zeekos',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zeekos&backgroundColor=0e7490,06b6d4&backgroundType=gradientLinear'
  },
  {
    id: 62,
    name: 'Yubbo',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Yubbo&backgroundColor=1e293b,0284c7&backgroundType=gradientLinear'
  },
  {
    id: 63,
    name: 'Griblo',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Griblo&backgroundColor=15803d,22c55e&backgroundType=gradientLinear'
  },
  {
    id: 64,
    name: 'Ovren',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ovren&backgroundColor=1e1b4b,581c87&backgroundType=gradientLinear'
  },
  {
    id: 65,
    name: 'Brezzy',
    category: 'Aliens & Spirits',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Brezzy&backgroundColor=0284c7,38bdf8&backgroundType=gradientLinear'
  },
  {
    id: 66,
    name: 'Nuxel',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Nuxel&backgroundColor=c2410c,ea580c&backgroundType=gradientLinear'
  },
  {
    id: 67,
    name: 'Kabloo',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Kabloo&backgroundColor=701a75,a21caf&backgroundType=gradientLinear'
  },
  {
    id: 68,
    name: 'Dwigg',
    category: 'Cute & Fuzzy',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dwigg&backgroundColor=78350f,a16207&backgroundType=gradientLinear'
  },
  {
    id: 69,
    name: 'Frumzi',
    category: 'Monsters & Beasts',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Frumzi&backgroundColor=047857,10b981&backgroundType=gradientLinear'
  },
  {
    id: 70,
    name: 'Lurkko',
    category: 'Robots & Mechs',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Lurkko&backgroundColor=090d16,1e1b4b&backgroundType=gradientLinear'
  }
];
